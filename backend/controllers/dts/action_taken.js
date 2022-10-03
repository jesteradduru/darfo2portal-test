// controller/handlers for actions requests
const { Trail } = require("../helpers/trail");
const _ = require("lodash");

const getCurrentUser = async (user_id, trx) => {
  return trx("users")
    .withSchema("portal")
    .select("*")
    .rightJoin("employees", "users.emp_id", "employees.emp_id")
    .leftJoin("roles", "users.role_id", "roles.role_id")
    .leftJoin("offices", "employees.office_id", "offices.office_id")
    .where("users.user_id", "=", user_id)
    .then((data) => data[0]);
};

const handleAddActionTaken = (req, res, db, socket, receiveNotification) => {
  try {
    db.transaction(async (trx) => {
      const { action_taken, com_id } = req.body;

      const act_id = await trx("actions_taken")
        .withSchema("dts")
        .insert({
          act_taken: action_taken,
          com_id: com_id,
          user_id: req.user.user_id,
          act_date: db.fn.now(),
          act_last_touch: [req.user.user_id],
        })
        .returning("act_id")
        .then((data) => data[0]);
        console.log(act_id)
      if (req.files["scanned"])
        await req.files["scanned"].forEach(async (file) => {
          await trx("scanned_copies")
            .withSchema("dts")
            .insert({
              act_id: act_id,
              scan_path: file.path,
              scan_name: file.originalname,
            })
            .catch(console.log);
        });

      if (req.files["attachments"])
        await req.files["attachments"].forEach(async (file) => {
          await trx("attachments")
            .withSchema("dts")
            .insert({
              act_id: act_id,
              attach_path: file.path,
              attach_name: file.originalname,
            })
            .catch(console.log);
        });

      // const actor = await trx("users")
      //   .withSchema("portal")
      //   .select(["offices.*", 'employees.*'])
      //   .rightJoin("employees", "users.emp_id", "employees.emp_id")
      //   // .leftJoin("roles", "users.role_id", "roles.role_id")
      //   .leftJoin("offices", "employees.office_id", "offices.office_id")
      //   .where("users.user_id", "=", req.user.user_id)
      //   .then((data) => data[0]);

      // const reviewer = await trx("users")
      //   .withSchema("portal")
      //   .select(["users.user_id", 'employees.*', 'offices.*'])
      //   .rightJoin("employees", "users.emp_id", "employees.emp_id")
      //   .leftJoin("roles", "users.role_id", "roles.role_id")
      //   .leftJoin("offices", "employees.office_id", "offices.office_id")
      //   .where("offices.office_id", "=", actor.office_id)
      //   .andWhere("roles.role_name", "=", "End-user Approver")
      //   .then((data) => data[0]);
      const reviewer = await trx
        .raw(
          `
          SELECT users.user_id, employees.*, offices.* FROM dts.routing
          INNER JOIN portal.users ON users.user_id = routing.routing_from
          INNER JOIN portal.employees ON users.emp_id = employees.emp_id
          INNER JOIN portal.offices ON employees.office_id = offices.office_id
          WHERE routing.routing_to = ${req.user.user_id}
          AND routing.com_id = ${com_id}
        `
        )
        .then((data) => data.rows[0]);

      const control_no = await trx("communications")
        .withSchema("dts")
        .select("com_controlNo")
        .where("com_id", "=", com_id)
        .then((data) => data[0]);

      var inbox = await trx("inbox")
        .withSchema("dts")
        .insert({
          com_id: com_id,
          inbox_sender_id: req.user.user_id,
          inbox_receiver_id: reviewer.user_id,
          inbox_date_sent: db.fn.now(),
          inbox_task: ["viewCommunication", "viewRouting", "reviewAction"],
          act_id: act_id,
        })
        .returning(["inbox_receiver_id", "inbox_task", "inbox_id"])
        .then((data) => data[0])
        .catch((err) => console.log(err));

      const notification = {
        title: "Review Action Taken",
        message: `${req.user.user_username} submitted ${control_no.com_controlNo}`,
        tasks: inbox.inbox_task,
        link: `/dts/managementOfCommunications/inbox/viewTask/${inbox.inbox_id}/${com_id}`,
      };

      receiveNotification(reviewer.user_id, notification, socket);

      const reviewer_name = `${reviewer.emp_firstname} ${reviewer.emp_middlename[0]} ${reviewer.emp_lastname} - ${reviewer.office_code}`;

      const document_trail = new Trail(db, {
        description: `Added action taken. To be reviewed by ${reviewer_name}.`,
        com_id: com_id,
        trail_date: inbox.inbox_date_sent,
        act_id: act_id,
        user_id: req.user.user_id,
      });

      await trx("document_trail")
        .withSchema("dts")
        .insert(document_trail.getTrail())
        .catch(console.log);

      res.json({ act_id: act_id });
    });
  } catch (error) {
    console.log(error);
  }
};

const handleGetActionTaken = (req, res, db) => {
  try {
    db.transaction(async (trx) => {
      const { inbox_id } = req.body;

      const act_id = await trx("inbox")
        .withSchema("dts")
        .select("act_id")
        .where("inbox_id", "=", inbox_id)
        .then((data) => data[0].act_id);

      const action_taken = await trx("actions_taken")
        .withSchema("dts")
        .select("*")
        .where("act_id", "=", act_id)
        .then((data) => data);

      const user = await trx("users")
        .withSchema("portal")
        .select(["employees.*", "offices.office_code"])
        .leftJoin("employees", "employees.emp_id", "users.emp_id")
        .rightJoin("offices", "employees.office_id", "offices.office_id")
        .where("users.user_id", "=", action_taken[0].user_id)
        .then((data) => data[0]);

      let last_touch = {};

      if (!_.isEmpty(action_taken[0].act_last_touch)) {
        last_touch = await trx("users")
          .withSchema("portal")
          .select(["employees.*", "offices.office_code"])
          .leftJoin("employees", "employees.emp_id", "users.emp_id")
          .rightJoin("offices", "employees.office_id", "offices.office_id")
          .where("users.user_id", "=", action_taken[0].act_last_touch[0])
          .then((data) => data[0]);
      }

      const rejectedBy = await trx("users")
        .withSchema("portal")
        .select(["employees.*", "offices.office_code"])
        .leftJoin("employees", "employees.emp_id", "users.emp_id")
        .rightJoin("offices", "employees.office_id", "offices.office_id")
        .where("users.user_id", "=", action_taken[0].act_rejectedBy)
        .then((data) => data[0]);

      const scanned = await trx("scanned_copies")
        .withSchema("dts")
        .select("*")
        .where("act_id", "=", action_taken[0].act_id)
        .then((data) => data);

      const attachments = await trx("attachments")
        .withSchema("dts")
        .select("*")
        .where("act_id", "=", action_taken[0].act_id)
        .then((data) => data);

      res.json({
        action_taken: { ...action_taken[0], attachments, scanned },
        user,
        last_touch,
        rejectedBy,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const handleReviewActionTaken = (req, res, db, socket, receiveNotification) => {
  try {
    const {
      act_id,
      reject_remarks = null,
      approve_reject,
      action_taken,
      inbox_id,
      com_id,
    } = req.body;

    db.transaction(async (trx) => {
      if (approve_reject === "approve") {
        let approver = await trx
          .raw(
            `
            SELECT users.user_id, employees.*, offices.*, roles.* FROM dts.routing
            INNER JOIN portal.users ON users.user_id = routing.routing_from
            INNER JOIN portal.employees ON users.emp_id = employees.emp_id
            INNER JOIN portal.roles ON users.role_id = roles.role_id
            INNER JOIN portal.offices ON employees.office_id = offices.office_id
            WHERE routing.routing_to = ${req.user.user_id}
            AND routing.com_id = ${com_id}
          `
          )
          .then((data) => data.rows[0]);

        const red = await trx
          .raw(
            `
            SELECT users.user_id, employees.*, offices.*, roles.* FROM portal.users
            INNER JOIN portal.employees ON users.emp_id = employees.emp_id
            INNER JOIN portal.roles ON users.role_id = roles.role_id
            INNER JOIN portal.offices ON employees.office_id = offices.office_id
            WHERE roles.role_name = 'Process-level Reviewer'
          `
          )
          .then((data) => data.rows[0]);

        if (red.user_id === req.user.user_id) {
          const action = await trx("actions_taken")
            .withSchema("dts")
            .update({ act_status: "approved" })
            .returning("*")
            .where("act_id", "=", act_id)
            .then((data) => data[0]);

          if (req.files["scanned"]) {
            await req.files["scanned"].forEach(async (file) => {
              await trx("signed_com_attachments")
                .withSchema("dts")
                .insert({
                  act_id: action.act_id,
                  scan_path: file.path,
                  scan_name: file.originalname,
                })
                .catch(console.log);
            });
          }

          const document_trail = new Trail(db, {
            description: `Action taken approved. Communication complied.`,
            com_id: action.com_id,
            trail_date: db.fn.now(),
            act_id: act_id,
            user_id: req.user.user_id,
          });

          await trx("document_trail")
            .withSchema("dts")
            .insert(document_trail.getTrail())
            .catch(console.log);

          return res.json(action);
        }
        const last_touch = await trx("actions_taken")
          .withSchema("dts")
          .select("act_last_touch")
          .where("act_id", "=", act_id)
          .then((data) => data[0].act_last_touch);

        const action = await trx("actions_taken")
          .withSchema("dts")
          .update({
            act_taken: action_taken,
            act_last_touch: [req.user.user_id, ...last_touch],
          })
          .returning("*")
          .where("act_id", "=", act_id)
          .then((data) => data[0]);

        const control_no = await trx("communications")
          .withSchema("dts")
          .select("com_controlNo")
          .where("com_id", "=", action.com_id)
          .then((data) => data[0]);

        if (approver.role_name === "Process-level Approver") {
          approver = red;
        }
        var inbox = await trx("inbox")
          .withSchema("dts")
          .insert({
            com_id: action.com_id,
            inbox_sender_id: req.user.user_id,
            inbox_receiver_id: approver.user_id,
            inbox_date_sent: db.fn.now(),
            inbox_task: ["viewCommunication", "viewRouting", "reviewAction"],
            act_id: act_id,
          })
          .returning(["inbox_receiver_id", "inbox_task", "inbox_id"])
          .then((data) => data[0])
          .catch((err) => console.log(err));

        const notification = {
          title: "Review Action Taken",
          message: `${req.user.user_username} submitted ${control_no.com_controlNo}`,
          tasks: inbox.inbox_task,
          link: `/dts/managementOfCommunications/inbox/viewTask/${inbox.inbox_id}/${action.com_id}`,
        };

        receiveNotification(approver.user_id, notification, socket);

        const reviewer_name = `${approver.emp_firstname} ${approver.emp_middlename[0]} ${approver.emp_lastname} - ${approver.office_code}`;

        const document_trail = new Trail(db, {
          description: `Action taken approved. To be reviewed by ${reviewer_name}.`,
          com_id: action.com_id,
          trail_date: inbox.inbox_date_sent,
          act_id: act_id,
          user_id: req.user.user_id,
        });

        await trx("document_trail")
          .withSchema("dts")
          .insert(document_trail.getTrail())
          .catch(console.log);

        res.json(action);
      } else {
        const red = await trx("users")
          .withSchema("portal")
          .select("user_id")
          .rightJoin("employees", "users.emp_id", "employees.emp_id")
          .leftJoin("roles", "users.role_id", "roles.role_id")
          .where("roles.role_name", "=", "Process-level Reviewer")
          .then((data) => data[0]);

        const last_touch = await trx("actions_taken")
          .withSchema("dts")
          .select("act_last_touch")
          .where("act_id", "=", act_id)
          .then((data) => data[0].act_last_touch);

        // const approver = await trx.raw(
        //   `
        //     SELECT users.user_id, employees.*, offices.* FROM dts.routing
        //     INNER JOIN portal.users ON users.user_id = routing.routing_from
        //     INNER JOIN portal.employees ON users.emp_id = employees.emp_id
        //     INNER JOIN portal.offices ON employees.office_id = offices.office_id
        //     WHERE routing.routing_from = ${req.user.user_id}
        //     AND routing.com_id = ${com_id}
        //   `
        // )
        //   .then((data) => data.rows[0]);

        if (red.user_id === req.user.user_id) {
          last_touch.shift();

          const action = await trx("actions_taken")
            .withSchema("dts")
            .update({
              act_status: "revise",
              act_remarks: reject_remarks,
              act_rejectedBy: req.user.user_id,
              act_reject_date: db.fn.now(),
              act_last_touch: last_touch,
            })
            .returning("*")
            .where("act_id", "=", act_id)
            .then((data) => data[0]);

          const inbox_sender_id = await trx("inbox")
            .withSchema("dts")
            .select("inbox_sender_id")
            .where("inbox_id", "=", inbox_id)
            .then((data) => data[0].inbox_sender_id);

          const inbox = await trx("inbox")
            .withSchema("dts")
            .insert({
              com_id: action.com_id,
              inbox_sender_id: req.user.user_id,
              inbox_receiver_id: inbox_sender_id,
              inbox_date_sent: db.fn.now(),
              inbox_task: [
                "viewCommunication",
                "viewRouting",
                "reforwardForAction",
              ],
              act_id: act_id,
            })
            .returning(["inbox_receiver_id", "inbox_task", "inbox_id"])
            .then((data) => data[0])
            .catch((err) => console.log(err));

          const control_no = await trx("communications")
            .withSchema("dts")
            .select("com_controlNo")
            .where("com_id", "=", action.com_id)
            .then((data) => data[0]);

          const notification = {
            title: "Action Taken For Revision",
            message: `${req.user.user_username} submitted ${control_no.com_controlNo}`,
            tasks: inbox.inbox_task,
            link: `/dts/managementOfCommunications/inbox/viewTask/${inbox.inbox_id}/${action.com_id}`,
          };

          receiveNotification(inbox_sender_id, notification, socket);

          const user = await trx("users")
            .withSchema("portal")
            .select([
              "employees.*",
              "users.emp_id",
              "offices.office_code",
              "roles.role_name",
            ])
            .leftJoin("roles", "users.role_id", "roles.role_id")
            .leftJoin("employees", "employees.emp_id", "users.emp_id")
            .leftJoin("offices", "offices.office_id", "employees.office_id")
            .where("users.user_id", "=", inbox.inbox_receiver_id)
            .then((data) => data[0]);
          const name = `${user.emp_firstname} ${user.emp_middlename[0]} ${user.emp_lastname} - ${user.office_code}`;
          const document_trail = new Trail(db, {
            description: `Action taken for revision. Reforwarded to ${name}.`,
            com_id: action.com_id,
            trail_date: inbox.inbox_date_sent,
            act_id: act_id,
            user_id: req.user.user_id,
          });

          await trx("document_trail")
            .withSchema("dts")
            .insert(document_trail.getTrail())
            .catch(console.log);

          return res.json(action);
        }

        const action = await trx("actions_taken")
          .withSchema("dts")
          .update({
            act_remarks: reject_remarks,
            act_status: "revise",
            act_rejectedBy: req.user.user_id,
            act_reject_date: db.fn.now(),
          })
          .returning("*")
          .where("act_id", "=", act_id)
          .then((data) => data[0]);

        const inbox = await trx("inbox")
          .withSchema("dts")
          .insert({
            com_id: action.com_id,
            inbox_sender_id: req.user.user_id,
            inbox_receiver_id: last_touch[0],
            inbox_date_sent: db.fn.now(),
            inbox_task: [
              "viewCommunication",
              "viewRouting",
              "viewActionStatus",
              "addAction",
            ],
            act_id: act_id,
          })
          .returning(["inbox_receiver_id", "inbox_task", "inbox_id"])
          .then((data) => data[0])
          .catch((err) => console.log(err));

        const control_no = await trx("communications")
          .withSchema("dts")
          .select("com_controlNo")
          .where("com_id", "=", action.com_id)
          .then((data) => data[0]);

        const notification = {
          title: "Action Taken For Revision",
          message: `${req.user.user_username} submitted ${control_no.com_controlNo}`,
          tasks: inbox.inbox_task,
          link: `/dts/managementOfCommunications/inbox/viewTask/${inbox.inbox_id}/${action.com_id}`,
        };

        receiveNotification(last_touch[0], notification, socket);

        const user = await trx("users")
          .withSchema("portal")
          .select([
            "employees.*",
            "users.emp_id",
            "offices.office_code",
            "roles.role_name",
          ])
          .leftJoin("roles", "users.role_id", "roles.role_id")
          .leftJoin("employees", "employees.emp_id", "users.emp_id")
          .leftJoin("offices", "offices.office_id", "employees.office_id")
          .where("users.user_id", "=", inbox.inbox_receiver_id)
          .then((data) => data[0]);
        const name = `${user.emp_firstname} ${user.emp_middlename[0]} ${user.emp_lastname} - ${user.office_code}`;
        const document_trail = new Trail(db, {
          description: `Action taken for revision. Reforwarded to ${name}.`,
          com_id: action.com_id,
          trail_date: inbox.inbox_date_sent,
          act_id: act_id,
          user_id: req.user.user_id,
        });

        await trx("document_trail")
          .withSchema("dts")
          .insert(document_trail.getTrail())
          .catch(console.log);

        res.json(action);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const handleReforwardForAction = (
  req,
  res,
  db,
  socket,
  receiveNotification
) => {
  try {
    db.transaction(async (trx) => {
      const { act_id, com_id, user_id } = req.body;

      const last_touch = await trx("actions_taken")
        .withSchema("dts")
        .select("act_last_touch")
        .where("act_id", "=", act_id)
        .then((data) => data[0].act_last_touch);

      const last_touch_user = await getCurrentUser(last_touch[0], trx);

      let tasks = [
        "viewCommunication",
        "viewRouting",
        "viewActionStatus",
        "addAction",
      ];

      if (last_touch_user.role_name.includes("Approver")) {
        tasks = ["viewCommunication", "viewRouting", "reforwardForAction"];
      }

      const inbox = await trx("inbox")
        .withSchema("dts")
        .insert({
          com_id: com_id,
          inbox_sender_id: req.user.user_id,
          inbox_receiver_id: last_touch[0],
          inbox_date_sent: db.fn.now(),
          inbox_task: tasks,
          act_id: act_id,
        })
        .returning(["inbox_receiver_id", "inbox_task", "inbox_id"])
        .then((data) => data[0])
        .catch((err) => console.log(err));

      last_touch.shift();

      console.log(last_touch);

      const action = await trx("actions_taken")
        .withSchema("dts")
        .update({
          act_last_touch: [...last_touch],
        })
        .returning("*")
        .where("act_id", "=", act_id)
        .then((data) => data[0]);

      const control_no = await trx("communications")
        .withSchema("dts")
        .select("com_controlNo")
        .where("com_id", "=", com_id)
        .then((data) => data[0]);

      const notification = {
        title: "Action Taken For Revision",
        message: `${req.user.user_username} submitted ${control_no.com_controlNo}`,
        tasks: inbox.inbox_task,
        link: `/dts/managementOfCommunications/inbox/viewTask/${inbox.inbox_id}/${com_id}`,
      };

      const user = await trx("users")
        .withSchema("portal")
        .select([
          "employees.*",
          "users.emp_id",
          "offices.office_code",
          "roles.role_name",
        ])
        .leftJoin("roles", "users.role_id", "roles.role_id")
        .leftJoin("employees", "employees.emp_id", "users.emp_id")
        .leftJoin("offices", "offices.office_id", "employees.office_id")
        .where("users.user_id", "=", inbox.inbox_receiver_id)
        .then((data) => data[0]);
      const name = `${user.emp_firstname} ${user.emp_middlename[0]} ${user.emp_lastname} - ${user.office_code}`;
      const document_trail = new Trail(db, {
        description: `Action taken for revision. Reforwarded to ${name}.`,
        com_id: com_id,
        trail_date: inbox.inbox_date_sent,
        act_id: act_id,
        user_id: req.user.user_id,
      });

      await trx("document_trail")
        .withSchema("dts")
        .insert(document_trail.getTrail())
        .catch(console.log);

      receiveNotification(user_id, notification, socket);

      res.json(inbox);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleAddActionTaken,
  handleGetActionTaken,
  handleReviewActionTaken,
  handleReforwardForAction,
};

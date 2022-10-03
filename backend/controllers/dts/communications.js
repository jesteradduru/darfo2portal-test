const fs = require("fs");
const _ = require("lodash");
const { Trail } = require("../helpers/trail");

const deleteFiles = async (array_files) => {
  if (array_files.length > 0) {
    await array_files.forEach(async (data) => {
      await fs.unlink(data, (err) => {
        // if (err) throw err;
      });
    });
  }
};

const distinctCom = (array) => {
  const comms = [];
  array.forEach((array_item) => {
    const exist = comms.filter((com) => com.com_id === array_item.com_id);
    exist.length === 0 && comms.push(array_item);
  });
  return comms;
};

const checkDuplicate = ( (trx, subject) => {
  return trx.raw(
    `
    SELECT COUNT(com_id) FROM dts.communications WHERE UPPER(com_subject) = UPPER('${subject}')
    `
  ).then(data => parseInt(data.rows[0].count) > 0)
})

const handleAddCommunication = async (
  req,
  res,
  db,
  socket,
  receiveNotification
) => {
  const {
    control_no,
    class_id,
    source_name,
    source_position,
    source_office,
    subject,
    date_received,
    urgency,
    other_remarks,
    draft,
    due_date = null,
  } = req.body;

  try {
    await db.transaction(async (trx) => {
      let new_communication = {
        com_controlNo: control_no,
        user_id: req.user.user_id,
        class_id,
        com_source_name: source_name,
        com_source_position: source_position,
        com_source_office: source_office,
        com_subject: subject,
        com_dateReceived: date_received,
        com_urgency: urgency,
        com_other_remarks: other_remarks,
        com_dateCreated: db.fn.now(),
      };

      if (draft) {
        new_communication = {
          com_controlNo: control_no,
          user_id: req.user.user_id,
          com_source_name: source_name,
          com_source_position: source_position,
          com_source_office: source_office,
          com_subject: subject,
          com_urgency: urgency,
          com_other_remarks: other_remarks,
          com_draft: draft,
          com_dateCreated: db.fn.now(),
        };
      }
      if (!_.isEmpty(due_date)) {
        new_communication.com_due_date = due_date;
      }
      if (!_.isEmpty(date_received)) {
        new_communication.com_dateReceived = date_received;
      }
      if (!_.isEmpty(class_id)) {
        new_communication.class_id = class_id;
      }

      const isDuplicate = await checkDuplicate(trx, subject)
      if(isDuplicate){
        return res.json('com_duplicate')
      }
      const addCommunication = await trx("communications")
        .withSchema("dts")
        .insert(new_communication)
        .returning(["com_id", "com_controlNo"])
        .then((data) => data);

      const communication = await trx("communications")
        .withSchema("dts")
        .update({
          com_controlNo:
            addCommunication[0].com_controlNo + addCommunication[0].com_id,
        })
        .where("com_id", "=", addCommunication[0].com_id)
        .returning(["com_id", "com_controlNo"])
        .then((data) => data);

      if (req.files["scanned"])
        await req.files["scanned"].forEach(async (file) => {
          await trx("scanned_copies")
            .withSchema("dts")
            .insert({
              com_id: communication[0].com_id,
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
              com_id: communication[0].com_id,
              attach_path: file.path,
              attach_name: file.originalname,
            })
            .catch(console.log);
        });

      const receiver = await trx("users")
        .withSchema("portal")
        .select("user_id")
        .leftJoin("roles", "roles.role_id", "users.role_id")
        .where("roles.role_name", "=", "Process-level Reviewer")
        .then((data) => data);

      if (receiver.length > 0 && !draft) {
        var inbox = await trx("inbox")
          .withSchema("dts")
          .insert({
            com_id: communication[0].com_id,
            inbox_sender_id: req.user.user_id,
            inbox_receiver_id: receiver[0].user_id,
            inbox_date_sent: db.fn.now(),
            inbox_task:
              (urgency === "Rush" || urgency === "OMG")
                ? ["viewCommunication", "routeCommunication"]
                : ["viewCommunication", "addInitialRouting"],
          })
          .returning([
            "inbox_receiver_id",
            "inbox_task",
            "inbox_id",
            "inbox_date_sent",
          ])
          .then((data) => data)
          .catch((err) => console.log(err));
      }

      if (draft) {
        res.json("Succesfully saved as draft!");
      } else {
        const notification = {
          title: (urgency === "Rush" || urgency === "OMG") ? "For Routing" : "For Initial Routing",
          message: `${req.user.user_username} added ${communication[0].com_controlNo}`,
          tasks: inbox[0].inbox_task,
          link: `/dts/managementOfCommunications/inbox/viewTask/${inbox[0].inbox_id}/${communication[0].com_id}`,
        };

        receiveNotification(inbox[0].inbox_receiver_id, notification, socket);

        const document_trail = new Trail(db, {
          description: "Communication has been created. Pending for routing.",
          com_id: communication[0].com_id,
          trail_date: inbox[0].inbox_date_sent,
          user_id: req.user.user_id,
        });

        await trx("document_trail")
          .withSchema("dts")
          .insert(document_trail.getTrail())
          .catch(console.log);

        res.json({
          communication: communication[0].com_id,
        });
      }
    });
  } catch (error) {
    // console.log(error)
    // deleteFiles(req.files['scanned'].map(file => file.path))
    // deleteFiles(req.files['attachments'].map(file => file.path))
    console.log(error);
    if (error.code === "23505") {
      res.json("control_no_exist");
    }
  }
};

const handleGetDrafts = (req, res, db) => {
  const { user_id } = req.user;

  db("communications")
    .withSchema("portal")
    .select("*")
    .leftJoin("users", "users.user_id", "communications.user_id")
    .withSchema("dts")
    .leftJoin(
      "classifications",
      "classifications.class_id",
      "communications.class_id"
    )
    .leftJoin("categories", "categories.cat_id", "classifications.cat_id")
    .withSchema("dts")
    .where("communications.com_draft", "=", "true")
    .andWhere("communications.user_id", "=", user_id)
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

const handleDeleteCommunication = async (req, res, db) => {
  const { com_id } = req.body;

  try {
    await db.transaction(async (trx) => {
      const communications = await trx("communications")
        .withSchema("dts")
        .delete()
        .where("com_id", "=", com_id)
        .returning("*")
        .then(data => data[0])
        .catch((err) => res.json("Something went wrong."));

      await trx("inbox")
        .withSchema("dts")
        .delete()
        .where("com_id", "=", com_id)
        .returning("*")
        .then(data => data[0])
        .catch((err) => res.json("Something went wrong."));
      
      await trx('deleted_communications')
      .withSchema('dts')
      .insert(communications)
      .returning('*')
      .then(data => console.log(data))

      await trx("scanned_copies")
        .withSchema("dts")
        .delete()
        .where("com_id", "=", com_id)
        .returning("scan_path")
        .then((res_data) => deleteFiles(res_data))
        .catch((err) => res.json("Something went wrong."));

      await trx("attachments")
        .withSchema("dts")
        .delete()
        .where("com_id", "=", com_id)
        .returning("attach_path")
        .then((res_data) => deleteFiles(res_data))
        .catch((err) => res.json("Something went wrong."));
    });

    res.json("succesfully deleted");
  } catch (error) {
    console.log(error);
  }
};

const handleGetFiles = (req, res, db) => {
  const { table, com_id } = req.body;

  db(table)
    .withSchema("dts")
    .select("*")
    .where("com_id", "=", com_id)
    .then((data) => res.json(data));
};

const handleDeleteFile = (req, res, db) => {
  const { table, column, file_id } = req.body;

  const column_path = table === "attachments" ? "attach_path" : "scan_path";
  db(table)
    .withSchema("dts")
    .delete()
    .where(column, "=", file_id)
    .returning(column_path)
    .then((data) => deleteFiles(data));

  res.json("Succesfully deleted!");
};

const handleSaveDraft = async (req, res, db, socket, receiveNotification) => {
  
  const {
    com_id,
    control_no,
    class_id,
    source_name,
    source_position,
    source_office,
    subject,
    date_received,
    urgency,
    other_remarks,
    draft,
    due_date,
  } = req.body;

  try {
    await db.transaction(async (trx) => {
      let new_communication = {
        com_controlNo: control_no,
        user_id: req.user.user_id,
        com_source_name: source_name,
        com_source_position: source_position,
        com_source_office: source_office,
        com_subject: subject,
        com_urgency: urgency,
        com_other_remarks: other_remarks,
        com_draft: draft,
      };

      if (!_.isEmpty(due_date)) {
        new_communication.com_due_date = due_date;
      }
      if (!_.isEmpty(date_received)) {
        new_communication.com_dateReceived = date_received;
      }
      
      if (!_.isEmpty(class_id)) {
        new_communication.class_id = class_id;
      }

      const communication = await trx("communications")
        .withSchema("dts")
        .update(new_communication)
        .where("com_id", "=", com_id)
        .returning("com_id")
        .then((data) => data)
        .catch(console.log);

      // console.log(communication)

      if (req.files["scanned"]) {
        await trx("scanned_copies")
          .withSchema("dts")
          .delete()
          .where("com_id", "=", com_id)
          .returning("scan_path")
          // .then(data => console.log(data))
          .then((data) => deleteFiles(data))
          .catch(console.log);

        await req.files["scanned"].forEach(async (file) => {
          await trx("scanned_copies")
            .withSchema("dts")
            .insert({
              com_id: communication[0],
              scan_path: file.path,
              scan_name: file.originalname,
            })
            .catch(console.log);
        });
      }

      if (req.files["attachments"]) {
        await trx("attachments")
          .withSchema("dts")
          .delete()
          .where("com_id", "=", com_id)
          .returning("attach_path")
          // .then(data => console.log(data))
          .then((data) => deleteFiles(data))
          .catch(console.log);

        await req.files["attachments"].forEach(async (file) => {
          await trx("attachments")
            .withSchema("dts")
            .insert({
              com_id: communication[0],
              attach_path: file.path,
              attach_name: file.originalname,
            })
            .catch(console.log);
        });
      }

      const receiver = await trx("users")
        .withSchema("portal")
        .select("user_id")
        .leftJoin("roles", "roles.role_id", "users.role_id")
        .where("roles.role_name", "=", "Process-level Reviewer")
        .then((data) => data);

      if (receiver.length > 0 && draft === "false") {
        var userToNotify = await trx("inbox")
          .withSchema("dts")
          .insert({
            com_id: communication[0],
            inbox_sender_id: req.user.user_id,
            inbox_receiver_id: receiver[0].user_id,
            inbox_date_sent: db.fn.now(),
            inbox_task:
              urgency === "Rush"
                ? ["viewCommunication", "routeCommunication"]
                : ["viewCommunication", "addInitialRouting"],
          })
          .returning(["inbox_receiver_id", "inbox_date_sent", "inbox_task"])
          .then((data) => data)
          .catch((err) => console.log(err));

        console.log(communication[0]);

        const notification = {
          title: urgency === "Rush" ? "For Routing" : "For Initial Routing",
          message: `${req.user.user_username} added ${communication[0].com_controlNo}`,
          tasks: userToNotify[0].inbox_task,
          link: `/dts/managementOfCommunications/inbox/viewTask/${userToNotify[0].inbox_id}/${communication[0].com_id}`,
        };

        receiveNotification(
          userToNotify[0].inbox_receiver_id,
          notification,
          socket
        );

        const document_trail = new Trail(db, {
          description: "Communication has been created. Pending for routing.",
          com_id: communication[0],
          trail_date: userToNotify[0].inbox_date_sent,
          user_id: req.user.user_id,
        });

        await trx("document_trail")
          .withSchema("dts")
          .insert(document_trail.getTrail())
          .returning("*")
          .then((data) => console.log(data))
          .catch(console.log);

        res.json({
          userToNotify: userToNotify[0],
          communication: communication[0],
        });
      } else {
        res.json("draft_saved");
      }

      // if (draft === "true") {
      //   res.json("draft_saved");
      // } else {
      //   res.json({
      //     userToNotify: userToNotify[0],
      //     communication: communication[0],
      //   });
      // }
    });
  } catch (error) {
    console.log(error);
  }
};

const handleEditCommunication = async (req, res, db) => {
  const {
    com_id,
    control_no,
    class_id,
    source_name,
    source_position,
    source_office,
    subject,
    date_received,
    urgency,
    other_remarks,
    draft,
    due_date = null,
  } = req.body;

  try {
    await db.transaction(async (trx) => {
      let new_communication = {
        com_controlNo: control_no,
        class_id,
        com_source_name: source_name,
        com_source_position: source_position,
        com_source_office: source_office,
        com_subject: subject,
        com_dateReceived: date_received,
        com_urgency: urgency,
        com_other_remarks: other_remarks,
        com_draft: draft,
      };

      if (!_.isEmpty(due_date)) {
        new_communication.com_due_date = due_date;
      }

      const communication = await trx("communications")
        .withSchema("dts")
        .update(new_communication)
        .where("com_id", "=", com_id)
        .returning("com_id")
        .then((data) => data)
        .catch(console.log);

      if (req.files["scanned"]) {
        await trx("scanned_copies")
          .withSchema("dts")
          .delete()
          .where("com_id", "=", com_id)
          .returning("scan_path")
          // .then(data => console.log(data))
          .then((data) => deleteFiles(data))
          .catch(console.log);

        await req.files["scanned"].forEach(async (file) => {
          await trx("scanned_copies")
            .withSchema("dts")
            .insert({
              com_id: communication[0],
              scan_path: file.path,
              scan_name: file.originalname,
            })
            .catch(console.log);
        });
      }

      if (req.files["attachments"]) {
        await trx("attachments")
          .withSchema("dts")
          .delete()
          .where("com_id", "=", com_id)
          .returning("attach_path")
          // .then(data => console.log(data))
          .then((data) => deleteFiles(data))
          .catch(console.log);

        await req.files["attachments"].forEach(async (file) => {
          await trx("attachments")
            .withSchema("dts")
            .insert({
              com_id: communication[0],
              attach_path: file.path,
              attach_name: file.originalname,
            })
            .catch(console.log);
        });
      }

      res.json("edit_success");
    });
  } catch (error) {
    console.log(error);
  }
};

const handleGetCommunication = async (req, res, db) => {
  const { com_id } = req.body;
  try {
    if (com_id !== 0) {
      await db.transaction(async (trx) => {
        const communication = await trx("communications")
          .withSchema("portal")
          .select("*")
          .leftJoin("users", "users.user_id", "communications.user_id")
          .withSchema("dts")
          .leftJoin(
            "classifications",
            "classifications.class_id",
            "communications.class_id"
          )
          .leftJoin("categories", "categories.cat_id", "classifications.cat_id")
          .withSchema("dts")
          .where("com_id", "=", com_id)
          .then((data) => data[0])
          .catch((err) => console.log(err));

        const employee = await trx("employees")
          .withSchema("portal")
          .select("emp_firstname", "emp_lastname", "emp_middlename")
          .where("emp_id", "=", communication.emp_id)
          .then((data) => data[0])
          .catch((err) => console.log(err));

        const scanned = await trx("scanned_copies")
          .withSchema("dts")
          .select("*")
          .where("com_id", "=", com_id)
          .then((data) => data)
          .catch((err) => console.log(err));

        const attachments = await trx("attachments")
          .withSchema("dts")
          .select("*")
          .where("com_id", "=", com_id)
          .then((data) => data)
          .catch((err) => console.log(err));

        res.json({
          ...communication,
          scanned: scanned,
          attachments: attachments,
          employee: { ...employee },
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleVerifyControlNo = (req, res, db) => {
  const { control_no } = req.params;

  db("communications")
    .withSchema("dts")
    .select("com_id")
    .where("com_controlNo", "=", control_no)
    .then((data) => {
      if (data.length !== 0) {
        res.json(true);
      } else {
        res.json(false);
      }
    });
};

const handleGetInbox = async (req, res, db) => {
  try {
    await db.transaction(async (trx) => {
      const inbox = await trx("inbox")
        .withSchema("dts")
        .select("*")
        .leftJoin("communications", "communications.com_id", "inbox.com_id")
        .where("inbox_receiver_id", "=", req.user.user_id)
        .whereNull("inbox_task_completed_date")
        .orderBy("inbox_date_sent", "desc")
        .then((data) => data);

      const users = await trx("users")
        .withSchema("portal")
        .select(
          "employees.emp_firstname",
          "employees.emp_lastname",
          "offices.office_code",
          "users.user_id"
        )
        .rightJoin("employees", "users.emp_id", "employees.emp_id")
        .leftJoin("offices", "employees.office_id", "offices.office_id")
        .then((data) => data);

      const inboxFullDetails = inbox.map((inb) => {
        const user = users.filter(
          (user) => inb.inbox_sender_id === user.user_id
        );
        return { ...inb, ...user[0] };
      });

      res.json(inboxFullDetails);
    });
  } catch (error) {
    console.log(error);
  }
};

const handleSeenCommunication = (req, res, db) => {
  try {
    db.transaction(async (trx) => {
      const { inbox_id } = req.body;
      // console.log(inbox_id)

      const inbox = await trx("inbox")
        .withSchema("dts")
        .update({ inbox_date_seen: db.fn.now() })
        .where("inbox_id", "=", inbox_id)
        .whereNull("inbox_date_seen")
        .returning([
          "inbox_id",
          "inbox_date_seen",
          "com_id",
          "inbox_receiver_id",
          "inbox_task",
        ])
        .then((data) => data)
        .catch(console.log);

      if (!_.isEmpty(inbox)) {
        const user = await trx("users")
          .withSchema("portal")
          .select([
            // "employees.*",
            // "users.emp_id",
            // "offices.office_code",
            "roles.role_name",
          ])
          .leftJoin("roles", "users.role_id", "roles.role_id")
          .leftJoin("employees", "employees.emp_id", "users.emp_id")
          .leftJoin("offices", "offices.office_id", "employees.office_id")
          .where("users.user_id", "=", inbox[0].inbox_receiver_id)
          .then((data) => data[0]);
        if (
          !user.role_name.includes("Process-level") ||
          inbox[0].inbox_task.includes("reviewAction")
        ) {
          const trail_description = () => {
            let desc = "";
            if (
              inbox[0].inbox_task.includes("addAction") ||
              inbox[0].inbox_task.includes("routeCommunication")
            ) {
              desc = `Routed communication has been seen. Pending action.`;
            } else if (inbox[0].inbox_task.includes("reviewAction")) {
              desc = `Reviewing the action taken.`;
            } else if (inbox[0].inbox_task.includes("viewRouting")) {
              desc = `Communication has been seen.`;
            }

            return desc;
          };

          const document_trail = new Trail(db, {
            description: trail_description(),
            com_id: inbox[0].com_id,
            trail_date: inbox[0].inbox_date_seen,
            user_id: req.user.user_id,
          });

          await trx("document_trail")
            .withSchema("dts")
            .insert(document_trail.getTrail())
            .catch(console.log);
        }

        res.json(inbox);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const handleGetInboxData = async (req, res, db) => {
  const { inbox_id } = req.body;
  const inbox = await db("inbox")
    .withSchema("dts")
    .select("inbox_task")
    .leftJoin("communications", "communications.com_id", "inbox.com_id")
    .where("inbox_id", "=", inbox_id)
    .whereNull("inbox_task_completed_date")
    .orderBy("inbox_date_sent", "desc")
    .then((data) => data[0].inbox_task);
  res.json(inbox);
};

const handleGetCommunications = (req, res, db) => {
  try {
    db.transaction(async (trx) => {
      const current_user = await trx("users")
        .withSchema("portal")
        .select("*")
        .rightJoin("employees", "users.emp_id", "employees.emp_id")
        .leftJoin("roles", "users.role_id", "roles.role_id")
        .leftJoin("offices", "employees.office_id", "offices.office_id")
        .where("users.user_id", "=", req.user.user_id)
        .then((data) => data[0]);

      const communications = await trx("inbox")
        .withSchema("portal")
        .select([
          "communications.*",
          "employees.*",
          "offices.office_code",
          "inbox.inbox_receiver_id",
          "roles.role_name",
          "classifications.*",
          "categories.*",
        ])
        // .distinctOn('inbox.com_id')
        .leftJoin("users", "users.user_id", "inbox.inbox_receiver_id")
        .leftJoin("employees", "employees.emp_id", "users.emp_id")
        .leftJoin("roles", "users.role_id", "roles.role_id")
        .leftJoin("offices", "offices.office_id", "employees.office_id")
        .withSchema("dts")
        .leftJoin("communications", "inbox.com_id", "communications.com_id")
        .leftJoin(
          "classifications",
          "classifications.class_id",
          "communications.class_id"
        )
        .leftJoin("categories", "categories.cat_id", "classifications.cat_id")
        .withSchema("dts")
        // .where("communications.com_draft", "=", "true")
        // .andWhere("communications.user_id", "=", user_id)
        .then((data) => {
          return data;
        })
        .catch((err) => console.log(err));

      const offices = await trx("offices")
        .withSchema("portal")
        .select("*")
        .where("office_under", "=", current_user.office_code)
        .then((data) => data);

      const officesUnder = await trx("offices")
        .withSchema("portal")
        .select("*")
        .whereIn(
          "office_under",
          offices.map((data) => data.office_code)
        )
        .orWhere("office_code", current_user.office_code)
        .then((data) => data);

      const allOfficesUnder = [...offices, ...officesUnder]
        .map((data) => data.office_code)
        .filter((data) => !_.isEmpty(data));

      if (current_user.role_name.includes("Process-level")) {
        res.json(distinctCom(communications));
      } else if (current_user.emp_position.includes("RTD")) {
        if (current_user.office_code === "RTDOE") {
          const filter_com = communications.filter((com) => {
            return allOfficesUnder.includes(com.office_code);
          });
          res.json(distinctCom(filter_com));
        } else {
          const filter_com = communications.filter((com) => {
            return allOfficesUnder.includes(com.office_code);
          });
          res.json(distinctCom(filter_com));
        }
      } else if (current_user.role_name === "End-user Approver") {
        const filter_com = communications.filter((com) => {
          return allOfficesUnder.includes(com.office_code);
        });
        res.json(distinctCom(filter_com));
      } else if (current_user.role_name === "End-user Reviewer") {
        const filter_com = communications.filter((com) => {
          return allOfficesUnder.includes(com.office_code);
        });
        res.json(distinctCom(filter_com));
      } else {
        const filter_com = communications.filter((com) => {
          return allOfficesUnder.includes(com.office_code);
        });
        res.json(distinctCom(filter_com));
      }
    });
  } catch (error) {}
};

module.exports = {
  handleAddCommunication,
  handleGetDrafts,
  handleDeleteCommunication,
  handleGetFiles,
  handleDeleteFile,
  handleSaveDraft,
  handleGetCommunication,
  handleVerifyControlNo,
  handleGetInbox,
  handleSeenCommunication,
  handleEditCommunication,
  handleGetInboxData,
  handleGetCommunications,
};

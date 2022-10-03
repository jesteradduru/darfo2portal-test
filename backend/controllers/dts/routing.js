// controller/handlers for routing requests
const _ = require("lodash");
const {Trail} = require('../helpers/trail')
const handleAddInitialRouting = (req, res, db, socket, receiveNotification) => {
  const routing_slips = req.body;

  try {
    let routing_data_insert = [];
    db.transaction(async (trx) => {
      const receiver = await trx("users")
        .withSchema("portal")
        .select("user_id")
        .leftJoin("roles", "roles.role_id", "users.role_id")
        .where("roles.role_name", "=", "Process-level Approver")
        .then((data) => data);

      routing_slips.forEach((routing_data) => {
        const {
          reference_no,
          routing_legend,
          routing_recipients,
          draft_reply_text,
          consolidate_text,
          com_id,
          routing_remarks = "",
        } = routing_data;

        routing_recipients.forEach(async (recipient) => {
          const routing_data = {
            routing_referenceNo: reference_no,
            routing_dateCreated: db.fn.now(),
            routing_legend,
            routing_from: receiver[0].user_id,
            routing_to: recipient.user_id,
            routing_draftReply: draft_reply_text,
            routing_consolidate: consolidate_text,
            routing_status: "initial",
            routing_remarks: routing_remarks,
            com_id: com_id,
          };

          routing_data_insert.push(routing_data);
        });
      });

      const inserted = await trx("routing")
        .withSchema("dts")
        .insert(routing_data_insert)
        .returning("routing_id")
        .then((data) => data);

      if (receiver.length > 0) {
        var inbox = await trx("inbox")
          .withSchema("dts")
          .insert({
            com_id: routing_slips[0].com_id,
            inbox_sender_id: req.user.user_id,
            inbox_receiver_id: receiver[0].user_id,
            inbox_date_sent: db.fn.now(),
            inbox_task: ["viewCommunication", "addRoutingNote"],
          })
          .returning(["inbox_receiver_id", "inbox_task", "inbox_id"])
          .then((data) => data[0])
          .catch((err) => console.log(err));
      }

      const control_no = await trx("communications")
        .withSchema("dts")
        .select("com_controlNo")
        .where("com_id", "=", routing_slips[0].com_id)
        .then((data) => data[0]);

      const routingData = {
        com_id: routing_slips[0].com_id,
        user_username: req.user.user_username,
        control_no: control_no.com_controlNo,
        inserted,
      };

      const notification = {
        title: "For Routing Note",
        message: `${req.user.user_username} submitted ${control_no.com_controlNo}`,
        tasks: inbox.inbox_task,
        link: `/dts/managementOfCommunications/inbox/viewTask/${inbox.inbox_id}/${routing_slips[0].com_id}`,
      };

      receiveNotification(inbox.inbox_receiver_id, notification, socket);

      res.json({
        routingData: routingData,
        tasks: inbox.inbox_task,
        userToNotify: inbox.inbox_receiver_id,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const handleRouteCommunication = (
  req,
  res,
  db,
  socket,
  receiveNotification
) => {
  const routing_slips = req.body;

  try {
    let routing_data_insert = [];
    let inbox_routing_insert = [];

    db.transaction(async (trx) => {
      let receiver = null;

      const user_role = await trx("roles")
        .withSchema("portal")
        .select("role_name")
        .where("role_id", "=", req.user.role_id)
        .then((data) => data[0])
        .catch(console.log);

      if (user_role.role_name.includes("Process-level")) {
        receiver = await trx("users")
          .withSchema("portal")
          .select("user_id")
          .leftJoin("roles", "roles.role_id", "users.role_id")
          .where("roles.role_name", "=", "Process-level Approver")
          .then((data) => data[0].user_id)
          .catch(console.log);
      } else {
        receiver = req.user.user_id;
      }

      const users = await trx("users")
        .withSchema("portal")
        .select("*")
        .rightJoin("employees", "users.emp_id", "employees.emp_id")
        .leftJoin("roles", "users.role_id", "roles.role_id")
        .leftJoin("offices", "employees.office_id", "offices.office_id")
        .then((data) => data)
        .catch(console.log);

      await trx("routing")
        .withSchema("dts")
        .delete()
        .where("com_id", "=", routing_slips[0].com_id)
        .andWhere("routing_status", "=", "for_routing")
        .returning("routing_id")
        .then(console.log);

      routing_slips.forEach((routing_data) => {
        const {
          reference_no,
          routing_legend,
          routing_recipients,
          draft_reply_text,
          consolidate_text,
          com_id,
          routing_remarks = "",
        } = routing_data;

        routing_recipients.forEach(async (recipient) => {
          const routing_data = {
            routing_referenceNo: reference_no,
            routing_dateCreated: db.fn.now(),
            routing_legend,
            routing_to: recipient.user_id,
            routing_from: receiver,
            routing_draftReply: draft_reply_text,
            routing_consolidate: consolidate_text,
            routing_status: "routed",
            routing_remarks: routing_remarks,
            com_id: com_id,
          };

          const inbox_data = {
            com_id: com_id,
            inbox_sender_id: req.user.user_id,
            inbox_receiver_id: recipient.user_id,
            inbox_date_sent: db.fn.now(),
            // inbox_task: ['viewCommunication', 'addRoutingNote']
          };

          const user = users.filter(
            (data) => data.user_id === recipient.user_id
          )[0];

          if (
            user.role_name === "End-user Approver" &&
            routing_legend.includes("for_action")
          ) {
            inbox_data.inbox_task = [
              "viewCommunication",
              "viewRouting",
              "routeCommunication",
            ];
          } else if (
            (user.role_name === "End-user Reviewer" ||
              user.role_name === "End-user Encoder") &&
            routing_legend.includes("for_action")
          ) {
            inbox_data.inbox_task = [
              "viewCommunication",
              "viewRouting",
              "addAction",
            ];
          } else {
            inbox_data.inbox_task = ["viewCommunication", "viewRouting"];
          }

          routing_data_insert.push(routing_data);
          inbox_routing_insert.push(inbox_data);
        });
      });

      const inserted = await trx("routing")
        .withSchema("dts")
        .insert(routing_data_insert)
        .returning("routing_id")
        .then((data) => data);

      const control_no = await trx("communications")
        .withSchema("dts")
        .select("com_controlNo")
        .where("com_id", "=", routing_slips[0].com_id)
        .then((data) => data[0]);

      const inbox = await trx("inbox")
        .withSchema("dts")
        .insert(inbox_routing_insert)
        .returning(["inbox_receiver_id", "inbox_task", "inbox_id", 'inbox_date_sent'])
        .then((data) => data)
        .catch((err) => console.log(err));

      inbox.forEach((item) => {
        const notification = {
          title: "View Routing",
          message: `${req.user.user_username} routed ${control_no.com_controlNo}`,
          tasks: item.inbox_task,
          link: `/dts/managementOfCommunications/inbox/viewTask/${inbox.inbox_id}/${routing_slips[0].com_id}`,
        };

        receiveNotification(item.inbox_receiver_id, notification, socket);
      });

      const routed_to = routing_slips.map(slip => {
        
        return slip.routing_recipients.map(routing_data => {
          const inbox_data = inbox.filter(inbox_data => inbox_data.inbox_receiver_id === routing_data.user_id)[0]
          const forAction = (inbox_data.inbox_task.includes('addAction') || inbox_data.inbox_task.includes('routeCommunication')) ? ' (pending action)' : '';
          return routing_data.user_fullname + forAction
        })
      }).join(', ')


      const document_trail = new Trail(db, {
        description: `Communication has been routed to ${routed_to}.`, 
        com_id: routing_slips[0].com_id,
        trail_date: inbox[0].inbox_date_sent,
        routing_id: inserted,
        user_id: req.user.user_id
      });

      await trx('document_trail')
      .withSchema('dts')
      .insert(document_trail.getTrail())
      .catch(console.log)

      const routingData = {
        com_id: routing_slips[0].com_id,
        user_username: req.user.user_username,
        control_no: control_no.com_controlNo,
        inserted,
      };

      res.json(routingData);
    });
  } catch (error) {
    console.log(error);
  }
};

const handleAddForRouting = (req, res, db, socket, receiveNotification) => {
  const routing_slips = req.body;

  try {
    let routing_data_insert = [];
    db.transaction(async (trx) => {
      const receiver = await trx("users")
        .withSchema("portal")
        .select("user_id")
        .leftJoin("roles", "roles.role_id", "users.role_id")
        .where("roles.role_name", "=", "Process-level Reviewer")
        .then((data) => data);

      await trx("routing")
        .withSchema("dts")
        .delete()
        .where("com_id", "=", routing_slips[0].com_id)
        .andWhere("routing_status", "=", "initial")
        .returning("routing_id")
        .then(console.log);

      routing_slips.forEach((routing_data) => {
        const {
          reference_no,
          routing_legend,
          routing_recipients,
          draft_reply_text,
          consolidate_text,
          com_id,
          routing_remarks = "",
        } = routing_data;

        routing_recipients.forEach(async (recipient) => {
          const routing_data = {
            routing_referenceNo: reference_no,
            routing_dateCreated: db.fn.now(),
            routing_legend,
            routing_from: req.user.user_id,
            routing_to: recipient.user_id,
            routing_draftReply: draft_reply_text,
            routing_consolidate: consolidate_text,
            routing_status: "for_routing",
            routing_remarks: routing_remarks,
            com_id: com_id,
          };

          routing_data_insert.push(routing_data);
        });
      });

      const inserted = await trx("routing")
        .withSchema("dts")
        .insert(routing_data_insert)
        .returning("routing_id")
        .then((data) => data);

      if (receiver.length > 0) {
        var inbox = await trx("inbox")
          .withSchema("dts")
          .insert({
            com_id: routing_slips[0].com_id,
            inbox_sender_id: req.user.user_id,
            inbox_receiver_id: receiver[0].user_id,
            inbox_date_sent: db.fn.now(),
            inbox_task: ["viewCommunication", "forRouting"],
          })
          .returning(["inbox_receiver_id", "inbox_task", "inbox_id"])
          .then((data) => data[0])
          .catch((err) => console.log(err));
      }

      const control_no = await trx("communications")
        .withSchema("dts")
        .select("com_controlNo")
        .where("com_id", "=", routing_slips[0].com_id)
        .then((data) => data[0]);

      const routingData = {
        com_id: routing_slips[0].com_id,
        user_username: req.user.user_username,
        control_no: control_no.com_controlNo,
        inserted,
      };

      const notification = {
        title: "For Routing",
        message: `${req.user.user_username} submitted ${control_no.com_controlNo}`,
        tasks: inbox.inbox_task,
        link: `/dts/managementOfCommunications/inbox/viewTask/${inbox.inbox_id}/${routing_slips[0].com_id}`,
      };

      receiveNotification(inbox.inbox_receiver_id, notification, socket);

      res.json({
        routingData: routingData,
        tasks: inbox.inbox_task,
        userToNotify: inbox.inbox_receiver_id,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const handleGetRoutingSlips = (req, res, db) => {
  try {
    const { com_id, status } = req.body;

    db.transaction(async (trx) => {
      const routings = await trx("routing")
        .withSchema("dts")
        .select("*")
        .where("com_id", "=", com_id)
        .andWhere("routing_status", "=", status)
        .then((data) => data)
        .catch(console.log);

      const users = await trx("users")
        .withSchema("portal")
        .select("*")
        .rightJoin("employees", "users.emp_id", "employees.emp_id")
        .leftJoin("roles", "users.role_id", "roles.role_id")
        .leftJoin("offices", "employees.office_id", "offices.office_id")
        .then((data) => data)
        .catch(console.log);

      const recipients = routings.map((routing) => {
        const recipient = users.filter(
          (user) => user.user_id === routing.routing_to
        )[0];
        // console.log(recipient)
        return {
          user_id: recipient.user_id,
          user_fullname: `${recipient.emp_firstname} ${recipient.emp_middlename[0]}. ${recipient.emp_lastname}`,
          user_username: recipient.user_username,
          role_name: recipient.role_name,
          role_id: recipient.role_id,
          value: recipient.user_username,
          label: `${recipient.emp_firstname} ${recipient.emp_lastname} - ${recipient.office_code}`,
          type: "user",
          routing_referenceNo: routing.routing_referenceNo,
          routing_legend: routing.routing_legend,
          routing_consolidate: routing.routing_consolidate,
          routing_draftReply: routing.routing_draftReply,
          routing_remarks: routing.routing_remarks,
        };
      });

      res.json(recipients);
    });
  } catch (error) {}
};

const handleGetRouting = (req, res, db) => {
  try {
    const { com_id, inbox_id } = req.body;
    

    db.transaction(async (trx) => {

      const sender_id = await trx('inbox')
      .withSchema('dts')
      .select('inbox_sender_id')
      .where('inbox_id', '=', inbox_id)
      .then(data => data[0].inbox_sender_id)
      
      const users = await trx("users")
        .withSchema("portal")
        .select("*")
        .rightJoin("employees", "users.emp_id", "employees.emp_id")
        .leftJoin("roles", "users.role_id", "roles.role_id")
        .leftJoin("offices", "employees.office_id", "offices.office_id")
        .then((data) => data)
        .catch(console.log);

      const user = users.filter((data) => data.user_id === req.user.user_id)[0];
      const sender = users.filter((data) => data.user_id === sender_id)[0];

      let routings = null;
      const offices = await trx('offices')
      .withSchema('portal')
      .select('*')
      .where('office_under', '=', user.office_code)
      .then(data => data)

      const officesUnder = await trx('offices')
      .withSchema('portal')
      .select('*')
      .whereIn('office_under', offices.map(data => data.office_code))
      .orWhere('office_code', user.office_code)
      .then(data => data)

      const allOfficesUnder = [...offices, ...officesUnder].map(data => data.office_code).filter(data => !_.isEmpty(data))

      if (user.role_name === "Process-level Reviewer") {
        routings = await trx("routing")
          .withSchema("portal")
          .select("*")
          .leftJoin("users", "users.user_id", "routing.routing_to")
          .rightJoin("employees", "employees.emp_id", "users.emp_id")
          .withSchema("dts")
          .where("routing.com_id", "=", com_id)
          .andWhere("employees.office_id", "=", sender.office_id)
          .orderBy("routing.routing_id", "asc")
          .then((data) => data)
          .catch((err) => console.log(err));
      } else {
        routings = await trx("routing")
          .withSchema("portal")
          .select("*")
          .leftJoin("users", "users.user_id", "routing.routing_to")
          .rightJoin("employees", "employees.emp_id", "users.emp_id")
          .rightJoin("offices", "offices.office_id", "employees.office_id")
          .withSchema("dts")
          .where("routing.com_id", "=", com_id)
          .whereIn("offices.office_code", allOfficesUnder)
          // .where("employees.office_id", "=", user.office_id)
          .orderBy("routing.routing_id", "asc")
          .then((data) => data)
          .catch((err) => console.log(err));
      }

      // console.log(communication)

      // const routings = await trx('routing')
      //   .withSchema('dts')
      //   .select('*')
      //   .where('com_id', '=', com_id)
      //   .andWhere('routing_status', '=', 'routed')
      //   .andWhere('routing_to', '=', req.user.user_id)
      //   .then(data => {
      //     return data
      //   })
      //   .catch(console.log);

      const recipients = routings.map((routing) => {
        const recipient = users.filter(
          (user) => user.user_id === routing.routing_to
        )[0];
        // console.log(recipient)
        return {
          user_id: recipient.user_id,
          user_fullname: `${recipient.emp_firstname} ${recipient.emp_middlename[0]}. ${recipient.emp_lastname}`,
          user_username: recipient.user_username,
          role_name: recipient.role_name,
          role_id: recipient.role_id,
          value: recipient.user_username,
          label: `${recipient.emp_firstname} ${recipient.emp_lastname} - ${recipient.office_code}`,
          type: "user",
          routing_referenceNo: routing.routing_referenceNo,
          routing_legend: routing.routing_legend,
          routing_consolidate: routing.routing_consolidate,
          routing_draftReply: routing.routing_draftReply,
          routing_remarks: routing.routing_remarks,
          routing_to: routing.routing_to,
          routing_from: routing.routing_from,
        };
      });

      res.json(recipients);
    });
  } catch (error) {}
};

const handleTaskComplete = (req, res, db) => {
  const { inbox_id } = req.body;

  db("inbox")
    .withSchema("dts")
    .update({ inbox_task_completed_date: db.fn.now() })
    .where("inbox_id", "=", inbox_id)
    .returning("inbox_id")
    .then((data) => res.json(data));
};

module.exports = {
  handleAddInitialRouting,
  handleRouteCommunication,
  handleGetRouting,
  handleGetRoutingSlips,
  handleAddForRouting,
  handleTaskComplete,
};

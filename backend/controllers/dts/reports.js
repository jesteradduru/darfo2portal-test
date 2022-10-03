// reports controller
const _ = require('lodash')
// HELPERS
const distinctCom = (array) => {
  const comms = [];
  array.forEach((array_item) => {
    const exist = comms.filter((com) => com.com_id === array_item.com_id);
    exist.length === 0 && comms.push(array_item);
  });
  return comms;
};

const getCurrentUser = async (user_id, trx) => {
  return trx("users")
  .withSchema("portal")
  .select("*")
  .rightJoin("employees", "users.emp_id", "employees.emp_id")
  .leftJoin("roles", "users.role_id", "roles.role_id")
  .leftJoin("offices", "employees.office_id", "offices.office_id")
  .where("users.user_id", "=", user_id)
  .then(data => data[0])
}

const getCommunications = (trx) => {
  const communications = trx.raw(
    `
    SELECT communications.*, classifications.class_name, categories.cat_name, offices.*, inbox.* FROM dts.inbox
    left JOIN dts.communications ON inbox.com_id = communications.com_id
    left JOIN dts.classifications ON classifications.class_id = communications.class_id
    left JOIN dts.categories ON categories.cat_id = classifications.cat_id
    left JOIN portal.users ON users.user_id = inbox.inbox_receiver_id
    left JOIN portal.employees ON employees.emp_id = users.emp_id
    left JOIN portal.offices ON offices.office_id = employees.office_id
    WHERE communications.com_draft = 'false'
    `
  )
  .then((data) => {
    // console.log(data.rows)
    return data.rows;
  })
  .catch((err) => console.log(err));

  return communications;
}

const filterComms = (current_user, communications) => {
  let final_coms = null;
  if (current_user.role_name.includes("Process-level")) {
    final_coms = distinctCom(communications);
  } else if (current_user.emp_position.includes("RTD")) {
    if (current_user.office_code === "RTDOE") {
      const filter_com = communications.filter((com) => {
        return (
          com.office_code.includes("RTDOE") ||
          com.office_code.includes("FOD") ||
          com.office_code.includes("RAED") ||
          com.office_code.includes("AMAD")
        );
      });
      final_coms = distinctCom(filter_com);
    } else {
      const filter_com = communications.filter((com) => {
        return (
          com.office_code.includes("RTDRR") ||
          com.office_code.includes("RES") ||
          com.office_code.includes("ILD") ||
          com.office_code.includes("REG")
        );
      });
      final_coms = distinctCom(filter_com);
    }
  } else if (current_user.role_name === "End-user Approver") {
    const filter_com = communications.filter((com) => {
      return com.office_code.includes(current_user.office_code);
    });
    final_coms = distinctCom(filter_com);
  } else if (current_user.role_name === "End-user Reviewer") {
    const filter_com = communications.filter((com) => {
      return (
        com.office_code.includes(current_user.office_code) ||
        com.role_name === "End-user Encoder"
      );
    });
    final_coms = distinctCom(filter_com);
  } else {
    const filter_com = communications.filter((com) => {
      return com.inbox_receiver_id === current_user.user_id;
    });
    final_coms = distinctCom(filter_com);
  }

  return final_coms;
}

// MAIN CONTROLLERS
const handleGetReport = (req, res, db) => {
  try {
    let reports = [];

    db.transaction(async (trx) => {
      const current_user = await getCurrentUser(req.user.user_id, trx)

      const communications = await getCommunications(trx)

      const final_coms = filterComms(current_user, communications)

      const routing_details = await trx("routing")
        .withSchema("portal")
        .select([
          "roles.role_name",
          "employees.emp_firstname",
          "employees.emp_middlename",
          "employees.emp_lastname",
          "offices.office_code",
          "routing.*",
        ])
        .leftJoin("users", "users.user_id", "routing.routing_to")
        .innerJoin("roles", "roles.role_id", "users.role_id")
        .rightJoin("employees", "employees.emp_id", "users.emp_id")
        .rightJoin("offices", "employees.office_id", "offices.office_id")
        .withSchema("dts")
        .where("routing.routing_status", "=", "routed")
        .orderBy("routing.routing_id", "asc")
        .then((data) => {
          return data.map((d) => {
            return {
              fullname: `${d.emp_firstname} ${d.emp_middlename[0]} ${d.emp_lastname} - ${d.office_code}`,
              com_id: d.com_id,
              role_name: d.role_name,
              routing_legend: d.routing_legend
            };
          });
        })
        .catch((err) => console.log(err));

      const action_desired = await trx("routing")
        .withSchema("portal")
        .select([
          "employees.emp_firstname",
          "employees.emp_middlename",
          "employees.emp_lastname",
          "offices.*",
          "routing.*",
          "roles.role_name",
        ])
        .leftJoin("users", "users.user_id", "routing.routing_from")
        .rightJoin("roles", "roles.role_id", "users.role_id")
        .rightJoin("employees", "employees.emp_id", "users.emp_id")
        .rightJoin("offices", "employees.office_id", "offices.office_id")
        .withSchema("dts")
        .where("routing.routing_status", "=", "routed")
        .andWhere("roles.role_name", "=", "Process-level Approver")
        .orderBy("routing.routing_id", "asc")
        .then((data) => {
          const routing_data = data.filter((d) => {
            return d.routing_legend.includes("for_action");
          });

          return routing_data.map((d) => {
            return {
              // fullname: `${d.emp_firstname} ${d.emp_middlename[0]} ${d.emp_lastname} - ${d.office_code}`,
              com_id: d.com_id,
              routing_legend: d.routing_legend,
              routing_draftReply: d.routing_draftReply,
              routing_consolidate: d.routing_consolidate,
              routing_remarks: d.routing_remarks,
              routing_from: d.routing_from,
            };
          });
        })
        .catch((err) => console.log(err));

      const action_taken = await trx("actions_taken")
        .withSchema("portal")
        .select("*")
        .leftJoin("users", "users.user_id", "actions_taken.user_id")
        .rightJoin("employees", "employees.emp_id", "users.emp_id")
        .rightJoin("offices", "employees.office_id", "offices.office_id")
        .withSchema("dts")
        // .where("actions_taken.act_status", "=", "approved")
        .then((data) => {
          // console.log(data[0])
          return data.map((d) => {
            return {
              fullname: `${d.emp_firstname} ${d.emp_lastname} - ${d.office_code}`,
              com_id: d.com_id,
              act_taken: d.act_taken,
              act_date: d.act_date,
              act_status  : d.act_status,
              office_under: d.office_under,
              office_code: d.office_code
            };
          });
        });

      reports = final_coms.map((com) => {
        const referred_to = routing_details.filter((r_data) => {
          return r_data.com_id === com.com_id;
        });

        const act_description = action_taken.filter((act) => {
          return act.com_id === com.com_id;
        });

        const desired = action_desired.filter((act) => {
          return act.com_id === com.com_id;
        });
        
        return { referred_to, ...com, action_taken: act_description, action_desired: desired };
      });

      // res.json(final_coms);
      res.json(reports);
    });
  } catch (error) {}
};

const handleGetLogs = (req, res, db) => {
  
  db.transaction(async trx => {
    const current_user = await getCurrentUser(req.user.user_id, trx)

    const communications = await getCommunications(trx)

    const final_coms = filterComms(current_user, communications)
    
    if(_.isEmpty(final_coms)){
      return res.json([])
    }

    const trail = await trx.raw(
    `SELECT 
    employees.emp_firstname,
    employees.emp_lastname, 
    employees.emp_middlename, 
    communications.*,
    classifications.*,
    categories.cat_name,
    offices.office_code,
    document_trail.* FROM dts.document_trail
    INNER JOIN dts.communications ON document_trail.com_id = communications.com_id
    INNER JOIN dts.classifications ON classifications.class_id = communications.class_id
    INNER JOIN dts.categories ON classifications.cat_id = categories.cat_id
    INNER JOIN portal.users ON document_trail.user_id = users.user_id
    INNER JOIN portal.employees ON users.emp_id = employees.emp_id
    INNER JOIN portal.offices ON offices.office_id = employees.office_id
    WHERE communications.com_id IN (${final_coms.map(com => com.com_id).join(',')})
    ORDER BY document_trail.trail_date DESC
    `
    )
    .then(data => data.rows);
  
    res.json(trail)
  })
  
}

const handleGetAnalytics = (req, res, db) => {
  try {
    db.transaction(async trx => {
      const offices = await trx('offices')
      .withSchema('portal')
      .select('*')
      .then(data => data)
      
      const routing = await trx
      .raw(`
        SELECT DISTINCT offices.office_code, routing.com_id from dts.routing
        LEFT JOIN portal.users ON users.user_id = routing.routing_to
        LEFT JOIN portal.employees ON users.emp_id = employees.emp_id
        LEFT JOIN portal.offices ON employees.office_id = offices.office_id
        WHERE 'for_action'=ANY(routing.routing_legend)
      `)
      .then(data => data.rows)

      const actions = await trx
      .raw(`
        SELECT DISTINCT offices.office_code, actions_taken.com_id from dts.actions_taken
        LEFT JOIN portal.users ON users.user_id = actions_taken.user_id
        LEFT JOIN portal.employees ON users.emp_id = employees.emp_id
        LEFT JOIN portal.offices ON employees.office_id = offices.office_id
        WHERE act_status = 'approved'
      `)
      .then(data => data.rows)

      const analytics = [];

      offices.forEach(office => {
        const routed_to_office = routing.filter(routing_data => routing_data.office_code === office.office_code)
        const acted_coms = routed_to_office.filter(routing_data => actions.map(a => a.com_id).includes(routing_data.com_id))
        analytics.push({
          office_code: office.office_code,
          total: routed_to_office.length,
          completed: acted_coms.length,
          com_ids: routed_to_office.map(r => r.com_id),
        })
      })

      res.json(analytics)
    });
  } catch (error) {
    
  }
}

module.exports = {
  handleGetReport,
  handleGetLogs,
  handleGetAnalytics
};

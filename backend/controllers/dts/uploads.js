const _ = require("lodash");

const getUploads = (trx, table, col, id) => {
  const uploads = trx(table)
    .withSchema("dts")
    .select("*")
    .where(col, "=", id)
    .then((data) => data);

  return uploads;
};

const handleGetComUploads = (req, res, db) => {
  const { com_id = null, act_id = null, signed_attach_id = null} = req.body;

  if (!_.isNull(com_id)) {
    db.transaction(async (trx) => {
      const comScan = await getUploads(trx, 'scanned_copies', 'com_id', com_id);
      const comAttach = await getUploads(trx, 'attachments', 'com_id', com_id);
      
      return res.json({ scanned: comScan, attachments: comAttach });
    });
  }else if(!_.isNull(signed_attach_id)){
    db.transaction(async (trx) => {
        const actAttach = await getUploads(trx, 'signed_com_attachments', 'act_id', signed_attach_id);
        return res.json({ attachments: [], scanned: actAttach});
      });
  } else {
    db.transaction(async (trx) => {
        const actScan = await getUploads(trx, 'scanned_copies', 'act_id', act_id);
        const actAttach = await getUploads(trx, 'attachments', 'act_id', act_id);
        
        return res.json({ scanned: actScan, attachments: actAttach });
      });
  }
};

module.exports = {
  handleGetComUploads,
};

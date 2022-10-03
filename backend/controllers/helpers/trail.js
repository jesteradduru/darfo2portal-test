function Trail (db, trail) {
  this.getTrail =  () => {
    const document_trail = {
      trail_description: trail.description,
      com_id: trail.com_id,
      trail_date: db.fn.now(),
      user_id: trail.user_id
    };

    if (trail.routing_id) {
      document_trail.routing_id = trail.routing_id;
    }
    if (trail.act_id) {
      document_trail.act_id = trail.act_id;
    }
    return document_trail;
  }
};

module.exports = {
  Trail,
};

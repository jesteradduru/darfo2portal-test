import React from "react";
import moment from "moment";
const TrailBullet = ({active, date}) => {
  return (
    <div className="d-flex p-0" style={{fontSize: '.8rem'}}>
      <span className="text-center">
        {moment(date).format("DD MMM YYYY hh:mm A")}
      </span>
      <div
        className={`rounded-circle bg-secondary ${active && 'bg-success'} p-2 align-self-start`}
        style={{ zIndex: "2" }}
      ></div>
    </div>
  );
};

export default TrailBullet;

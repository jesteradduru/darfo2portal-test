// Routing Tab per recipient
import React from "react";
import { BsXLg } from "react-icons/bs";
import { IconatedButton } from "../../Portal";
import {useDispatch, useSelector} from 'react-redux';
import { closeTab } from "../../../features/dts/routing/routingSlice";

const RoutingTab = ({label, username}) => {
  const dispatch = useDispatch();
  // console.log(name)
  return (
    <div active className="d-flex align-items-center justify-content-between" style={{minWidth:'200px'}}>
      {label} &nbsp;
      <IconatedButton type='button' onClick={(e) => {
        dispatch(closeTab(username))
      }} icon={<BsXLg />} color="danger" />
    </div>
  );
};

export default RoutingTab;

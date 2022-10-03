// View Task Page
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ViewCommunication, AddRouting, AddRoutingNote, ViewRouting, AddActionTaken, ReviewActionTaken, ViewActionStatus } from "../index";
import {useParams} from 'react-router-dom';
import { getInboxData } from "../../../features/dts/tasks/tasksSlice";
const ViewTask = ({socket}) => {
  const dispatch = useDispatch()
  const {inbox_id} = useParams()
  const { tasks, taskCounter } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(getInboxData({inbox_id}))
  }, [dispatch, inbox_id])

  switch (tasks[taskCounter]) {
    case "addInitialRouting":
      return <AddRouting initial />
    case "addRoutingNote":
      return <AddRoutingNote />
    case "routeCommunication":
      return <AddRouting />
    case "viewRouting":
      return <ViewRouting />
    case "forRouting":
      return <AddRouting />
    case "addAction":
      return <AddActionTaken />;
    case "reviewAction":
      return <ReviewActionTaken />;
    case "viewActionStatus":
      return <ViewActionStatus />;
    case "reforwardForAction":
      return <ViewActionStatus reforward />;
    default:
      return <ViewCommunication />
  }
};

export default ViewTask;

// Next button for View Task
import React from "react";
import { BsChevronRight } from "react-icons/bs";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { IconatedButton } from "../../Portal";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { incrementTaskCounter, taskComplete } from "../../../features/dts/tasks/tasksSlice";

const NextTaskButton = () => {
  const { tasks, taskCounter } = useSelector((state) => state.tasks);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {inbox_id} = useParams();
  

  const viewNextTask = async() => {
    if(tasks.length > taskCounter + 1){
      dispatch(incrementTaskCounter())
      // navigate(`${location.pathname}/${tasks[taskCounter]}`);
    }else{
      await dispatch(taskComplete(inbox_id))
      navigate('/dts/managementOfCommunications/inbox');
    }
  }

  return (
      <IconatedButton
        size="md"
        color="primary"
        name={tasks.length === taskCounter + 1 ? 'Task Complete' : 'Next'}
        icon={<BsChevronRight />}
        onClick={viewNextTask}
      />
  );
};

export default NextTaskButton;

// Back button for view task
import React from 'react'
import { BsChevronLeft } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { resetRoutingData } from '../../../features/dts/routing/routingSlice'
import { decrementTaskCounter, resetTaskCounter } from '../../../features/dts/tasks/tasksSlice'
import { IconatedButton } from '../../Portal'

const BackButton = () => {
    const { tasks, taskCounter } = useSelector((state) => state.tasks);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onClickButton = () => {
        if(taskCounter !== 0 ){
            dispatch(decrementTaskCounter());
        }else{
            console.log(taskCounter)
            dispatch(resetTaskCounter());
            dispatch(resetRoutingData());
            navigate('/dts/managementOfCommunications/inbox');
        }
    }
  return (
    <IconatedButton
        size="md"
        color="primary"
        name="Back"
        icon={<BsChevronLeft />}
        onClick={onClickButton}
    />
  )
}

export default BackButton
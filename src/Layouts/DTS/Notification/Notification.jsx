/*
  Notification module
*/
import React, { useEffect } from 'react'
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { useDispatch,  } from 'react-redux';
import { getInbox } from '../../../features/dts/inbox/inboxSlice';
import { Link } from 'react-router-dom';
import { decrementTaskCounter, setTasks } from '../../../features/dts/tasks/tasksSlice';

const Notification = ({socket}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    socket?.on('receiveNotification', (notification) => {
      // console.log(notification)
      NotificationManager.info(
        <Link className='text-light' to={notification.link} onClick={() => {
          dispatch(setTasks(notification.tasks))
          dispatch(decrementTaskCounter())
          // console.log(notification.tasks)
        } }>{notification.message}</Link>
        ,
         notification.title, 30000);
      dispatch(getInbox())
    })
  } , [socket, dispatch])
  
  return (
    <>
      <NotificationContainer />
    </>
  )
}

export default Notification
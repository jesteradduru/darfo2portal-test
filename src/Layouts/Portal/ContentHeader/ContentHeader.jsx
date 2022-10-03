/*
  Contains title and add button of the content section. 
*/
import React from 'react'
import { BsFillPlusCircleFill } from "react-icons/bs";  
import {IconatedButton} from "../index"
const ContentHeader = ({name, toggleModal, buttonName}) => {
  return (
    <div className="d-flex align-items-center">
    <h3 className='me-3'>{name}</h3>
    <IconatedButton name={buttonName} icon={<BsFillPlusCircleFill />} onClick={toggleModal} />
  </div>
  )
}

export default ContentHeader
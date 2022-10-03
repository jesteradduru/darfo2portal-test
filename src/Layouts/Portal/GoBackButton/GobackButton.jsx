import React from 'react'
import { useNavigate } from 'react-router-dom'
import {BsChevronLeft} from 'react-icons/bs'
import IconatedButton from '../IconatedButton/IconatedButton'

const GobackButton = (props) => {
const navigate = useNavigate()

  return (
    <IconatedButton outline  onClick={() => navigate(-1)} icon={<BsChevronLeft />} name="Back" {...props} />
  )
}

export default GobackButton
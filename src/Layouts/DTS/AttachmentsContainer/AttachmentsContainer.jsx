// Container for attached files per communication
import React from 'react'
const _ = require('lodash')
const AttachmentsContainer = ({attachments = []}) => {
  const attachmentLinks = attachments.map(attach => {
      return(
        <a href={attach.src} target="_blank" rel="noopener noreferrer" className='me-3'>
            {attach.attach_name}
        </a>
      )
    })
  
  if(_.isEmpty(attachments)){
    return <></>
  }
  return (
    <div className="bg-super-light-green rounded py-2 px-3 shadow">
        <span className="lead">Attachments</span>
        <div className="d-flex flex-wrap">
            {attachmentLinks} 
        </div>
    </div>
  )
}

export default AttachmentsContainer
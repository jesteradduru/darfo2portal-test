/*
  Layout for urgency legends of communication
*/
import React from 'react'

const InboxLegends = (props) => {
  return (
    <div className="d-flex flex-column align-items-end">
        <div className="d-flex">
            <div className="d-flex align-items-center justify-content-center">
                <div className="p-2 bg-danger"></div>
                <strong className='ms-2'>OMG</strong>
            </div>
            <div className="d-flex align-items-center justify-content-center ms-3">
                <div className="p-2 bg-warning"></div>
                <strong className='ms-2'>Rush</strong>
            </div>
            <div className="d-flex align-items-center justify-content-center ms-3">
                <div className="p-2 bg-light border"></div>
                <strong className='ms-2'>Regular</strong>
            </div>
        </div>
    </div>
  )
}

export default InboxLegends
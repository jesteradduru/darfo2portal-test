import React from 'react'
import TrailBody from './TrailBody'
import TrailBullet from './TrailBullet'

const TrailContainer = ({active, trail, by, date, com_id, act_id}) => {
  return (
    <div className='d-flex align-items-center mb-3'>
        <TrailBullet active={active} date={date} />
        <TrailBody active={active} trail={trail} by={by} com_id={com_id} act_id={act_id} />
    </div>
  )
}

export default TrailContainer
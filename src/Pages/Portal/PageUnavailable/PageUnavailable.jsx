/*
  This page is shown when the route has no match or unavailable.
*/
import { Button, Container } from 'reactstrap'
import React from 'react'
import { useNavigate } from 'react-router-dom'
// import MERN from '../../../Assets/images/MERN.gif'
import err404 from '../../../Assets/images/2451354.jpg'
import err from '../../../Assets/images/11104.jpg'
import { BsFillArrowLeftCircleFill} from 'react-icons/bs'


const PageUnavailable = ({code='err404'}) => {
  const navigate =useNavigate()
  
  const ErrBanner = () => {
    switch(code){
      case 'systemerr':
        return <Container>
          <img src={err} className="mx-auto d-block img-fluid" alt='under development' />
          <h3 className='text-center'><strong>Ooops! Something Went Wrong...</strong></h3>
        </Container>
      default:
        return <img src={err404} className="mx-auto d-block img-fluid" alt='under development' />
    }
  }
  return (
    <div className='pt-5 container'>
        <ErrBanner />
        <Button color="primary" className='mx-auto d-block' onClick={() => {navigate(-1)}}><BsFillArrowLeftCircleFill /> Back</Button>
    </div>
  )
}

export default PageUnavailable;
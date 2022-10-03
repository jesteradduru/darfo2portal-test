/*
  Layout to be displayed when fetching data from server (e.g. loading, error)
*/
import React, {useState} from 'react'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {Button, ModalBody, ModalFooter, Spinner} from 'reactstrap'
import { clearErrorMessage } from '../../../features/dts/communications/communications';
import ModalContainer from '../ModalContainer/ModalContainer';
const _ = require('lodash')

const ContentLoader = (props) => {
  const {children, isLoading = false, errorMessage=''} = props;
  const [isErrModalOpen, setErrModalOpen] = useState(false)
  const [reloadPage, setReloadPage] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    // !_.isNull(errorMessage) && setErrModalOpen(!isErrModalOpen)
    setTimeout(() => {
      setReloadPage(true);
    }, 10000)
  }, [])
  
  return (
    <div>
      {
        isLoading ? 
          <div className="center-element d-flex flex-column align-items-center">
            <Spinner />
            <br />
            <h5>Loading, please wait</h5>
            {/* {reloadPage && <a href=".">Page took too long to load. Click to reload page.</a>} */}
          </div>
        :
          children
      }
      <ModalContainer isModalOpen={isErrModalOpen} toggleModal={() => {
        setErrModalOpen(!isErrModalOpen);
        dispatch(clearErrorMessage());
      }} size='md'>
        <ModalBody>
        <h1 className='text-danger'>Error :(</h1>
        <p className='lead'>{errorMessage}</p>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={() => setErrModalOpen(!isErrModalOpen)} >Okay</Button>
        </ModalFooter>
      </ModalContainer>
    </div>
  )
}

export default ContentLoader
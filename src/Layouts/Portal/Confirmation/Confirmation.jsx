import React from 'react'
import { BsCheck2, BsX } from 'react-icons/bs'
import { ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import IconatedButton from '../IconatedButton/IconatedButton'
import ModalContainer from '../ModalContainer/ModalContainer'

const Confirmation = ({isOpen, toggleModal, onProceed}) => {
  return (
    <ModalContainer isModalOpen={isOpen} toggleModal={toggleModal} title='Confirmation' size='md'>
        <ModalBody>
            <p className="lead">Do you really want to proceed?</p>
        </ModalBody>
        <ModalFooter>
            <IconatedButton
            name="Cancel"
            color="danger"
            onClick={toggleModal}
            icon={<BsX />}
            />
            <IconatedButton icon={<BsCheck2 />} name="Yes" onClick={onProceed} />
        </ModalFooter>
    </ModalContainer>
  )
}

export default Confirmation
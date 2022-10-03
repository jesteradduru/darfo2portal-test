/*
  Modal content container
*/
import React from "react";
import { Modal, ModalHeader} from "reactstrap";
const ModalContainer = (props) => {
  const {isModalOpen = false, toggleModal, title, children, size="xl", backdrop} = props;
  return (
    <Modal isOpen={isModalOpen} toggle={() => toggleModal()} size={size} backdrop={backdrop}>
      <ModalHeader toggle={() => toggleModal()}>{title}</ModalHeader>
        {children}
    </Modal>
  );
};

export default ModalContainer;

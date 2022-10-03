// View Communication Modal
import React, { useEffect } from "react";
import { Button, ModalBody, ModalFooter, Badge, CardFooter, CardBody, Card, CardHeader } from "reactstrap";
import { ModalContainer } from "../../Portal";
import AttachmentsContainer from "../AttachmentsContainer/AttachmentsContainer";
import ImageGallery from "../ImageGallery/ImageGallery";
import moment from "moment";
import {  useDispatch, useSelector } from "react-redux";
import { getCommunication } from "../../../features/dts/communications/communications";
import { getAttachments, getScanned } from "../../../Helpers/dts_helpers";
const _ = require('lodash')

const ViewCommunicationModal = ({isModalOpen, toggleModal, com_id = 0}) => {
  const {viewCommunicationData} = useSelector(state=> state.communication)
  const apiServer = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
    
  useEffect(() => {
    dispatch(getCommunication(com_id))
  }, [dispatch, com_id])
  
  const UrgencyBadge = () => {
    switch(com_urgency){
      case 'OMG':
        return <Badge color="danger">OMG</Badge> 
      case 'Rush':
        return <Badge color="warning">Rush</Badge>
      default:
        return <Badge color="secondary">Regular</Badge>
    }
  }

  const {
    com_controlNo, 
    com_source_name,
    com_source_position,
    com_source_office,
    com_subject,
    com_dateCreated,
    com_other_remarks,
    class_name,
    cat_name,
    scanned=[],
    attachments=[],
    employee= {},
    com_due_date,
    com_urgency
  } = viewCommunicationData;

  return (
    <ModalContainer
      isModalOpen={isModalOpen}
      toggleModal={toggleModal}
      title={com_controlNo}
      size="xl"
    >
    <ModalBody>
    <div
    >
        <Card>
          <CardHeader className="d-flex flex-column">
            <div className="d-flex justify-content-between">
              <h4>{com_controlNo}</h4>
            </div>
            <div>
              <UrgencyBadge />
              {!_.isNull(com_due_date) && (
                <Badge color="info" className="ms-1">
                  Due Date: {moment(com_due_date).format("dddd, MMMM DD, YYYY")}
                </Badge>
              )}
              <i className="text-secondary d-block">
                Created by{" "}
                {`${employee.emp_firstname} ${employee.emp_lastname}`} -{" "}
                {moment(com_dateCreated).format("DD/MM/YYYY")}
              </i>
            </div>
          </CardHeader>
          <CardBody>
            <h4 className="text-info">{com_subject}</h4>
            <ImageGallery
              title={"Scanned Copies"}
              images={getScanned(scanned)}
            />
            <br />
            <AttachmentsContainer attachments={getAttachments(attachments)} />
            <hr />

            <div className="p-2">
              <span className="lead">Other Remarks</span>
              <p>{com_other_remarks}</p>
            </div>
          </CardBody>
          <CardFooter>
            <div>
              <span>Source: </span>
              <u>
                <strong>{com_source_name}</strong>
                {!_.isEmpty(com_source_position) && (
                  <span>, {com_source_position}</span>
                )}
                {!_.isEmpty(com_source_office) && (
                  <span>, {com_source_office}</span>
                )}
              </u>
            </div>
          </CardFooter>
        </Card>
    </div>
        {/* <h6>Document Type: {class_name} {cat_name}</h6>
        <h4 className="text-info">Subject: {com_subject}</h4>
        {com_urgency === 'Rush' ? <Badge color="danger">Rush</Badge> : <Badge color="warning">Urgent</Badge>}
        {!_.isNull(com_due_date) && <Badge color="info" className="ms-1">Due Date: {moment(com_due_date).format('dddd, MMMM DD, YYYY')}</Badge>}
        <p>
          Source:{" "}
          {`${com_source_name}, ${com_source_position}, ${com_source_office}`}
        </p>
        <i className="text-secondary">
          Created by {`${employee.emp_firstname} ${employee.emp_lastname}`} -{" "}
          {moment(com_dateCreated).format("DD/MM/YYYY")}
        </i>
        <hr />
        <ImageGallery title={'Scanned Copies'} images={getScanned(scanned)} />
        <br />
        <AttachmentsContainer attachments={getAttachments(attachments)} />
        <hr />
        <div className="p-2">
        <span className="lead">Other Remarks</span>
        <p>{com_other_remarks}</p>
        </div> */}
    </ModalBody>
    <ModalFooter>
        <Button color="success" onClick={toggleModal}>Okay</Button>
    </ModalFooter> 
    </ModalContainer>
  );
};

export default ViewCommunicationModal;

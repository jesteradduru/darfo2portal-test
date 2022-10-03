//Review Action Taken Page
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { BsChevronRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Container, Form, FormGroup, Input, Label } from "reactstrap";
import {
  getActionTaken,
  reviewActionTaken,
} from "../../../features/dts/action/actionSlice";
import { taskComplete } from "../../../features/dts/tasks/tasksSlice";
import {
  AttachmentsContainer,
  BackButton,
  ImageGallery,
  InputFileImage,
} from "../../../Layouts/DTS";
import { Confirmation, ContentLoader, IconatedButton } from "../../../Layouts/Portal";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getAttachments, getScanned } from "../../../Helpers/dts_helpers";

const ReviewActionTaken = () => {
  const { com_id, inbox_id } = useParams();
  const dispatch = useDispatch();
  const { reviewActionTakenData, isLoading, errorMessage, actor } = useSelector(
    (state) => state.action
  );
  const [isReject, setReject] = useState(false);
  const navigate = useNavigate();
  const [confirmationOpen, setConfirmation] = useState(false);
  const {user} = useSelector(state => state.user)

  const onApproveReject = (e) => {
    setReject(e.target.value === "revise");
  };

  const onConfirmSubmit = (e)  => {
    e.preventDefault()
    setConfirmation(!confirmationOpen);
  }

  const onFormSubmit = async () => {
    

    const formData = new FormData(document.getElementById('review_action_taken_form'));
    formData.set("act_id", reviewActionTakenData.act_id);
    formData.set("com_id", reviewActionTakenData.com_id);
    formData.set("inbox_id", inbox_id);
    const formDataObject = {};

    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    const actionTaken = await dispatch(reviewActionTaken(formData));

    if (actionTaken.payload.act_id) {
      await dispatch(taskComplete(inbox_id));
      navigate("/dts/managementOfCommunications/inbox");
    }
  };

  useEffect(() => {
    dispatch(getActionTaken({ com_id, inbox_id }));
  }, [dispatch]); 

  return (
    <Container className="w-75 mt-3">
      <Confirmation isOpen={confirmationOpen} toggleModal={() => setConfirmation(!confirmationOpen)} onProceed={onFormSubmit} />
      <ContentLoader isLoading={isLoading} errorMessage={errorMessage}>
        <Form onSubmit={onConfirmSubmit} id='review_action_taken_form'>
          <h4>Review Action Taken</h4>
          <hr />
          <FormGroup>
            <Label for="action_taken">
              Description of action taken<span className="text-danger"> *</span>
            </Label>
            <Input
              defaultValue={reviewActionTakenData.act_taken}
              type="textarea"
              rows="6"
              id="action_taken"
              required
              name="action_taken"
            />
          </FormGroup>
          <i className="text-success text-end d-block">{`Acted by ${actor.emp_firstname} ${actor.emp_lastname} - ${actor.office_code}`}</i>
          <i className="text-success text-end d-block">{`${moment(
            reviewActionTakenData.act_date
          ).fromNow()} - ${moment(reviewActionTakenData.act_date).format(
            "DD/MM/YYYY hh:mm A"
          )}`}</i>
           <ImageGallery
              title={"Scanned Copies"}
              images={reviewActionTakenData.scanned && getScanned(reviewActionTakenData.scanned)}
            />
            <br />
            <AttachmentsContainer
              attachments={reviewActionTakenData.scanned && getAttachments(reviewActionTakenData.attachments)}
            />
          <FormGroup>
            <Label for="approve_reject">
              Approve/Reject
            </Label>
            <Input
              id="approve_reject"
              name="approve_reject"
              type="select"
              required
              onChange={onApproveReject}
            >
              <option value="approve">Approve</option>
              <option value="revise">Revise</option>
            </Input>
          </FormGroup>

          {(!isReject && user.role_name === 'Process-level Reviewer') && (
            <InputFileImage label='Communication signed by RED' />
          )}

          {isReject && (
            <FormGroup>
              <Label className="lead" for="reject_remarks">
                Remarks
              </Label>
              <Input
                type="textarea"
                id="reject_remarks"
                required
                name="reject_remarks"
              />
            </FormGroup>
          )}

          <div className="d-flex justify-content-between">
            <BackButton />
            <IconatedButton
              size="md"
              color="primary"
              name="Submit"
              type="submit"
              icon={<BsChevronRight />}
            />
          </div>
        </Form>
      </ContentLoader>
    </Container>
  );
};

export default ReviewActionTaken;

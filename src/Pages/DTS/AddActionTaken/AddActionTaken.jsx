//Add Edit Action Taken Page
import React from "react";
import { BackButton, InputFileDocuments, InputFileImage } from "../../../Layouts/DTS";
import { Form, FormGroup, Label, Input, Container, Spinner } from "reactstrap";
import { Confirmation, IconatedButton } from "../../../Layouts/Portal";
import { BsChevronRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { addActionTaken } from "../../../features/dts/action/actionSlice";
import { useNavigate, useParams } from "react-router-dom";
import { taskComplete } from "../../../features/dts/tasks/tasksSlice";
import { useEffect } from "react";
import { useState } from "react";

const AddActionTaken = () => {
  const dispatch = useDispatch()
  const {inbox_id, com_id} = useParams()
  const {addLoading} = useSelector(state => state.action)
  const navigate = useNavigate();
  const [confirmationOpen, setConfirmation] = useState(false);

  const onFormSubmit = async (e) => {
    const formData = new FormData(document.getElementById('add_action_taken_form'))
    formData.set('com_id', com_id)
    const res = await dispatch(addActionTaken(formData))
    if(res.payload.act_id){
      await dispatch(taskComplete(inbox_id));
      navigate('/dts/managementOfCommunications/inbox')
    }
  }

  const onConfirmSubmit = (e)  => {
    e.preventDefault()
    setConfirmation(!confirmationOpen);
  }

  return (
    <Container className="w-75 mt-3">
      <Confirmation isOpen={confirmationOpen} toggleModal={() => setConfirmation(!confirmationOpen)} onProceed={onFormSubmit} />
      <Form onSubmit={onConfirmSubmit} id='add_action_taken_form'>
        <h4>Add Action Taken</h4>
        <hr />
        <FormGroup>
          <Label for="action_taken">Description of action taken<span className="text-danger">*</span></Label>

          <Input
            type="textarea"
            rows="6"
            id="action_taken"
            required
            name="action_taken"
          />
        </FormGroup>
        <InputFileImage />
        <InputFileDocuments />
        <div className="d-flex justify-content-between">
          <BackButton />
          <IconatedButton
            size="md"
            color="primary"
            name={addLoading ? <Spinner color="light" /> : "Submit"}
            type="submit"
            icon={<BsChevronRight />}
          />
        </div>
      </Form>
    </Container>
  );
};

export default AddActionTaken;

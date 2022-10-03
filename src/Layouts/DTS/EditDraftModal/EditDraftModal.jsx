// For editing drafted communications in Drafts page
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
  ModalFooter,
  ModalBody,
  Container,
  InputGroup,
  InputGroupText,
  FormFeedback,
} from "reactstrap";
import { IconatedButton, ModalContainer } from "../../Portal";
import { BsFillPlusCircleFill, BsXCircleFill } from "react-icons/bs";
import { getClassifications } from "../../../features/dts/classifications/classifications";
import moment from "moment";
import {
  getDrafts,
  resetNewAddedCommunication,
  updateDraft,
} from "../../../features/dts/drafts/draftsSlice";
import {
  resetViewCommunicationData,
  verifyControlNo,
} from "../../../features/dts/communications/communications";
import ViewCommunicationModal from "../ViewCommunicationModal/ViewCommunicationModal";
const _ = require("lodash");

const EditDraftModal = ({ isModalOpen, toggleModal, draftData, socket }) => {
  const dispatch = useDispatch();
  const { office_code } = useSelector((state) => state.user.user);
  const { classifications } = useSelector((state) => state.classifications);
  const { isControlNoExist } = useSelector((state) => state.communication);
  const [dueDate, setDueDate] = useState(moment(draftData.com_due_date).format('YYYY-MM-DD'));
  const [classCode, setClassCode] = useState(draftData.class_code);
  const { newAddedCommunication, userToNotify } = useSelector(state => state.drafts)
  const {viewCommunicationData} = useSelector((state) => state.communication);
  const [isViewCommunicationModalOpen, toggleViewCommunicationModal] =
    useState(false);

  const classificationList = classifications.map((item, index) =>
    item.class_id === draftData.class_id ? (
      <option
        value={item.class_id}
        data-classcode={`${item.class_code}`}
        key={index}
        selected
      >
        {item.class_name} - {item.cat_name}
      </option>
    ) : (
      <option
        value={item.class_id}
        data-classcode={`${item.class_code}`}
        key={index}
      >
        {item.class_name} - {item.cat_name}
      </option>
    )
  );
  const onChangeDueDate = (e) => {
    setDueDate(e.target.value);
  };

  useEffect(() => {
    dispatch(getClassifications());
  }, [dispatch]);

  const onchangeClass = () => {
    const classification = document.getElementById("class_id");
    var selected = classification.options[classification.selectedIndex];
    const class_id = selected.getAttribute("value");
    const days = classifications.filter(
      (data) => data.class_id === parseInt(class_id)
    );
    if (days[0] && days[0].class_due > 0) {
      setDueDate(moment().add(days[0].class_due, "d").format("YYYY-MM-DD"));
    } else {
      setDueDate(null);
    }
    setClassCode(selected.getAttribute("data-classcode"));
  };

  const onChangeControlNo = (e) => {
    const control_no = getControlNumber() + e.target.value;
    if (control_no !== draftData.com_controlNo) {
      dispatch(verifyControlNo(control_no));
    }
  };

  const getControlNumber = () => {
    const split_control_no = draftData.com_controlNo.split(".");
    const split_series_no =
      split_control_no[split_control_no.length - 1].split("-");
    split_series_no.pop();
    const class_series_code = split_series_no.join("-");
    const series_date = split_series_no.slice(
      Math.max(split_series_no.length - 2, 0)
    );
      console.log(series_date)
    let control = `DARFO2.${office_code}`;
    if (classCode !== "") {
      control += "." + classCode + "-" + series_date.join("-") + "-";
    } else {
      control += "." + class_series_code + "-";
    }
    return control;
  };

  const getSeriesCode = () => {
    const split_series_no = draftData.com_controlNo.split("-");
    return split_series_no[split_series_no.length - 1];
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const control_no = formData.get("control_no");
    formData.append("com_id", draftData.com_id);
    formData.set("control_no", getControlNumber() + getSeriesCode());
    formData.append("draft", false);
    const res = await dispatch(updateDraft(formData));
    console.log(res.payload)
    if(res.payload.communication){
      toggleViewCommunicationModal(!isViewCommunicationModalOpen);
      dispatch(getDrafts())
    }
  };

  const onSaveDraft = async () => {
    // console.log('click')
    const formData = new FormData(document.getElementById("edit_draft_modal"));
    const control_no = formData.get("control_no");
    formData.append("com_id", draftData.com_id);
    formData.set("control_no", getControlNumber() + getSeriesCode());
    formData.append("draft", true);
    await dispatch(updateDraft(formData));
    dispatch(getDrafts());
    // toggleModal();
  };


  return (
    <ModalContainer
      isModalOpen={isModalOpen}
      toggleModal={toggleModal}
      title={"Draft"}
      size="xl"
    >
      <ViewCommunicationModal
          isModalOpen={isViewCommunicationModalOpen}
          toggleModal={
          () => {
            toggleViewCommunicationModal(!isViewCommunicationModalOpen);
            dispatch(resetViewCommunicationData());
            dispatch(resetNewAddedCommunication());
            toggleModal();
          }
          }
          com_id={newAddedCommunication}
      />
      <Form onSubmit={onFormSubmit} id="edit_draft_modal">
        <ModalBody>
          <Container className="mt-2">
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="control_no">
                    Control No. <span className="text-danger">*</span>
                  </Label>
                  <InputGroup>
                    <InputGroupText>{getControlNumber() + getSeriesCode()}</InputGroupText>
                    {/* <Input
                      size="sm"
                      id="control_no"
                      name="control_no"
                      type="text"
                      defaultValue={getSeriesCode()}
                      invalid={isControlNoExist}
                      onChange={onChangeControlNo}
                    /> */}
                    <FormFeedback>Control Number already exist</FormFeedback>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="class_id">
                    Classifications <span className="text-danger">*</span>
                  </Label>
                  <Input
                    bsSize="sm"
                    id="class_id"
                    name="class_id"
                    type="select"
                    onChange={onchangeClass}
                    required
                  >
                    <option value="" data-classcode="00-0">
                      Select Classification
                    </option>
                    {classificationList}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="due_date">Due Date</Label>
                  <Input
                    bsSize="sm"
                    id="due_date"
                    name="due_date"
                    type="date"
                    onChange={onChangeDueDate}
                    value={_.isNull(dueDate) ? "" : dueDate}
                  />
                </FormGroup>
              </Col>
              <Col md="12" className="border rounded rounded-4 p-2 mx-2">
                <h6>Source</h6>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label for="source_name">
                        Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        bsSize="sm"
                        id="source_name"
                        name="source_name"
                        type="text"
                        defaultValue={draftData.com_source_name}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label for="source_position">
                        Position
                      </Label>
                      <Input
                        bsSize="sm"
                        id="source_position"
                        name="source_position"
                        type="text"
                        defaultValue={draftData.com_source_position}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label for="source_office">
                        Office
                      </Label>
                      <Input
                        bsSize="sm"
                        id="source_office"
                        name="source_office"
                        type="text"
                        defaultValue={draftData.com_source_office}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
              <Col md="12">
                <FormGroup>
                  <Label for="subject">
                    Subject <span className="text-danger">*</span>
                  </Label>
                  <Input
                    bsSize="sm"
                    id="subject"
                    name="subject"
                    type="textarea"
                    defaultValue={draftData.com_subject}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="date_received">
                    Date Received <span className="text-danger">*</span>
                  </Label>
                  <Input
                    bsSize="sm"
                    id="date_received"
                    name="date_received"
                    type="date"
                    defaultValue={moment(draftData.com_dateReceived).format(
                      "YYYY-MM-DD"
                    )}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="urgency">
                    Urgency <span className="text-danger">*</span>
                  </Label>
                  <Input bsSize="sm" id="urgency" name="urgency" type="select" required>
                    {draftData.com_urgency === "Rush" ? (
                      <>
                        <option value="Rush" selected>
                          Rush
                        </option>
                        <option value="Urgent">Urgent</option>
                      </>
                    ) : (
                      <>
                        <option value="Rush">Rush</option>
                        <option value="Urgent" selected>
                          Urgent
                        </option>
                      </>
                    )}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="scanned">
                    Scanned Copies
                  </Label>
                  <Input
                    size="sm"
                    id="scanned"
                    name="scanned"
                    type="file"
                    multiple
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="attachments">
                    Attachments
                  </Label>
                  <Input
                    size="sm"
                    id="attachments"
                    name="attachments"
                    type="file"
                    multiple
                  />
                </FormGroup>
              </Col>
              <Col md="12">
                <FormGroup>
                  <Label for="other_remarks">
                    Other Remarks
                  </Label>
                  <Input
                    size="sm"
                    id="other_remarks"
                    name="other_remarks"
                    type="textarea"
                    defaultValue={draftData.com_other_remarks}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <IconatedButton
            onClick={onSaveDraft}
            size="sm"
            color="primary"
            name="Save Draft"
            icon={<BsFillPlusCircleFill />}
          />
          <IconatedButton
            type="submit"
            size="sm"
            color="success"
            name="Add Communication"
            icon={<BsFillPlusCircleFill />}
          />
          <IconatedButton
            size="sm"
            onClick={() => toggleModal()}
            name="Cancel"
            color="dark"
            icon={<BsXCircleFill />}
          />
        </ModalFooter>
      </Form>
    </ModalContainer>
  );
};

export default EditDraftModal;

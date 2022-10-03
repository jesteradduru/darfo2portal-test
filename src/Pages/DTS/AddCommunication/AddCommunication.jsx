// Add Communication Page
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  Input,
  Label,
  Button,
  Form,
  InputGroup,
  InputGroupText,
  FormFeedback,
  Spinner,
  FormText,
} from "reactstrap";
import GobackButton from "../../../Layouts/Portal/GoBackButton/GobackButton";
import { useDispatch, useSelector } from "react-redux";
import { getClassifications } from "../../../features/dts/classifications/classifications";
import { addDraft, getDrafts } from "../../../features/dts/drafts/draftsSlice";
import { ViewCommunicationModal } from "../../../Layouts/DTS";
import moment from "moment";
import {
  addCommunication,
  getCommunication,
  resetViewCommunicationData,
  verifyControlNo,
} from "../../../features/dts/communications/communications";
import { Link } from "react-router-dom";
const _ = require("lodash");

const AddCommunication = ({ socket }) => {
  const dispatch = useDispatch();

  const { classifications } = useSelector((state) => state.classifications);
  const { user_id, office_code } = useSelector((state) => state.user.user);
  const { newAddedCommunication, isControlNoExist, addLoading } = useSelector(
    (state) => state.communication
  );
  const [isViewCommunicationModalOpen, toggleViewCommunicationModal] =
    useState(false);
  const [classCode, setClassCode] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [uploadInvalid, setUploadInvalid] = useState({
    scanned: false,
    attachments: false,
  });

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

  const onChangeControlNo = () => {
    const control_no =
      getControlNumber() + document.getElementById("control_no").value;
    dispatch(verifyControlNo(control_no));
  };

  const onChangeDueDate = (e) => {
    setDueDate(e.target.value);
  };

  const onUpload = (e) => {
    const maxfilesize = 25000000;
    const uploadFile = e.target;
    const inputName = uploadFile.getAttribute('name');
    if(!_.isEmpty(uploadFile.files)){
      if (uploadFile.files[0].size > maxfilesize) {
        setUploadInvalid({...uploadInvalid, [inputName]: true})
      } else {
        setUploadInvalid({...uploadInvalid, [inputName]: false})
      }
    }else{
      setUploadInvalid({...uploadInvalid, [inputName]: false})
    }
  };

  const getControlNumber = () => {
    let control = `DARFO2.${office_code}`;
    if (classCode !== "" && classCode != null) {
      control += "." + classCode;
    } else {
      // if(classifications.length !== 0)
      control += ".00-0";
    }
    control += "-" + moment().format("YY-MM") + "-";
    return control;
  };

  const classificationList = classifications.map((item, index) => {
    return (
      <option
        value={item.class_id}
        data-classcode={`${item.class_code}`}
        key={index}
      >
        {item.class_name} - {item.cat_name}
      </option>
    );
  });

  const onSaveDraft = async () => {
    const formData = new FormData(
      document.querySelector("#add_communication_form")
    );
    const control_no = formData.get("control_no");
    formData.append("user_id", user_id);
    formData.append("draft", "true");
    // formData.set("control_no", getControlNumber() + control_no);
    formData.set("control_no", getControlNumber());
    await dispatch(addDraft(formData)).then(() => {
      document.querySelector("#add_communication_form").reset();
      dispatch(getDrafts(user_id));
    });
  };

  const onAddCommunication = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const control_no = formData.get("control_no");
    formData.append("user_id", user_id);
    // formData.set("control_no", getControlNumber() + control_no);
    formData.set("control_no", getControlNumber());
    const res = await dispatch(addCommunication(formData));
    if (res.payload.communication && res.payload !== "com_duplicate") {
      alert("Added Succesfully!");
      const res_new_com = await dispatch(
        getCommunication(res.payload.communication)
      );
      if (!_.isEmpty(res_new_com.payload)) {
        toggleViewCommunicationModal(!isViewCommunicationModalOpen);
      }
      e.target.reset();
    } else {
      alert("Subject of the communication is duplicated");
    }
  };

  useEffect(() => {
    dispatch(getClassifications());
  }, [dispatch]);

  useEffect(() => {
    onChangeControlNo();
  }, [classCode]);

  return (
    <Container className="mt-3">
      <Form id="add_communication_form" onSubmit={onAddCommunication}>
        <div className="d-flex justify-content-between align-items-center">
          <h3>Add Communication</h3>
          <GobackButton />
        </div>

        <ViewCommunicationModal
          isModalOpen={isViewCommunicationModalOpen}
          toggleModal={() => {
            toggleViewCommunicationModal(!isViewCommunicationModalOpen);
            dispatch(resetViewCommunicationData());
          }}
          com_id={newAddedCommunication}
        />

        <Row>
          <Col md="6">
            <FormGroup>
              <Label for="control_no">
                Control No. <span className="text-danger">*</span>
              </Label>
              <InputGroup size="sm">
                <InputGroupText>{getControlNumber()}</InputGroupText>
                <Input
                  id="control_no"
                  name="control_no"
                  type="text"
                  invalid={isControlNoExist}
                  onChange={onChangeControlNo}
                  disabled
                  defaultValue="[AUTO]"
                />
                <FormFeedback>Control number already exist!</FormFeedback>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <div className="d-flex">
                <Label for="class_id">
                  Classification <span className="text-danger">*</span>
                </Label>
                <Link
                  to="/dts/managementOfCommunications/classifications"
                  className="ms-auto"
                >
                  Management of Classifications
                </Link>
              </div>
              <Input
                bsSize="sm"
                id="class_id"
                name="class_id"
                type="select"
                onChange={onchangeClass}
                required
              >
                <option data-classcode="00-0" value="">
                  Select classification
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
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="source_position">Position</Label>
                  <Input
                    bsSize="sm"
                    id="source_position"
                    name="source_position"
                    type="text"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="source_office">Office</Label>
                  <Input
                    bsSize="sm"
                    id="source_office"
                    name="source_office"
                    type="text"
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
              <Input bsSize="sm" id="subject" name="subject" type="textarea" />
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
                required
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label for="urgency">
                Urgency <span className="text-danger">*</span>
              </Label>
              <Input
                bsSize="sm"
                id="urgency"
                name="urgency"
                type="select"
                required
              >
                <option value={"Regular"}>Regular</option>
                <option value={"Rush"}>Rush</option>
                <option value={"OMG"}>OMG</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label for="scanned">
                Scanned Copies
                <span className="text-danger">*</span>
              </Label>
              <Input
                onChange={onUpload}
                bsSize="sm"
                id="scanned"
                name="scanned"
                type="file"
                required
                multiple
                accept="image/*"
                invalid={uploadInvalid.scanned}
              />
              <FormFeedback>
                File too large. Maximum is 25mb.
              </FormFeedback>
              <FormText>
                MULTIPLE FILES ALLOWED 25mb MAX (PNG, JPG, JPEG ONLY)
              </FormText>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label for="attachments">Attachments</Label>
              <Input
                onChange={onUpload}
                bsSize="sm"
                id="attachments"
                name="attachments"
                type="file"
                multiple
                invalid={uploadInvalid.attachments}
                accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
              />
              <FormFeedback>
                File too large. Maximum is 25mb.
              </FormFeedback>
              <FormText>
                MULTIPLE FILES ALLOWED 25mb MAX (PDF, DOCX, PPTX, XLSX, JPG, JPEG, PNG  ONLY)
              </FormText>
            </FormGroup>
          </Col>

          <Col md="12">
            <FormGroup>
              <Label for="other_remarks">Other Remarks</Label>
              <Input
                bsSize="sm"
                id="other_remarks"
                name="other_remarks"
                type="textarea"
              />
            </FormGroup>
          </Col>

          <div className="d-flex justify-content-center mt-2">
            <Button
              color="secondary"
              className="me-2"
              onClick={onSaveDraft}
              disabled={isControlNoExist}
            >
              Save as draft
            </Button>
            <Button type="reset" className="me-2">
              Reset
            </Button>
            <Button color="success" type="submit" disabled={isControlNoExist}>
              {addLoading ? <Spinner color="light" /> : "Add"}
            </Button>
          </div>
        </Row>
      </Form>
    </Container>
  );
};

export default AddCommunication;

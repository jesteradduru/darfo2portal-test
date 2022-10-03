/*
  Modal Form for Adding account under account module.
*/
import React, { useState } from "react";
import { ModalContainer } from "../index";
import { useDispatch } from "react-redux";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
  ModalFooter,
  FormFeedback,
  ModalBody,
  Container,
} from "reactstrap";
import IconatedButton from "../IconatedButton/IconatedButton";
import { BsFillPlusCircleFill, BsXCircleFill } from "react-icons/bs";
import { createAccount, getAccounts } from "../../../features/Portal/accountsSlice";

const createDropdownList = (lists) => {
  const distinctList = [
    ...new Map(lists.map((list) => [list["value"], list])).values(),
  ];

  const dropdownLists = distinctList.map((list, index) => (
    <option key={index} value={list.value}>
      {list.name}
    </option>
  ));

  return dropdownLists;
};

const AddAccountModal = ({
  isModalOpen,
  toggleModal,
  users,
  officeList,
  roleList,
  groups
}) => {
  const officeDropdown = createDropdownList(officeList);
  const roleDropdown = createDropdownList(roleList);
  const usersDropdown = createDropdownList(users);
  const groupsDropdown = createDropdownList(groups);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [isUsernameTaken, setUsernameTaken] = useState(false);
  const dispatch = useDispatch();

  const checkPasswordMatch = () => {
    if (password === confirmPassword) {
      setIsPasswordMatch(true);
    } else {
      setIsPasswordMatch(false);
    }
  };

  const onChangeUsername = (e) => {
    const exist = users.filter(user => {
      return user.user_username === e.target.value
    })
    if(exist.length === 1){
      setUsernameTaken(true)
    }else{
      setUsernameTaken(false)
    }
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();
    checkPasswordMatch();

    const form_data_account = new FormData(e.target);
    const account = {};
    form_data_account.forEach(function (value, key) {
      account[key] = value;
    });

    await dispatch(createAccount(account))
    .then(() => dispatch(getAccounts()));
    toggleModal(false);
  };


  return (
    <ModalContainer
      isModalOpen={isModalOpen}
      toggleModal={toggleModal}
      title={"Add Account"}
    >
     
      <Form onSubmit={onFormSubmit}>
        <ModalBody>
          <Container>
          <h5>Account</h5>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  bsSize="sm"
                  id="username"
                  name="username"
                  onKeyUp={onChangeUsername}
                  type="text"
                  required
                  invalid={isUsernameTaken}
                />
                <FormFeedback>Username is already taken!</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  size="sm"
                  id="password"
                  name="password"
                  type="password"
                  required
                  onKeyUp={(e) => {
                    setPassword(e.target.value);
                  }}
                  invalid={!isPasswordMatch}
                />
              </FormGroup>
              
              <FormGroup>
                <Label for="confPassword">Confirm Password</Label>
                <Input
                  bsSize="sm"
                  id="confPassword"
                  name="confPassword"
                  type="password"
                  required
                  onKeyUp={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  invalid={!isPasswordMatch}
                />
                <FormFeedback>Password does not match.</FormFeedback>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="supervisor_id">Supervisor</Label>
                <Input
                  bsSize="sm"
                  id="supervisor_id"
                  name="supervisor_id"
                  type="select"
                >
                  <option value="">None</option>
                  {usersDropdown}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="role_id">Role</Label>
                <Input
                  bsSize="sm"
                  id="role_id"
                  name="role_id"
                  type="select"
                  required
                >
                  {roleDropdown}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  bsSize="sm"
                  id="email"
                  name="email"
                  type="email"
                  required
                />
              </FormGroup>
            </Col>
            <Col md='6'>
              <FormGroup>
                  <Label for="group_id">Group</Label>
                  <Input
                    bsSize="sm"
                    id="group_id"
                    name="group_id"
                    type="select"
                  >
                    <option value="">None</option>
                    {groupsDropdown}
                  </Input>
              </FormGroup>
            </Col>
            <Col md="12">
              <h5>Employee Data</h5>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="agency_id">Agency ID number</Label>
                <Input
                  bsSize="sm"
                  id="agency_id"
                  name="agency_id"
                  type="text"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="position">Position</Label>
                <Input
                  bsSize="sm"
                  id="position"
                  name="position"
                  type="text"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label for="lastname">Last Name</Label>
                <Input
                  bsSize="sm"
                  id="lastname"
                  name="lastname"
                  type="text"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label for="firstname">First Name</Label>
                <Input
                  bsSize="sm"
                  id="firstname"
                  name="firstname"
                  type="text"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label for="middlename">Middle Name</Label>
                <Input
                  bsSize="sm"
                  id="middlename"
                  name="middlename"
                  type="text"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label for="suffix">Suffix</Label>
                <Input bsSize="sm" id="suffix" name="suffix" type="text" />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label for="contact_no">Contact Number</Label>
                <Input
                  bsSize="sm"
                  id="contact_no"
                  name="contact_no"
                  type="text"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label for="sex">Sex</Label>
                <div>
                  <Label for="sex">Male&nbsp;</Label>
                  <Input name="sex" value="male" type="radio" required />
                  <Label for="sex" className="ms-3">
                    Female&nbsp;
                  </Label>
                  <Input name="sex" value="female" type="radio" required />
                </div>
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label for="birthdate">Date of birth</Label>
                <Input
                  bsSize="sm"
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="office_id">Office</Label>
                <Input
                  bsSize="sm"
                  id="office_id"
                  name="office_id"
                  type="select"
                  required
                >
                  {officeDropdown}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <IconatedButton
            type="submit"
            size="sm"
            color="primary"
            name="Save"
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

export default AddAccountModal;

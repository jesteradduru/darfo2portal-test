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
} from "reactstrap";
import IconatedButton from "../IconatedButton/IconatedButton";
import { BsFillPlusCircleFill, BsXCircleFill } from "react-icons/bs";
import { updateAccount } from "../../../features/Portal/accountsSlice";
import { getAccounts } from "../../../features/Portal/accountsSlice";
import moment from "moment";

const createDropdownList = (lists, id) => {
  const distinctList = [
    ...new Map(lists.map((list) => [list["value"], list])).values(),
  ];

  const dropdownLists = distinctList.map((list, index) => {
    if(list.value === id){
      return (
        <option key={index} value={list.value} selected>
          {list.name}
        </option>
        )
      }
      else{
        return (
        <option key={index} value={list.value}>
          {list.name}
        </option>
        )
      }
    })

  return dropdownLists;
};

const EditAccountModal = ({
  isModalOpen,
  toggleModal,
  users,
  officeList,
  roleList,
  userData,
  groups
}) => {
  
  const officeDropdown = createDropdownList(officeList, userData.office_id);
  const roleDropdown = createDropdownList(roleList, userData.role_id);
  const usersDropdown = createDropdownList(users, userData.supervisor_id);
  const groupsDropdown = createDropdownList(groups, userData.group_id);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const dispatch = useDispatch();

  const checkPasswordMatch = () => {
    if (password === confirmPassword) {
      setIsPasswordMatch(true);
    } else {
      setIsPasswordMatch(false);
    }
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    checkPasswordMatch();

    const form_data_account = new FormData(e.target);
    form_data_account.append("user_id", userData.user_id);
    const account = {};
    form_data_account.forEach(function (value, key) {
      account[key] = value;
    });

    await dispatch(updateAccount(account)).then(() => {
      dispatch(getAccounts());
    });

    toggleModal(false);
  };

  return (
    <ModalContainer
      isModalOpen={isModalOpen}
      toggleModal={toggleModal}
      title={"Edit Account"}
    >
      <Form onSubmit={onFormSubmit}>
        <ModalBody>
          <h5>Account</h5>

          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  bsSize="sm"
                  id="username"
                  name="username"
                  defaultValue={userData.username}
                  type="text"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">New Password</Label>
                <Input
                  bsSize="sm"
                  id="password"
                  name="password"
                  type="password"
                  onKeyUp={(e) => {
                    setPassword(e.target.value);
                  }}
                  invalid={!isPasswordMatch}
                />
              </FormGroup>
              <FormGroup>
                <Label for="confPassword">Confirm New Password</Label>
                <Input
                  bsSize="sm"
                  id="confPassword"
                  name="confPassword"
                  type="password"
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
                  defaultValue={userData.email}
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
                  defaultValue={userData.agency_no}
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
                  defaultValue={userData.position}
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
                  defaultValue={userData.lastname}
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
                  defaultValue={userData.firstname}
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
                  defaultValue={userData.middlename}
                  required
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label for="suffix">Suffix</Label>
                <Input
                  bsSize="sm"
                  id="suffix"
                  name="suffix"
                  type="text"
                  defaultValue={userData.extension}
                />
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
                  defaultValue={userData.contact}
                  required
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label for="sex">Sex</Label>
                <div>
                  <Label for="sex">Male&nbsp;</Label>
                  {userData.sex === "male" ? (
                    <Input
                      name="sex"
                      value="male"
                      type="radio"
                      required
                      checked
                    />
                  ) : (
                    <Input name="sex" value="male" type="radio" required />
                  )}

                  <Label for="sex" className="ms-3">
                    Female&nbsp;
                  </Label>
                  {userData.sex === "female" ? (
                    <Input
                      name="sex"
                      value="female"
                      type="radio"
                      required
                      checked
                    />
                  ) : (
                    <Input name="sex" value="female" type="radio" required />
                  )}
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
                  defaultValue={moment(userData.birthdate).format("YYYY-MM-DD")}
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

export default EditAccountModal;

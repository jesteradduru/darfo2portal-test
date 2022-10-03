// Button for adding recipients (Group or User)
import React, { useEffect } from "react";
import { Button, ButtonGroup, InputGroup } from "reactstrap";
import { BsPlusLg, BsXLg } from "react-icons/bs";
import { useState } from "react";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { getAccounts, getGroups } from "../../../features/Portal/accountsSlice";
import { getOffices } from "../../../features/Portal/officesSlice";
import { setRoutingRecipients } from "../../../features/dts/routing/routingSlice";
import { StyledSelect } from "./AddRecipientButton.styled";

const AddRecipientButton = () => {
  const [showSelectRecipient, setShowSelectRecipient] = useState(false);
  const [showUserSearch, setShowUsersSearch] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const { routingRecipients } = useSelector((state) => state.routing);
  const { users, groups } = useSelector((state) => state.accounts);
  const { offices } = useSelector((state) => state.offices);
  const { user } = useSelector((state) => state.user);
  const [usersUnder, setUsersUnder] = useState([]);
  const dispatch = useDispatch();

  // events
  const onShowUsers = () => {
    setShowSelectRecipient(false);
    setShowUsersSearch(true);
  };

  const onShowGroups = () => {
    setShowSelectRecipient(false);
    setShowGroup(true);
  };

  const onSelectUser = (selectedUsersData) => {
    setSelectedUsers(selectedUsersData);
  };
  const onSelectGroup = (selectedGroup) => {
    setSelectedGroup(selectedGroup);
  };

  const onAddUsers = () => {
    dispatch(setRoutingRecipients(selectedUsers));
    setShowSelectRecipient(false);
    setShowUsersSearch(false);
  };

  const onAddGroup = () => {
    dispatch(setRoutingRecipients(selectedGroup));
    setShowSelectRecipient(false);
    setShowGroup(false);
  };

  //end of events
  const usersList = usersUnder
    .filter(
      (user) =>
        !routingRecipients.map((r) => r.value).includes(user.user_username)
    )
    .map((user) => {
      return {
        user_id: user.user_id,
        user_username: user.user_username,
        user_fullname: `${user.emp_firstname}  ${user.emp_lastname} - ${user.office_code}`,
        role_name: user.role_name,
        role_id: user.role_id,
        value: user.user_username,
        label: `${user.emp_firstname}  ${user.emp_lastname} - ${user.office_code}`,
        type: "user",
      };
    });

  const groupsList = groups
    // .filter(
    //   (group) =>
    //     !routingRecipients.map((r) => r.value).includes(group.group_id)
    // )
    .map((group) => {
      return {
        value: group.group_id,
        label: group.group_name,
        type: "group",
      };
    });

  useEffect(() => {
    dispatch(getAccounts());
    dispatch(getGroups());
    dispatch(getOffices());
  }, [dispatch]);

  useEffect(() => {
    const filterUserByRole = users.filter(
      (data) =>
        !data.role_name.includes("Process-level") &&
        (!data.role_name.includes("Encoder") || !user.role_name.includes('Process-level')) &&
        (!data.role_name.includes("Reviewer") || !user.role_name.includes('Process-level')) &&
        !data.role_name.includes("Admin") &&
        data.user_id !== user.user_id
    );

    let officesUnderAll = [];

    let officesUnder = offices.filter((office) => {
      return office.office_under === user.office_code;
    });

    officesUnderAll = offices
      .filter((office) => {
        return (
          officesUnder
            .map((data) => data.office_code)
            .includes(office.office_under) ||
          office.office_code === user.office_code ||
          office.office_under === user.office_code
        );
      })
      .map((office) => office.office_code);

    const usersFilterByOffice = filterUserByRole.filter((data) => {
      return officesUnderAll.includes(data.office_code);
    });

    if(user.role_name.includes('Process-level')){
      // console.log(filterUserByRole)
      setUsersUnder(filterUserByRole);
      
    }else{
      setUsersUnder(usersFilterByOffice);
    }

  }, [offices, user]);

  return (
    <div className="d-flex align-items-center" style={{ zIndex: 100 }}>
      {showSelectRecipient && (
        <ButtonGroup>
          <Button type="button" color="success" onClick={onShowUsers}>
            User
          </Button>
          <Button type="button" color="warning" onClick={onShowGroups}>
            Group
          </Button>
        </ButtonGroup>
      )}

      {showUserSearch && !showSelectRecipient && (
        <>
          <StyledSelect
            options={usersList}
            isMulti
            onChange={onSelectUser}
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <Button color="success" onClick={onAddUsers}>
            Add
          </Button>
        </>
      )}

      {showGroup && !showSelectRecipient && (
        <>
          <StyledSelect
            options={groupsList}
            isMulti
            onChange={onSelectGroup}
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <Button color="success" onClick={onAddGroup}>
            Add
          </Button>
        </>
      )}

      {showSelectRecipient || showUserSearch || showGroup ? (
        <Button
          color="danger"
          type="button"
          className="ms-2"
          onClick={() => {
            setShowSelectRecipient(false);
            setShowUsersSearch(false);
            setShowGroup(false);
            setSelectedUsers([]);
          }}
        >
          <BsXLg />
        </Button>
      ) : (
        <Button
          color="primary"
          type="button"
          className="ms-2"
          onClick={() => {
            setShowSelectRecipient(true);
            setSelectedUsers([]);
          }}
        >
          Add Recipient/s &nbsp;
          <BsPlusLg />
        </Button>
      )}
    </div>
  );
};

export default AddRecipientButton;

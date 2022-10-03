/*
  This is the account page, a sub page of Admin Panel Page.
*/
import React, { useEffect, useState } from "react";
import { Row, Col, Container, Badge, Spinner } from "reactstrap";
import {
  ContentHeader,
  ContentSearch,
  ActionDropdown,
  AddAccountModal,
  EditAccountModal
} from "../../../Layouts/Portal";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { getAccounts, getGroups } from "../../../features/Portal/accountsSlice";
import { getOffices } from "../../../features/Portal/officesSlice";
import { getRoles } from "../../../features/Portal/rolesSlice";

const Accounts = () => {
  const [isAddAccountModalOpen, toggleAddAccountModal] = useState(false);
  const [isEditAccountModalOpen, toggleEditAccountModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [editUserData, setEditUserData] = useState({});
  const { users, isLoading, groups } = useSelector((state) => state.accounts);
  const { offices } = useSelector((state) => state.offices);
  const { roles } = useSelector((state) => state.roles);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAccounts());
    dispatch(getOffices());
    dispatch(getRoles());
    dispatch(getGroups());
  }, [dispatch]);

  const onSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  const columns = [
    { name: "Username", selector: (row) => row.username, sortable: true },
    { name: "Full Name", selector: (row) => row.fullname, sortable: true },
    { name: "Position", selector: (row) => row.position, sortable: true },
    { name: "Role", selector: (row) => row.role, sortable: true },
    {
      name: "Office",
      selector: (row) => row.office,
      sortable: true,
      wrap: true,
    },
    {
      name: "Status",
      cell: (row) => {
        if (row.status === "activated")
          return <Badge color="success">Activated</Badge>;
        else {
          return <Badge color="danger">Deactivated</Badge>;
        }
      },
    },
    {
      name: "Action",
      cell: (row) => {
        return (
          <ActionDropdown
            userId={row.user_id}
            toggleEditAccountModal={() => {
              toggleEditAccountModal(!isEditAccountModalOpen);
              setEditUserData(row);
            }}
          />
        );
      },
    },
  ];

  const data = users.map((user) => {
    return {
      user_id: user.user_id,
      username: user.user_username,
      role_id: user.role_id,
      user_supervisor_id: user.user_supervisor_id,
      agency_no: user.emp_agencyIdNo,
      firstname: user.emp_firstname,
      middlename: user.emp_middlename,
      lastname: user.emp_lastname,
      extension: user.emp_extension,
      birthdate: user.emp_dateOfBirth,
      sex: user.emp_sex,
      contact: user.emp_contact,
      office_id: user.office_id,
      email: user.emp_email,
      fullname: `${user.emp_firstname} ${user.emp_middlename[0]}. ${user.emp_lastname} ${user.emp_extension} `,
      position: user.emp_position,
      role: user.role_name,
      office: user.office_name,
      status: user.user_accountStatus,
      group_id: user.group_id
    };
  });

  const filteredData = data.filter((user) => {
    return user.username.toLowerCase().includes(searchValue.toLocaleLowerCase());
  });

  const clearSearch = () => {
    setSearchValue("");
  };

  const officeLists = offices.map((office) => {
    return {
      name: office.office_code + ' - '  + office.office_name,
      value: office.office_id, 
    };
  });

  const roleLists = roles.map((role) => {
    return {
      name: role.role_name,
      value: role.role_id,
    };
  });

  const userList = users.map((user) => {
    return {
      name: `${user.emp_firstname} ${user.emp_middlename[0]}. ${user.emp_lastname} ${user.emp_extension} - ${user.emp_position} `,
      value: user.user_id,
    };
  });

  const groupsList = groups.map((group) => {
    return {
      name: `${group.group_name}`,
      value: group.group_id,
    };
  });


  return (
    <Container className="mt-3">
      <AddAccountModal
        isModalOpen={isAddAccountModalOpen}
        toggleModal={toggleAddAccountModal}
        officeList={officeLists}
        roleList={roleLists}
        users={userList}
        groups={groupsList}
      />
      <EditAccountModal
        isModalOpen={isEditAccountModalOpen}
        toggleModal={toggleEditAccountModal}
        officeList={officeLists}
        roleList={roleLists}
        users={userList}
        userData={editUserData}
        groups={groupsList}
      />

      <Row>
        <Col md="12">
          <ContentHeader
            name="Accounts"
            buttonName="Add Account"
            toggleModal={() => toggleAddAccountModal(!isAddAccountModalOpen)}
          />
        </Col>

        <Col md="12">
          <Row>
            <Col sm="12" md="6">
              <ContentSearch
                placeholder={"Search user..."}
                onSearchValueChange={onSearchValueChange}
                searchValue={searchValue}
                clearSearch={clearSearch}
              />
            </Col>
            <Col>
              {/* <Row>
                <Col>
                  <ContentFilterDropdown name="Office" lists={officeLists} />
                </Col>
                <Col>
                  <ContentFilterDropdown name="Role" lists={roleLists} />
                </Col>
              </Row> */}
            </Col>
          </Row>
        </Col>

        <Col>
          <DataTable
            data={filteredData}
            columns={columns}
            highlightOnHover
            pagination
            progressPending={isLoading}
            progressComponent={
              <Spinner />
            }
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Accounts;

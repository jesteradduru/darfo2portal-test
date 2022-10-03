/*
  /*
  This is the roles & permissions page, a sub page of Admin Panel Page.
*/
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "reactstrap";
import DataTable from "react-data-table-component";
import {
  ContentSearch,
  ContentHeader,
  IconatedButton,
  AddRoleModal,
  EditRoleModal
} from "../../../Layouts/Portal";
import { BsFillPencilFill, BsTrashFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { deleteRole, getRolePermissions, getRoles } from "../../../features/Portal/rolesSlice";



const Roles = () => {
  const dispatch = useDispatch()
  const {roles, isLoading} = useSelector(state => state.roles)
  const [isAddRoleModalOpen, toggleAddRoleModal] = useState(false);
  const [isEditRoleModalOpen, toggleEditRoleModal] = useState(false);
  const [editRoleData, setEditRoleData] = useState({})
  
  const onDeleteRole = async (role_id, role_name)=> {
    if(window.confirm(`Do you really want to delete ${role_name}`)){
      const res = await dispatch(deleteRole(role_id))
      
      if(res.payload === 'role_delete_unable'){
        alert('Unable to delete. This role is associated to a user.')
      }else{
        dispatch(getRoles())
      }
    }
  }  
  const onEditRole = (role_data) => {
    setEditRoleData(role_data)
  }

  const columns = [
    { name: "Role Name", selector: (row) => row.role_name, sortable: true },
    { name: "Users", selector: (row) => row.users, sortable: true },
    { name: "Granted", selector: (row) => row.granted, sortable: true },
    {
      name: "Action",
      cell: (row) => {
        return (
          <div className="d-flex align-items-center ">
            <IconatedButton className='me-1' icon={<BsFillPencilFill />} onClick={() => {
              onEditRole(row)
              dispatch(getRolePermissions(row.role_id))
              toggleEditRoleModal(!isEditRoleModalOpen)
            }} />
            <IconatedButton
              icon={<BsTrashFill />}
              color="danger"
              onClick={() => onDeleteRole(row.role_id, row.role_name)}
            />
          </div>
        );
      },
    },
  ];

  const data = roles.map(role => {
    return (
      {
        role_id: role.role_id,
        role_name: role.role_name,
        users: role.user_count,
        granted: role.granted_count,
      }
    )
    
  });

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch])
  
  return (
    <Container className="mt-3">
      <AddRoleModal isModalOpen={isAddRoleModalOpen} toggleModal={toggleAddRoleModal} roles={roles} />
      <EditRoleModal isModalOpen={isEditRoleModalOpen} toggleModal={toggleEditRoleModal} roleData={editRoleData} />
      <Row>
        <Col md="12">
          <ContentHeader name="Roles" buttonName="Add Role" toggleModal={() => toggleAddRoleModal(!isAddRoleModalOpen)} />
        </Col>
        <Col md="12">
          <Row>
            <Col md="6">
              <ContentSearch placeholder={"Search role..."} className="mb-3" />
            </Col>
          </Row>
        </Col>
        <Col>
          <div className="mt-2"></div>
          <DataTable
            data={data}
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

export default Roles;

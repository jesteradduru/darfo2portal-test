/*
  Modal Form for adding roles and permissions under roles module.
*/
import React, { useEffect, useState } from "react";
import {
  ModalBody,
  ModalFooter,
  Input,
  Label,
  FormGroup,
  Form,
  FormFeedback,
} from "reactstrap";
import { ModalContainer, IconatedButton } from "../index";
import { BsXCircleFill, BsFillPlusCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  addRole,
  getPermissions,
  getRoles,
  setPermissions,
} from "../../../features/Portal/rolesSlice";
const AddRoleModal = ({ isModalOpen, toggleModal, roles }) => {
  const { permissions } = useSelector((state) => state.roles);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPermissions());
  }, [dispatch]);

  const handleAllChecked = (event) => {
    const permissionList = permissions.map((permission) => ({
      perm_name: permission.perm_name,
      perm_id: permission.perm_id,
      isChecked: event.target.checked,
    }));
    dispatch(setPermissions(permissionList));
  };

  const handleCheckChildElement = (event) => {
    let permissionList = permissions.map((permission) => {
      if (permission.perm_id === parseInt(event.target.value)) {
        return {
          perm_name: permission.perm_name,
          perm_id: permission.perm_id,
          isChecked: event.target.checked,
        };
      } else {
        return {
          perm_name: permission.perm_name,
          perm_id: permission.perm_id,
          isChecked: permission.isChecked,
        };
      }
    });
    dispatch(setPermissions(permissionList));
  };

  const permissionCheckboxes = permissions.map((permission) => {
    return (
      <FormGroup check style={{ flex: "50%" }} className="text-wrap">
        <Label check for={permission.perm_name}>
          {permission.perm_name}
        </Label>
        <Input
          type="checkbox"
          value={permission.perm_id}
          id={permission.perm_name}
          checked={permission.isChecked}
          onChange={handleCheckChildElement}
          name={permission.perm_name}
        />
      </FormGroup>
    );
  });

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const role_permissions = [];

    formData.forEach(function (value, key) {
      if (key !== "role_name") {
        role_permissions.push(value);
      }
    });

    const role_permissions_data = {
      role_name: formData.get("role_name"),
      permissions: role_permissions,
    };

    if (!isRoleNameTaken) {
      await dispatch(addRole(role_permissions_data)).then(() => {
        dispatch(getRoles());
        toggleModal();
      });
    }else{
      alert("Role name taken!")
    }
  };

  const [isRoleNameTaken, setRoleTaken] = useState(false);
  const onChangeRoleName = (e) => {
    const exist = roles.filter((role) => {
      return role.role_name === e.target.value;
    });
    if (exist.length === 1) {
      setRoleTaken(true);
    } else {
      setRoleTaken(false);
    }
  };

  return (
    <ModalContainer
      isModalOpen={isModalOpen}
      toggleModal={toggleModal}
      size="lg"
      title="Add Role"
    >
      {/* {isLoading && <Loader />} */}
      <Form onSubmit={onFormSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="role-name">Role Name</Label>
            <Input
              type="text"
              id="role-name"
              name="role_name"
              onKeyUp={onChangeRoleName}
              required
              invalid={isRoleNameTaken}
            />
            <FormFeedback>Role name is taken!</FormFeedback>
          </FormGroup>
          <h6 className="text-center text-primary">
            Document Tracking System Permissions
          </h6>
          <div className="d-flex flex-wrap">
            <FormGroup check className="me-5" style={{ flex: "50%" }}>
              <Label check for="check_all">
                Check/Uncheck All
              </Label>
              <Input
                type="checkbox"
                value="check_all"
                id="check_all"
                onChange={handleAllChecked}
              />
            </FormGroup>
            {permissionCheckboxes}
          </div>
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

export default AddRoleModal;

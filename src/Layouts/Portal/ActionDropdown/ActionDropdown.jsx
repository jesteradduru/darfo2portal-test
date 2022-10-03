/*
  Dropdown menu of actions per row in the data tables.
*/
import React, {useState} from 'react'
import { useDispatch } from 'react-redux';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { deleteAccount, getAccounts } from '../../../features/Portal/accountsSlice';
const ActionDropdown = ({userId, toggleEditAccountModal, userData}) => {
    const [dropdownOpen, toggleDropdown] = useState(false);
    const onToggleDropdown = () => toggleDropdown(!dropdownOpen);
    const dispatch = useDispatch();

    const onDeleteAccount = async (user_id) => {
        if(window.confirm("Are you sure you want to delete this account?")){
            await dispatch(deleteAccount(user_id))
            .then(() => {
              dispatch(getAccounts());
            })
        }
    }

  return (
    <Dropdown toggle={() => onToggleDropdown()} isOpen={dropdownOpen}>
            <DropdownToggle
              caret
              size="sm"
              color="secondary"
              onClick={onToggleDropdown}
            >
              Action
            </DropdownToggle>
            <DropdownMenu container="body">
              <DropdownItem
               onClick={() => toggleEditAccountModal()}
              >
                Edit
              </DropdownItem>
              <DropdownItem>Deactivate</DropdownItem>
              <DropdownItem onClick={() => onDeleteAccount(userId)}>Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
  )
}

export default ActionDropdown
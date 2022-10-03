// Dropdown Button Component
import React, { useState } from "react";
import { ButtonDropdown, DropdownMenu, DropdownToggle } from "reactstrap";

const DropdownButton = (props) => {
  const [isOpen, setOpen] = useState(false);
  const {name, children} = props;
  return (
    <ButtonDropdown color='primary' isOpen={isOpen} toggle={() => setOpen(!isOpen)} >
      <DropdownToggle caret>{name}</DropdownToggle>
      <DropdownMenu>{children}</DropdownMenu>
    </ButtonDropdown>
  );
};

export default DropdownButton;

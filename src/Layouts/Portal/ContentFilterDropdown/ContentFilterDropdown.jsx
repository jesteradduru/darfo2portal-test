/*
 This is responsible for filtering data from the datatable
*/
import React from "react";
import { FormGroup, Input } from "reactstrap";

const ContentFilterDropdown = ({ name, lists }) => {
  const distinctList = [
    ...new Map(lists.map((list) => [list["value"], list])).values(),
  ];
  const dropdownLists = distinctList.map((list, index) => (
    <option key={index} value={list.value}>
      {list.name}
    </option>
  ));
  return (
    <FormGroup>
      <div className="d-flex align-items-center justify-content-center">
        <div className="me-2">{name}</div>
        <Input type="select" bsSize="sm">
          <option value="all">All</option>
          {dropdownLists}
        </Input>
      </div>
    </FormGroup>
  );
};

export default ContentFilterDropdown;

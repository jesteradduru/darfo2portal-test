/*
  This component is for searching data from data table.
*/
import React from "react";
import { Input, Button, InputGroup } from "reactstrap";
const ContentSearch = ({placeholder, searchValue, onSearchValueChange, onFilterData, clearSearch }) => {
  return (
    <div className="d-flex">
      <InputGroup className="me-2">
        <Input type="text" placeholder={placeholder} bsSize="sm" value={searchValue} onChange={onSearchValueChange} />
        <Button color="secondary" onClick={clearSearch}>X</Button>
      </InputGroup>
      {/* <Button size="sm" color="success" onClick={onFilterData}>
        Search
      </Button> */}
    </div>
  );
};

export default ContentSearch;

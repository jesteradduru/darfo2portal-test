// Checkboxes in Routing Form
import React, { useState } from "react";
import { FormGroup, Input, Label } from "reactstrap";

const RoutingCheckbox = ({ name, desc, id, textbox, defaultValue, isLegendContains, value }) => {
  const [isCheck, setCheck] = useState(isLegendContains(value));

  const checkBox = () => {
    setCheck(!isCheck);
  };

  return (
    <FormGroup check>
      <Input type="checkbox" name={name} id={id} onChange={checkBox} checked={isCheck} value={value} />
      {desc && (
        <Label check for={id} className='wrap'>
          {desc}
        </Label>
      )}
      {textbox && <Input type="textarea" defaultValue={defaultValue} disabled={!isCheck} rows='3' name={`${value}_text`} />}
    </FormGroup>
  );
};

export default RoutingCheckbox;

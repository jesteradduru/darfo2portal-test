import React from "react";
import { useState } from "react";
import { FormFeedback, FormGroup, FormText, Input, Label } from "reactstrap";
const _ = require('lodash')

const InputFileImage = ({label = 'Scanned Copies', required = false}) => {
  const [uploadInvalid, setUploadInvalid] = useState({
    scanned: false,
    attachments: false,
  });
  const onUpload = (e) => {
    const maxfilesize = 25000000;
    const uploadFile = e.target;
    const inputName = uploadFile.getAttribute("name");
    if (!_.isEmpty(uploadFile.files)) {
      if (uploadFile.files[0].size > maxfilesize) {
        setUploadInvalid({ ...uploadInvalid, [inputName]: true });
      } else {
        setUploadInvalid({ ...uploadInvalid, [inputName]: false });
      }
    } else {
      setUploadInvalid({ ...uploadInvalid, [inputName]: false });
    }
  };

  return (
    <FormGroup>
      <Label for="scanned">
        {label}
        {required && <span className="text-danger">*</span>}
      </Label>
      <Input
        onChange={onUpload}
        bsSize="sm"
        id="scanned"
        name="scanned"
        type="file"
        multiple
        accept="image/*"
        required={required}
        invalid={uploadInvalid.scanned}
      />
      <FormFeedback>File too large. Maximum is 25mb.</FormFeedback>
      <FormText>MULTIPLE FILES ALLOWED 25mb MAX (PNG, JPG, JPEG ONLY)</FormText>
    </FormGroup>
  );
};

export default InputFileImage;

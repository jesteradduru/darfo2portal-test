import React from "react";
import { useState } from "react";
import { FormGroup, Label, Input, FormFeedback, FormText } from "reactstrap";
const _ = require("lodash");

const InputFileDocuments = ({label = 'Attachments'}) => {
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
      <Label for="attachments">{label}</Label>
      <Input
        onChange={onUpload}
        bsSize="sm"
        id="attachments"
        name="attachments"
        type="file"
        multiple
        invalid={uploadInvalid.attachments}
        accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
      />
      <FormFeedback>File too large. Maximum is 25mb.</FormFeedback>
      <FormText>
        MULTIPLE FILES ALLOWED 25mb MAX (PDF, DOCX, PPTX, XLSX, JPG, JPEG, PNG
        ONLY)
      </FormText>
    </FormGroup>
  );
};

export default InputFileDocuments;

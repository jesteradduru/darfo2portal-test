// Modal for editing classifications under Classification Page
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FormGroup,
  Label,
  Input,
  Form,
  ModalFooter,
  ModalBody,
  Button,
} from "reactstrap";
import { IconatedButton, ModalContainer } from "../../Portal";
import { BsFillPlusCircleFill, BsXCircleFill } from "react-icons/bs";
import ManageCategoryModal from "../ManageCategoryModal/ManageCategoryModal";
import {  getCategories, getClassifications, updateClassification } from "../../../features/dts/classifications/classifications";

const EditClassificationModal = ({ isModalOpen, toggleModal, classificationData }) => {

  const dispatch = useDispatch()
  const [isAddCategoryModalOpen, toggleAddCategoryModal] = useState(false);
  const { categories} = useSelector(state => state.classifications)

  const categoryList = categories.map((cat, index) => (
    <option value={cat.cat_id} key={index} selected={classificationData.cat_id === cat.cat_id && "true"}>
      {cat.cat_name}
    </option>
  ));

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])

  return (
    <ModalContainer
      isModalOpen={isModalOpen}
      toggleModal={toggleModal}
      title={"Edit Classification"}
      size="lg"
    >
      <ManageCategoryModal
        toggleModal={toggleAddCategoryModal}
        isModalOpen={isAddCategoryModalOpen}
      />
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const classification = {};
          formData.forEach(function (value, key) {
            classification[key] = value;
          });

          classification['class_id'] = classificationData.class_id;
          
           await dispatch(updateClassification(classification))
           .then(() => {dispatch(getClassifications()); toggleModal()});
        }}
      >
        <ModalBody>
          <FormGroup>
            <div className="d-flex mb-1">
              <Label for="cat_id">Category</Label>
              <div className="ms-auto">
                <Button
                  onClick={() =>
                    toggleAddCategoryModal(!isAddCategoryModalOpen)
                  }
                  size="sm"
                  className="me-1"
                  color="success"
                  outline
                >
                  Manage Categories
                </Button>
              </div>
            </div>
            <Input type="select" id="cat_id" name="cat_id">
              {categoryList}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="class_name">Classification Name</Label>
            <Input type="text" id="class_name" name="class_name" defaultValue={classificationData.class_name} />
          </FormGroup>
          <FormGroup>
            <Label for="class_code">Classification Code</Label>
            <Input type="text" id="class_code" name="class_code" defaultValue={classificationData.class_code} />
          </FormGroup>
          <FormGroup>
            <Label for="class_name">Due(days)</Label>
            <Input type="number" id="class_due" name="class_due" defaultValue={classificationData.class_due} min={0} minLength={1} />
          </FormGroup>
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

export default EditClassificationModal;

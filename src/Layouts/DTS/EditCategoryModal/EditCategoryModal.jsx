// Modal for editing categories under Classification Page
import React from "react";
import { ModalContainer, IconatedButton } from "../../Portal";
import {
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  ModalBody,
} from "reactstrap";
import { BsFillPlusCircleFill, BsXCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { getCategories, updateCategory } from "../../../features/dts/classifications/classifications";

const EditCategoryModal = ({
  isModalOpen,
  toggleModal,
  data,
}) => {
const dispatch = useDispatch()
const onFormSubmit = async (e)=> {
    e.preventDefault();
    const formData = new FormData(e.target)
    formData.append("cat_id", data.cat_id)

    const category = {};
    formData.forEach(function (value, key) {
        category[key] = value;
    });

    await dispatch(updateCategory(category))
    .then(() => {dispatch(getCategories()); toggleModal();})
}
  return (
    <ModalContainer
      isModalOpen={isModalOpen}
      toggleModal={toggleModal}
      title={"Edit Category"}
      size="md"
      backdrop={false}
    >
      <Form onSubmit={onFormSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="cat_name">Category Name</Label>
            <Input
              type="text"
              id="cat_name"
              name="cat_name"
              required
              defaultValue={data.cat_name}
            />
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

export default EditCategoryModal;

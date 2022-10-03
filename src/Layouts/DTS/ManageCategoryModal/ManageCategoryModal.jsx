// Modal for adding Categories of classifications
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FormGroup,
  Label,
  Input,
  Form,
  ModalFooter,
  ModalBody,
  InputGroup,
  Button,
  Spinner,
} from "reactstrap";
import { IconatedButton, ModalContainer } from "../../Portal";
import { BsArrowLeftCircleFill, BsPencilFill, BsTrashFill } from "react-icons/bs";
import DataTable from "react-data-table-component";
import EditCategoryModal from "../EditCategoryModal/EditCategoryModal";
import { addCategory, deleteCategory, getCategories } from "../../../features/dts/classifications/classifications";

const ManageCategoryModal = ({ isModalOpen, toggleModal }) => {
  const [isEditCategoryModalOpen, toggleEditCategoryModal] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState({});
  const {categories, isLoading} = useSelector(state => state.classifications) 
  const dispatch = useDispatch()
  const columns = [
    {
      name: "Category",
      selector: (row) => row.cat_name,
    },
    {
      name: "Action",
      cell: (row) => {
        return (
          <div className="d-flex my-2">
            <Button
              size="sm"
              color="success"
              className="me-1"
              onClick={() => {
                toggleEditCategoryModal(!isEditCategoryModalOpen);
                setEditCategoryData(row)
              }}
            >
              <BsPencilFill />
            </Button>
            <Button size="sm" color="danger" onClick={async() => {
                if(window.confirm(`Are you sure you want to delete ${row.cat_name}?`)){
                  const res = await dispatch(deleteCategory(row.cat_id))

                  if(res.payload === 'category_delete_unable'){
                    alert('Unable to delete. This category is associated to a classication.')
                  }else{
                    dispatch(getCategories())
                  }
                }
            }}>
              <BsTrashFill />
            </Button>
          </div>
        );
      },
    },
  ];
  const data = categories;

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // alert(formData.get("cat_name"));
    const category = {};
    formData.forEach(function (value, key) {
      category[key] = value;
    });
    await dispatch(addCategory(category))
    .then(() => dispatch(getCategories()))
  };

  return (
    <ModalContainer
      isModalOpen={isModalOpen}
      toggleModal={toggleModal}
      title={"Manage Categories"}
      size="lg"
      backdrop={false}
    >
      <EditCategoryModal
        data={editCategoryData}
        isModalOpen={isEditCategoryModalOpen}
        toggleModal={toggleEditCategoryModal}
      />
      <ModalBody>
        <Form onSubmit={onFormSubmit}>
          <FormGroup>
            <Label for="cat_name">Category Name</Label>
              <InputGroup>
                <Input type="text" id="cat_name" name="cat_name" required />
                <Button type="submit">Add</Button>
              </InputGroup>
          </FormGroup>
        </Form>
        <hr />
        <DataTable
          data={data}
          columns={columns}
          highlightOnHover
          pagination
          progressPending={isLoading}
          progressComponent={<Spinner />}
        />
      </ModalBody>
      <ModalFooter>
        <IconatedButton
          size="sm"
          onClick={() => toggleModal()}
          name="Back"
          color="primary"
          icon={<BsArrowLeftCircleFill />}
        />
      </ModalFooter>
    </ModalContainer>
  );
};

export default ManageCategoryModal;

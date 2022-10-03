/*
    Classifications Page
*/
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "reactstrap";
import { ContentHeader, ContentSearch } from "../../../Layouts/Portal";
import DataTable from "react-data-table-component";
import { AddClassificationModal, EditClassificationModal } from "../../../Layouts/DTS";
import {BsPencilFill, BsTrashFill} from 'react-icons/bs';
import { useDispatch, useSelector } from "react-redux";
import { deleteClassification, getClassifications } from "../../../features/dts/classifications/classifications";

const Classfications = () => {

    const dispatch = useDispatch()
    const [isAddClassificationModalOpen, toggleClassificationModal ] = useState(false)
    const [isEditClassificationModalOpen, toggleEditClassificationModal ] = useState(false)
    const [classificationData, setClassificationData] = useState({})
    const {classifications, isLoading} = useSelector(state => state.classifications)
    const [searchValue, setSearchValue] = useState("");

    const columns = [
        {
        name: "Category",
        selector: (row) => row.cat_name,
        sortable: true,
        },
        { name: "Classification", selector: (row) => row.class_name, sortable: true},
        { name: "Code", selector: (row) => row.class_code, sortable: true,  },
        { name: "Due Date", selector: (row) => row.class_due, sortable: true, cell: (row) => <>{`${row.class_due} days`}</> },
        {name: "Actions", cell: (row) => {
          return (
            <div className="d-flex">
              <Button size="sm" color="success" className="me-1" onClick={()=> {
                toggleEditClassificationModal(!isEditClassificationModalOpen)
                setClassificationData(row)
              }}><BsPencilFill /></Button>
              <Button size="sm" color="danger" onClick={async () => {
                if(window.confirm(`Do you really want to delete ${row.class_name}?`)){
                  const res = await dispatch(deleteClassification(row.class_id));
                  
                  if(res.payload === 'class_delete_unable'){
                    alert('Unable to delete. This Classification is assiociated to a communication.')
                  }else{
                    dispatch(getClassifications())
                  }
                }
              }}><BsTrashFill /></Button>
            </div>
          )
        }}
    ];

    const data = classifications;

    const filteredData = data.filter((classification) => {
      return classification.class_name.toLowerCase().includes(searchValue.toLocaleLowerCase());
    });
  
    const clearSearch = () => {
      setSearchValue("");
    };

    const onSearchValueChange = (e) => {
      setSearchValue(e.target.value);
    };

    useEffect(() => {
      dispatch(getClassifications())
    }, [dispatch])

    return (
    <Container className="mt-3">
      <AddClassificationModal isModalOpen={isAddClassificationModalOpen} toggleModal={toggleClassificationModal} />
      <EditClassificationModal isModalOpen={isEditClassificationModalOpen} toggleModal={toggleEditClassificationModal} classificationData={classificationData} />
      <Row>
        <Col md="12">
          <ContentHeader
            name="Classifications"
            buttonName="Add Classification"
            toggleModal={() => toggleClassificationModal(!isAddClassificationModalOpen)}
          />
        </Col>
        <Col md="12">
          <Row>
            <Col md="6">
              <ContentSearch
                placeholder={"Search classification name..."}
                className="mb-3"
                onSearchValueChange={onSearchValueChange}
                searchValue={searchValue}
                clearSearch={clearSearch}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <div className="mt-2"></div>
          <DataTable
            data={filteredData}
            columns={columns}
            highlightOnHover
            pagination
            progressPending={isLoading}
            progressComponent={
              <Spinner />
            }
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Classfications;

/*
    Drafts Page
*/
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "reactstrap";
import {  ContentSearch } from "../../../Layouts/Portal";
import DataTable from "react-data-table-component";
import {BsPencilFill, BsTrashFill} from 'react-icons/bs';
import { useDispatch, useSelector } from "react-redux";
import { discardDraft, getDrafts } from "../../../features/dts/drafts/draftsSlice";
import moment from "moment";
import { EditDraftModal } from "../../../Layouts/DTS";
import Highlighter from "react-highlight-words";
const _ = require('lodash');


const Drafts = ({socket}) => {

    const dispatch = useDispatch()
    const [searchValue, setSearchValue] = useState("");
    const {isLoading, drafts} = useSelector(state => state.drafts)
    const [isEditDraftModalOpen, toggleEditDraftModal] = useState(false)
    const [draftData, setDraftData] = useState({})
    const {user_id} = useSelector(state => state.user.user)
    


    const columns = [
        {
          name: "Control No",
          selector: (row) => row.com_controlNo,
          sortable: true,
          wrap: true,
          cell: (row) => {
            if(_.isEmpty(searchValue)){
              return row.com_controlNo;
            }else{
              return <Highlighter
                highlightClassName="bg-super-light-green"
                searchWords={[searchValue]}
                autoEscape={true}
                textToHighlight={row.com_controlNo}
              />
            }
          }
        },
        { name: "Classification", selector: (row) => row.class_name, sortable: true, cell: (row) => row.class_name + ' ' + row.cat_name },
        { name: "Subject", selector: (row) => row.com_subject, sortable: true, wrap: true},
        { name: "Date Created", selector: (row) => row.com_dateCreated, sortable: true, cell: (row) => moment(row.com_dateCreated).format('dddd, MMMM Do YYYY')},
        { name: "Action", cell: (row) => {
          return (
            <div className="d-flex">
              <Button size="sm" color="success" className="me-1" onClick={()=> {
                toggleEditDraftModal(!isEditDraftModalOpen)
                setDraftData(row)
              }}><BsPencilFill /></Button>
              <Button size="sm" color="danger" onClick={async () => {
                if(window.confirm(`Do you really want to discard this communication?`)){
                  await dispatch(discardDraft(row.com_id))
                  .then(() => dispatch(getDrafts()))
                }
              }}><BsTrashFill /></Button>
            </div>
          )
        }}
    ];

    const data = drafts;

    const filteredData = data.filter((draft) => {
      return draft.com_controlNo.toLowerCase().includes(searchValue.toLocaleLowerCase());
    });
  
    const clearSearch = () => {
      setSearchValue("");
    };

    const onSearchValueChange = (e) => {
      setSearchValue(e.target.value);
    };

    useEffect(() => {
      dispatch(getDrafts(user_id))
    }, [dispatch, user_id])

   

    return (
    <Container className="mt-3">
   
        {
          !_.isEmpty(draftData) &&
          <EditDraftModal isModalOpen={isEditDraftModalOpen} toggleModal={toggleEditDraftModal} draftData={draftData} socket={socket} />
          }

      <Row>
        <h3>Drafts</h3>
        <Col md="12">
          <Row>
            <Col md="6">
              <ContentSearch
                placeholder={"Enter control number..."}
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

export default Drafts;

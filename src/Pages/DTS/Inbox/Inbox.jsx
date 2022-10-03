/*
  View Communication Page
*/
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "reactstrap";
import {  ContentSearch, IconatedButton } from "../../../Layouts/Portal";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { decrementNewInboxCount, getInbox, seenCommunication } from "../../../features/dts/inbox/inboxSlice";
import moment from "moment";
import { Tasks } from "./Inbox.Logic";
import { InboxLegends } from "../../../Layouts/DTS";
import { useNavigate } from "react-router-dom";
import Highlighter from "react-highlight-words";
import { resetTaskCounter } from "../../../features/dts/tasks/tasksSlice";
import { BsArrowClockwise } from "react-icons/bs";
import './Inbox.css'
const _ = require('lodash');


const Inbox = () => {
    const [searchValue, setSearchValue] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { inbox, isLoading } = useSelector(state => state.inbox)

    const refreshInbox = () => {
      dispatch(getInbox())
    }

    const viewTask = (row, e) => {
      dispatch(resetTaskCounter())
      if(_.isNull(row.inbox_date_seen)) {
        e.target.parentElement.parentElement.setAttribute('style', 'font-weight: none;')
        dispatch(decrementNewInboxCount())
        dispatch(seenCommunication(row.inbox_id))
      }
      // navigate(`/dts/managementOfCommunications/inbox/viewCommunication/${row.inbox_id}/${row.com_id}`)
      navigate(`/dts/managementOfCommunications/inbox/viewTask/${row.inbox_id}/${row.com_id}`)
    }

    const InboxExpand = ({props}) => {
      const {
        com_subject,
        com_source_name,
        com_source_position,
        com_source_office,
        com_dateReceived,
        inbox_task,
        com_dateCreated,
        emp_firstname,
        emp_lastname,
        office_code
      } = props.data;

      const tasks = new Tasks(inbox_task).getTasks();
      return (
        <div className="p-3 bg-light text-dark">
          <strong>{com_subject}</strong>
          <span className="d-block">Source:&nbsp;<u><strong>{com_source_name}</strong>{`, ${com_source_position}, ${com_source_office}`}</u></span>
          <span className="d-block">Received:&nbsp;<i>{moment(com_dateReceived).format('MMMM D, YYYY hh:mm  A')}</i> </span>
          <span className="d-block">Created:&nbsp;<i>{moment(com_dateCreated).format('MMMM D, YYYY hh:mm  A')}</i> </span>
          <span className="d-block">Sent By:&nbsp;<i>{`${emp_firstname} ${emp_lastname} - ${office_code}`}</i> </span>
          <span>Tasks: </span>
          {tasks}
          <Button size='sm' color="success" onClick={(e) => viewTask(props.data, e)}>View Task</Button>
        </div>
      )
    }

    useEffect(() => {
      dispatch(getInbox())
    }, [dispatch])

    const columns = [
        {name : 'Control No', selector: (row) => row.com_controlNo, wrap: true, sortable: true,cell: (row) => {
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
        }},
        {name : 'Subject', selector: (row) => row.com_subject},
        // {name : 'Source', cell: (row) => `${row.com_source_name}, ${row.com_source_position}, ${row.com_source_office}`},
        {name : 'From', cell: (row) => `${row.emp_firstname} ${row.emp_lastname} - ${row.office_code}`},
        // {name : 'Date Sent', selector: (row) => row.inbox_date_sent, cell: (row) => moment(row.inbox_date_sent).format('dddd, MMMM Do YYYY hh:mm  A'), sortable: true},
        {name : 'Tasks',  selector: (row) => row.inbox_task, wrap: true, cell: (row) => {
           const tasks = new Tasks(row.inbox_task);
           return tasks.getTasks()
        } },
        {name : 'Action',center: true, cell: (row) => <Button color="success" size="sm" onClick={
          (e) => {
            dispatch(resetTaskCounter())
            if(_.isNull(row.inbox_date_seen)) {
              e.target.parentElement.parentElement.setAttribute('style', 'font-weight: none;')
              dispatch(decrementNewInboxCount())
              dispatch(seenCommunication(row.inbox_id))
            }
            // navigate(`/dts/managementOfCommunications/inbox/viewCommunication/${row.inbox_id}/${row.com_id}`)
            navigate(`/dts/managementOfCommunications/inbox/viewTask/${row.inbox_id}/${row.com_id}`)
          }
        }>View Task</Button>,},
    ];

    const data = inbox;

    const filteredData = data.filter((inb) => {
      return inb.com_controlNo.toLowerCase().includes(searchValue.toLocaleLowerCase());
    });

    const conditionalRowStyles = [
        {
            when: row => row.com_urgency === 'OMG',
            classNames: ['bg-danger', 'text-light']
        },
        {
            when: row => row.com_urgency === 'Rush',
            classNames: ['bg-warning', 'text-dark']
        },
        {
            when: row => row.com_urgency === 'Regular',
            classNames: ['bg-light', 'text-dark']
        },
        {
            when: row => row.inbox_date_seen === null,
            style: {fontWeight: 'bold'}
        }
    ]

    const onSearchValueChange = (e) => {
      setSearchValue(e.target.value);
    };

    const clearSearch = () => {
      setSearchValue("");
    };
  

    return (
    <Container className="mt-3">
      <Row>
        <div className="d-flex align-items-center">
          <h3>Inbox</h3>
          <IconatedButton name='Refresh' className='ms-2' icon={<BsArrowClockwise />} onClick={refreshInbox} />
        </div>
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
            <Col>
              <br />
              <InboxLegends />
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
            conditionalRowStyles={conditionalRowStyles}
            expandableRows
            responsive
            expandableRowsComponent={(props) => <InboxExpand props={props} />}
            expandOnRowClicked
            progressComponent={
              <Spinner />
            }
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Inbox;
 
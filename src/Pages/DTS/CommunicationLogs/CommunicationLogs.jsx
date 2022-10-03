// Communication Logs Page
import React, { useEffect } from "react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import Highlighter from "react-highlight-words";
import { Col, Container, Row, Spinner, Collapse } from "reactstrap";
import { ContentSearch, IconatedButton } from "../../../Layouts/Portal";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getLogs } from "../../../features/dts/logs/logsSlice";
import { subDays } from "date-fns";
import { DateRange } from "react-date-range";
import { BsFillCaretUpFill, BsFillCaretDownFill } from "react-icons/bs";

const _ = require("lodash");

const CommunicationLogs = () => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const { logs, isLoading } = useSelector((state) => state.logs);
  const [isOpen, toggle] = useState(false);
  const [state, setState] = useState([ 
    {
      startDate: subDays(new Date(), 1),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const onSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  const highlightMatchWords = (rowToMatch) => {
    if (_.isEmpty(searchValue)) {
      return rowToMatch;
    } else {
      return (
        <Highlighter
          highlightClassName="bg-warning"
          searchWords={[searchValue]}
          autoEscape={true}
          textToHighlight={rowToMatch}
        />
      );
    }
  };

  const columns = [
    {
      name: "CONTROL NO",
      selector: (row) => row.com_controlNo,
      wrap: true,
      sortable: true,
      cell: (row) => {
        return highlightMatchWords(row.com_controlNo);
      },
    },
    {
      name: "CLASSIFICATION",
      selector: (row) => row.class_name + " " + row.cat_name,
      wrap: true,
      cell: (row) => highlightMatchWords(row.class_name + " " + row.cat_name),
    },
    {
      name: "SUBJECT",
      selector: (row) => row.com_subject,
      wrap: true,
      cell: (row) => highlightMatchWords(row.com_subject),
    },
    {
      name: "SOURCE",
      cell: (row) =>
        highlightMatchWords(
          `${row.com_source_name}, ${row.com_source_position}, ${row.com_source_office}`
        ),
    },

    {
      name: "ACTION",
      selector: (row) => row.trail_description,
      cell: (row) => highlightMatchWords(row.trail_description),
    },
    {
      name: "BY",
      selector: (row) => row.trail_description,
      cell: (row) =>
        highlightMatchWords(
          `${row.emp_firstname} ${row.emp_middlename[0]} ${row.emp_lastname} - ${row.office_code}`
        ),
    },
    {
      name: "DATE",
      selector: (row) => moment(row.trail_date).format("DD-MM-YYYY hh:mmA"),
      cell: (row) =>
        highlightMatchWords(moment(row.trail_date).format("DD-MM-YYYY hh:mmA")),
      sortable: true,
    },
  ];

  const filteredData = logs.filter((com) => {
    const start = moment(state[0].startDate).format("MM-DD-YYYY");
    const end = moment(state[0].endDate).format("MM-DD-YYYY");

    const searchResult =
      com.com_controlNo
        .toLowerCase()
        .includes(searchValue.toLocaleLowerCase()) ||
      com.com_subject.toLowerCase().includes(searchValue.toLocaleLowerCase()) ||
      `${com.class_name} ${com.cat_name}`
        .toLowerCase()
        .includes(searchValue.toLocaleLowerCase()) ||
      `${com.com_source_name}, ${com.com_source_position}, ${com.com_source_office}`
        .toLowerCase()
        .includes(searchValue.toLocaleLowerCase()) ||
      `${com.emp_firstname} ${com.emp_middlename[0]} ${com.emp_lastname} - ${com.office_code}`
        .toLowerCase()
        .includes(searchValue.toLocaleLowerCase()) ||
      moment(com.trail_date)
        .format("DD-MM-YYYY hh:mmA")
        .toLowerCase()
        .includes(searchValue.toLocaleLowerCase());

    const dateRange =
      moment(start).isSameOrBefore(
        moment(com.trail_date).format("MM-DD-YYYY")
      ) &&
      moment(end).isSameOrAfter(moment(com.trail_date).format("MM-DD-YYYY"));

    return searchResult && dateRange;
  });

  useEffect(() => {
    dispatch(getLogs());
  }, [dispatch]);

  return (
    <Container className="mt-3">
      <Row>
        <Col md="12">
          <Row>
            <h3>Communication Logs</h3>
            <Col md="6">
              <ContentSearch
                placeholder={"Search"}
                className="mb-3"
                onSearchValueChange={onSearchValueChange}
                searchValue={searchValue}
                clearSearch={() => setSearchValue("")}
              />
              <IconatedButton
                className="mt-2"
                name="Communication Log Date Range"
                icon={isOpen ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
                onClick={() => toggle(!isOpen)}
              />
              <Collapse isOpen={isOpen}>
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setState([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={state} 
                />
              </Collapse>
            </Col>
            <i> 
              Showing results from{" "}
              {moment(state[0].startDate).format("DD-MM-YYYY")} to{" "}
              {moment(state[0].endDate).format("DD-MM-YYYY")}
            </i>
          </Row>
        </Col>
        <Col>
          <DataTableExtensions
            columns={columns}
            data={filteredData}
            exportHeaders={true}
            filter={false}
          >
            <DataTable
              columns={columns}
              data={filteredData}
              highlightOnHover
              pagination
              pointerOnHover
              progressPending={isLoading}
              progressComponent={<Spinner />}
              persistTableHead
            />
          </DataTableExtensions>
        </Col>
      </Row>
    </Container>
  );
};

export default CommunicationLogs;

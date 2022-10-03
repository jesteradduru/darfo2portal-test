// Basic and Advanced Search Page
import React, { useEffect } from "react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import Highlighter from "react-highlight-words";
import { useParams } from "react-router-dom";
import { Col, Container, Row, Spinner } from "reactstrap";
import { ContentSearch } from "../../../Layouts/Portal";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getCommunications } from "../../../features/dts/communications/communications";
import { AdvanceSearchBar, ViewTrailModal } from "../../../Layouts/DTS";
import { getTrail } from "../../../features/dts/trail/trailSlice";
import "react-data-table-component-extensions/dist/index.css";

const _ = require("lodash");

const Search = () => {
  const { search_type } = useParams();
  const [searchValue, setSearchValue] = useState("");
  const [isViewTrailOpen, toggleViewTrail] = useState(false);
  const dispatch = useDispatch();
  const { communications, isLoading } = useSelector(
    (state) => state.communication
  );
  const [advanceSearchResult, setAdvanceSearchResult] = useState([])

  
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
      name: "Control No",
      selector: (row) => row.com_controlNo,
      wrap: true,
      cell: (row) => {
        return highlightMatchWords(row.com_controlNo);
      },
    },
    {
      name: "Classification",
      selector: (row) => `${row.cat_name} ${row.class_name}`,
      wrap: true,
      cell: (row) => highlightMatchWords(`${row.cat_name} ${row.class_name}`),
    },
    {
      name: "Subject",
      selector: (row) => row.com_subject,
      wrap: true,
      cell: (row) => highlightMatchWords(row.com_subject),
    },
    {
      name: "Source",
      cell: (row) =>
        highlightMatchWords(
          `${row.com_source_name}, ${row.com_source_position}, ${row.com_source_office}`
        ),
    },

    {
      name: "Date Received",
      selector: (row) => row.com_dateReceived,
      cell: (row) =>
        highlightMatchWords(
          moment(row.com_dateReceived).format("dddd, MMMM Do YYYY")
        ),
      sortable: true,
    },
  ];

  useEffect(() => {
    setAdvanceSearchResult(communications)
  }, [communications])

  const filteredData = communications.filter((com) => {
    return (
      com.com_controlNo
        .toLowerCase()
        .includes(searchValue.toLocaleLowerCase()) ||
      com.com_subject.toLowerCase().includes(searchValue.toLocaleLowerCase()) ||
      `${com.com_source_name}, ${com.com_source_position}, ${com.com_source_office}`
        .toLowerCase()
        .includes(searchValue.toLocaleLowerCase()) ||
      `${com.emp_firstname} ${com.emp_lastname} - ${com.office_code}`
        .toLowerCase()
        .includes(searchValue.toLocaleLowerCase()) ||
      `${com.cat_name} ${com.class_name}`
        .toLowerCase()
        .includes(searchValue.toLocaleLowerCase()) ||
      moment(com.com_dateReceived)
        .format("dddd, MMMM Do YYYY")
        .toLowerCase()
        .includes(searchValue.toLocaleLowerCase())
    );
  });

  const viewTrail = async (com_id) => {
    dispatch(getTrail(com_id));
    toggleViewTrail(!isViewTrailOpen);
  };

  useEffect(() => {
    dispatch(getCommunications());
  }, [dispatch]);

  // useEffect(() => {
  //   console.log(advanceSearchResult)
  // }, [advanceSearchResult])
  return (
    <Container className="mt-3">
      <ViewTrailModal
        isModalOpen={isViewTrailOpen}
        toggleModal={toggleViewTrail}
      />
      <Row>
        <h3>{search_type === "basic" ? "Basic Search" : "Advanced Search"}</h3>
        <Col md="12">
          <Row>
            {search_type === "basic" ? (
              <Col md="6">
                <ContentSearch
                  placeholder={"Search"}
                  className="mb-3"
                  onSearchValueChange={onSearchValueChange}
                  searchValue={searchValue}
                  clearSearch={() => setSearchValue("")}
                />
              </Col>
            ) : (
              <Col>
                <AdvanceSearchBar onFilterCom={setAdvanceSearchResult} communications={communications} />
              </Col>
            )}
          </Row>
        </Col>
        <Col>
          <div className="mt-2"></div>
          {/* <DataTableExtensions columns={columns} data={search_type === 'advanced' ? advanceSearchResult : filteredData} filter={false} exportHeaders={true}> */}
          <DataTable
            columns={columns}
            data={search_type === 'advanced' ? advanceSearchResult : filteredData}
            highlightOnHover
            pagination
            onRowClicked={(row) => viewTrail(row.com_id)}
            pointerOnHover
            progressPending={isLoading}
            progressComponent={<Spinner />}
            persistTableHead
          />
          {/* </DataTableExtensions> */}
        </Col>
      </Row>
    </Container>
  );
};

export default Search;

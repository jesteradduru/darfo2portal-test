// Advance search bar component
import React, { useState } from "react";
import {
  BsFillCaretDownFill,
  BsFillCaretUpFill,
  BsPlusLg,
  BsSearch,
  BsTrashFill,
} from "react-icons/bs";
import {
  Button,
  Card,
  CardBody,
  Collapse,
  FormGroup,
  Input,
  Label,
  Form,
} from "reactstrap";
import { IconatedButton } from "../../Portal";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays, subDays } from "date-fns";
import { DateRange } from "react-date-range";
import moment from "moment";
import _ from "lodash"; 

const AdvanceSearchBar = ({onFilterCom, communications}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState([
    {
      startDate: subDays( new Date(), 7),
      endDate:new Date(),
      key: "selection",
    },
  ]);
  const [filters, setFilter] = useState([]);
  const [filterText, setFilterText] = useState('None');

  const toggle = () => setIsOpen(!isOpen);
  const addFilter = () => {
    setFilter([...filters, filters.length + 1]);
  };
  const deleteFilter = (e) => {
    const id = e.target.getAttribute("data-id");
    document.getElementById(id).remove();
  };
  const filtersMap = filters.map((index) => {
    return (
      <Form className="d-flex mb-2 filters" id={"filterForm" + index} onSubmit={e => e.preventDefault()} key={index}>
        <Input type="select" className="me-2" name="column">
          <option value="control_no">Control Number</option>
          <option value="subject">Subject</option>
          <option value="source">Source</option>
          <option value="classification">Classification</option>
        </Input>
        <Input type="select" className="me-2" name="operator">
          <option value="contains">contains</option>
          <option value="is">is</option>
        </Input>
        <Input type="text" className="me-2" name="search_value" />
        <Button
          color="danger"
          size="sm"
          data-id={"filterForm" + index}
          onClick={deleteFilter}
        >
          <BsTrashFill style={{ pointerEvents: "none" }} />
        </Button>
      </Form>
    );
  });

  const onFilter = () => {
    const filterArray = [];
    const { startDate, endDate } = state[0];
    const filters = document.querySelectorAll(".filters");
    filters.forEach((filter) => {
      const formData = new FormData(filter);

      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      filterArray.push(formObject);
    });

    const start = moment(startDate).format("MM-DD-YYYY");
    const end = moment(endDate).format("MM-DD-YYYY");

    const filterComms = communications.filter((com) => {
      const com_data = {
        control_no: com.com_controlNo,
        subject: com.com_subject,
        source: `${com.com_source_name}, ${com.com_source_position}, ${com.com_source_office}`,
        encoded_by: `${com.emp_firstname} ${com.emp_lastname} - ${com.office_code}`,
        classification: `${com.cat_name} ${com.class_name}`,
        date_received: moment(com.com_dateReceived).format("MM-DD-YYYY"),
      };

      const isTrue = filterArray.map((filter_array) => {
        if (filter_array.operator === "is") {
          return com_data[filter_array.column] === filter_array.search_value;
        } else {
          return com_data[filter_array.column]
            .toLowerCase()
            .includes(filter_array.search_value.toLowerCase());
        }
      });

      return (
        !isTrue.includes(false) &&
        moment(start).isSameOrBefore(com_data.date_received) &&
        moment(end).isSameOrAfter(com_data.date_received)
      );
    });

    setFilterText(() => {
      const filters = filterArray.map(f_item => {
        let key = ''
        switch(f_item.column){
          case 'control_no':
            key='Control Number'
            break;
          case 'subject':
            key='Subject'
            break;
          case 'source':
            key='Source'
            break;
          case 'encoded_by':
            key='Encoded By'
            break;
          case 'date_received':
            key='Date Received'
            break;
          case 'classification':
            key='Classification'
            break;
          default:
            break;
        }
        return `"${key}" ${f_item.operator} "${f_item.search_value}"`;
      })
      return filters.join(', ') + ` from ${start} to ${end}`;
    });
    onFilterCom(filterComms);
    toggle();
  };


  return (
    <div>
      <IconatedButton
        name="Advanced Search"
        icon={isOpen ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
        onClick={toggle}
      />
      <Collapse isOpen={isOpen} >
        <div className="d-flex justify-content-center"><Card className="shadow">
          <CardBody>
            <div className="d-lg-flex justify-content-center align-items-center">
              <div className="me-md-5">
                <FormGroup>
                  <Label for="filter">
                    Filters &nbsp;
                    <IconatedButton
                      name="Add Filter"
                      color="secondary"
                      icon={<BsPlusLg />}
                      className="mb-2"
                      onClick={addFilter}
                    />
                  </Label>
                  {filtersMap}
                </FormGroup>
              </div>
              <FormGroup>
                <Label for="daterange">Date Range:</Label>
                <br />
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setState([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={state}
                />
              </FormGroup>
            </div>
            <IconatedButton
              name="Apply Search"
              icon={<BsSearch />}
              className="d-block mx-auto"
              onClick={onFilter}
              size="md"
              color="success"
            />
          </CardBody>
        </Card>
        </div>
      </Collapse>
      <br />
      <i className="text-dark">Filters: <span className="text-success">{filterText}</span></i>
    </div>
  );
};

export default AdvanceSearchBar;

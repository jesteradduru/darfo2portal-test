import React from "react";
import { Input, FormGroup, Label, Card, CardBody, Row, Col, Button } from "reactstrap";
import { DateRange } from "react-date-range";
import { useSelector } from "react-redux";

const ReportFilter = ({
  setTitle,
  setCalendarState,
  calendarState,
  reportFields,
  setFields,
  setClassCode,
  loadReport
}) => {
  const { classifications } = useSelector((state) => state.classifications);
  const classificationList = classifications.map((item, index) => {
    return (
      <option
        value={item.class_code}
        key={index}
      >
        {item.class_name} - {item.cat_name}
      </option>
    );
  });

  const onFilterByClass = (e) => {
    setClassCode(e.target.value)
  }
  const onCheckField = (e) => {
    const checkBox = e.target;
    if(checkBox.value === 'select_all' && checkBox.checked === true){
      return setFields([
        'control_no', 'classification', 'source', 'subject', 'referred_to', 'date_received', 'action_desired', 'action_taken', 'status'
      ]);
    }else if(checkBox.value === 'select_all'){
      return setFields([]);
    }

    if (checkBox.checked === true) {
      setFields([...reportFields, e.target.value]);
    } else {
      const updateFields = reportFields.filter((field) => {
        return field !== e.target.value;
      });
      setFields(updateFields);
    }
  };
  return (
    <>
      <Label for="report_title">Report Type</Label>
      <div>
        <FormGroup check inline>
          <Input type="radio" id='monitoring' name='report_type' onChange={(e) => setTitle(e.target.value)} defaultChecked />
          <Label for="monitoring">Monitoring</Label>
        </FormGroup>
        {/* <FormGroup check inline>
          <Input type="radio" id='logs' name='report_type'  onChange={(e) => setTitle(e.target.value)} />
          <Label for="logs">Communication Logs</Label>
        </FormGroup> */}
      </div>
      <Card>
        <CardBody>
          <FormGroup>
            <Label>Filter by classification:</Label>
            <Input type='select' onChange={onFilterByClass}>
              <option value="">None</option>
              {classificationList}
            </Input>
          </FormGroup>
          <Label>Fields: <span className="text-danger">*</span></Label>
          <Row>
            <Col>
              <FormGroup check>
                <Input
                  type="checkbox"
                  value="select_all"
                  onChange={onCheckField}
                />
                <Label check>Select All</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  value="control_no"
                  onChange={onCheckField}
                  checked={reportFields.includes("control_no")}
                />
                <Label check>Control No</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  value="classification"
                  onChange={onCheckField}
                  checked={reportFields.includes("classification")}
                />
                <Label check>Classification</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  value="source"
                  onChange={onCheckField}
                  checked={reportFields.includes("source")}
                />
                <Label check>Source</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  value="subject"
                  onChange={onCheckField}
                  checked={reportFields.includes("subject")}
                />
                <Label check>Subject</Label>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup check>
                <Input
                  type="checkbox"
                  value="referred_to"
                  onChange={onCheckField}
                  checked={reportFields.includes("referred_to")}
                />
                <Label check>Referred To</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  value="date_received"
                  onChange={onCheckField}
                  checked={reportFields.includes("date_received")}
                />
                <Label check>Date Received</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  value="action_desired"
                  onChange={onCheckField}
                  checked={reportFields.includes("action_desired")}
                />
                <Label check>Action Desired</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  value="action_taken"
                  onChange={onCheckField}
                  checked={reportFields.includes("action_taken")}
                />
                <Label check>Action Taken</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  value="status"
                  onChange={onCheckField}
                  checked={reportFields.includes("status")}
                />
                <Label check>Status</Label>
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <FormGroup className="d-flex flex-column">
        <Label for="report_date_range">Date Range</Label>
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setCalendarState([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={calendarState}
        />
      </FormGroup>
      <Button color="success" className="mx-auto d-block" onClick={loadReport}>Generate Report</Button>
    </>
  );
};

export default ReportFilter;

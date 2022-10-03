// Reports Page`
import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Container, Row, Spinner } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getReport } from "../../../features/dts/reports/reportSlice";
import moment from "moment";
import ReportFilter from "./ReportFilter";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getClassifications } from "../../../features/dts/classifications/classifications";
import { useParams } from "react-router-dom";
const _ = require('lodash')

const Reports = () => {
  const dispatch = useDispatch();
  const {com_ids} = useParams();
  const { reports, isLoading } = useSelector((state) => state.reports);
  const [classCode, setClassCode] = useState("");
  const [reportData, setReportData] = useState([])
  const [reportFields, setFields] = useState([]);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const columns = [
    {
      name: "CONTROL NO",
      selector: "com_controlNo",
      sortable: true,
      key: 'control_no',
      omit: !reportFields.includes("control_no"),
      wrap: true
    },
    {
      name: "CLASSIFICATION",
      cell: (row) => `${row.class_name} ${row.cat_name}`,
      omit: !reportFields.includes("classification"),
      key: 'classification',
    },
    {
      name: "SOURCE (NAME, POSITION, OFFICE)",
      cell: (row) =>
        `${row.com_source_name}, ${row.com_source_position}, ${row.com_source_office}`,
      omit: !reportFields.includes("source"),
      key: 'source'
    },
    {
      name: "SUBJECT",
      selector: "com_subject",
      omit: !reportFields.includes("subject"),
      key: 'subject',
      wrap: true
    },
    {
      name: "REFFERED TO",
      omit: !reportFields.includes('referred_to'),
      cell: (row) => {
        let persons = [];

        const person = row.referred_to.map((to) => {
          if(!persons.includes(to.fullname) && to.role_name.includes('Approver') && to.routing_legend.includes('for_action')){
            persons.push(to.fullname);
            return <li>{to.fullname}</li>;
          }else{
            return <></>
          }
        });

        return <ul style={{ padding: "0" }}>{person}</ul>;
      },
      key: 'referred_to'
    },
    {
      name: "DATE RECEIVED (DD-MM-YYYY)",
      selector: "com_dateReceived",
      cell: (row) => moment(row.com_dateReceived).format("DD-MM-YYYY"),
      sortable: true,
      omit: !reportFields.includes('date_received'),
      key: 'date_received'
    },
    {
      name: "STATUS",
      cell: (row) => {
        const actionTakenForApproval =  row.action_taken.filter(act => {
          return act.act_status === 'for_review';
        })
        const actionTakenApproved =  row.action_taken.filter(act => {
          return act.act_status === 'approved';
        })
        if(!_.isEmpty(actionTakenForApproval)){
          return 'Action for approval'
        }else if(!_.isEmpty(actionTakenApproved)){
          return 'Complied'
        }else{
          return 'Pending Action';
        }
      },
      sortable: true,
      omit: !reportFields.includes('status'),
      key: 'status'
    },
    {
      name: "ACTION DESIRED",
      omit: !reportFields.includes('action_desired'),
      cell: (row) => {
        
        if(_.isEmpty(row.action_desired)){
          return ''
        }
        const actDesired1 = row.action_desired.filter(act => act.routing_legend.includes('for_action')).map(act => {
          const actDesired = ["FYAA"];
          if (act.routing_legend.includes("rush")) {
            actDesired.push("Rush");
          } else if (act.routing_legend.includes("urgent")) {
            actDesired.push("Urgent");
          }
          return <li>{actDesired.join('/') + `/${act.routing_remarks}`}</li>
        })
        
        return (
          <ul>{actDesired1}</ul>
        );
      },
      key: 'action_desired'
    },
    {
      name: "ACTION TAKEN",
      omit: !reportFields.includes('action_taken'),
      cell: (row) => {
        const action_taken = row.action_taken.map((act) => {
          return <li>{act.act_taken}</li>;
        });

        return <ul style={{ padding: "0" }}>{action_taken}</ul>;
      },
      key: 'action_taken'
    },
  ];
  

  const columnsForExport = columns.filter(col => {
    return reportFields.includes(col.key)
  })

  const loadReport = async () => {
    if(!_.isEmpty(reportFields)){
      await dispatch(getReport())
      const filteredData = reports.filter((rep) => {
        const start = moment(state[0].startDate).format("MM-DD-YYYY");
        const end = moment(state[0].endDate).format("MM-DD-YYYY");
        return (
          moment(start).isSameOrBefore(rep.com_dateReceived) &&
          moment(end).isSameOrAfter(rep.com_dateReceived) && 
          rep.com_controlNo.includes(classCode)
        );
      });
      setReportData(filteredData);
    }else{
      setReportData([]);
    }
  }

  useEffect(() => {
    if(!_.isUndefined(com_ids)){
      const filteredData = reports.filter((rep) => {
        return com_ids.includes(rep.com_id) || (com_ids === 'all' && _.isEmpty(rep.action_taken))
      });
      setFields([
        'control_no', 'classification', 'source', 'subject', 'referred_to', 'date_received', 'action_desired', 'action_taken', 'status'
      ])
      setReportData(filteredData);
    }
  }, [])

  useEffect(() => {
    dispatch(getClassifications())
  }, [])

  return (
    <Container fluid className="mt-3">
      <h3>Reports</h3>
      <Row>
        <Col md="3">
          <ReportFilter
            calendarState={state}
            setCalendarState={setState}
            reportFields={reportFields}
            setFields={setFields}
            setClassCode={setClassCode}
            loadReport={loadReport}
          />
        </Col>
        <Col md="9">
          <div className="p-2 shadow">
            <DataTableExtensions
              data={reportData}
              filter={false}
              columns={columnsForExport}
              exportHeaders={true}
              fileName={`dts_report_${moment().format()}`}
            >
              <DataTable
                data={reportData}
                columns={columns}
                pagination
                progressPending={isLoading}
                progressComponent={<Spinner />}
                persistTableHead
              />
            </DataTableExtensions>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;

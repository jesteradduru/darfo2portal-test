// Analytics Page
import React, { useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { getAnalytics, getReport } from "../../../features/dts/reports/reportSlice";
import { ContentLoader, IconatedButton } from "../../../Layouts/Portal";
import AnalyticsCharts from "./AnalyticsCharts";
import AnalyticsTablePerDiv from "./AnalyticsTablePerDiv";
import { useState } from "react";
import { BsDownload, BsPrinter } from "react-icons/bs";
import moment from "moment";
import * as htmlToImage from 'html-to-image';
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const _ = require("lodash");
 
const Analytics = () => {
  const { analytics, errorMessage, isLoading, reports } = useSelector(
    (state) => state.reports
  );
  const analyticsRef = useRef();
  const [analyticsData, setAnalytics] = useState([
    {
      data: [
        ["Category", "Count"],
        ["Pending Communication", reports.filter((rep) => {
          return _.isEmpty(rep.action_taken);
        }).length],
        ["Completed Communication", reports.filter((rep) => {
          return !_.isEmpty(rep.action_taken);
        }).length],
      ],
      active: true,
      office_code: 'DA RFO2',
      com_ids: 'all'
    },
  ]);

  const dispatch = useDispatch();

  const saveCanvas = () => {  
    htmlToImage.toPng(document.getElementById('export_chart'))
    .then(function (dataUrl) {
        const link = document.createElement('a')
        link.download = 'analytics_chart_' + moment().format()
        link.href = dataUrl
        link.click()
    });
  }

  const handlePrintAnalytics = useReactToPrint({
    content: () => document.getElementById('export_chart'),
    pageStyle: 'print',
    documentTitle: 'Analytics Chart'
  })

  useEffect(() => {
    dispatch(getReport());
    dispatch(getAnalytics());
  }, [dispatch]);

  
  return (
    <ContentLoader isLoading={isLoading} errorMessage={errorMessage}>
      <Container>
        <br />
        <div className="d-flex">
          <h3>Analytics</h3>
          <div className="d-flex align-items-center ms-auto">
            <IconatedButton name='Print Chart' color='success' outline icon={<BsPrinter />} className='me-2' onClick={handlePrintAnalytics} />
            <IconatedButton name='Export Chart' outline icon={<BsDownload />} onClick={saveCanvas} />
          </div>
        </div>
        <br />
        <Row>
          <Col md="4">
            <AnalyticsTablePerDiv setAnalytics={setAnalytics} analytics={analytics} analyticsData={analyticsData} reports={reports} />
          </Col>
          <Col md="8">
            <AnalyticsCharts
              analytics={analyticsData}
              analyticsRef={analyticsRef}
            />
          </Col>
        </Row>
      </Container>
    </ContentLoader>
  );
};

export default Analytics;

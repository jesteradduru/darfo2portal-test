import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Card, CardBody, Container, Spinner } from "reactstrap";
import styled from "styled-components";
import {
  BsFillEnvelopeFill,
  BsFillClockFill,
  BsFillCheckCircleFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { checkPermission } from "../../../Helpers/portal_helpers";
import { useSelector } from "react-redux";

const StyledCard = styled(Card)`
  width: 300px !important;
  .card-body {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const AnalyticsCharts = ({ analytics, analyticsRef }) => {
  const [chartData, setChartData] = useState([]);
  const { userPermissions } = useSelector((state) => state.roles);
  const { role_name } = useSelector((state) => state.user.user);
  useEffect(() => {
    const newData = analytics.filter((data) => data.active);
    setChartData(newData);
  }, [analytics]);

  const options = {
    title:
      chartData.length !== 0 && chartData[0].office_code + ": Pending Vs Completed",
    is3D: true,
    slices: [{ color: "#FFC107" }, { color: "#28A745" }],
  };
  // console.log(chartData)
  return (
    <>
      <Container fluid id="export_chart" ref={analyticsRef} style={{ background: "#FFF" }}>
        <Container className="d-flex">
          <StyledCard color="light">
            <CardBody>
              <div
                className="me-4 img-fluid rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: "50px",
                  height: "50px",
                  fontSize: "24px",
                  background: "#e8e8f7",
                }}
              >
                <BsFillEnvelopeFill className="text-primary" />
              </div>
              <div>
                <h3>{chartData.length !== 0 && chartData[0].total}</h3>
                <span>TOTAL</span>
              </div>
            </CardBody>
          </StyledCard>
          <StyledCard
            color="light"
            className="ms-3"
          >
            <CardBody>
              <div
                className="me-4 img-fluid rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: "50px",
                  height: "50px",
                  fontSize: "24px",
                  background: "#efe7be",
                }}
              >
                <BsFillClockFill style={{ color: "#df7905" }} />
              </div>
              <div>
                <h3>{chartData.length !== 0 && chartData[0].data[1][1]}</h3>
                {(chartData.length !== 0 && chartData[0].data[1][1] === 0) || !checkPermission(userPermissions, 'exportReport') || !role_name.includes('Process') ? (
                  "PENDING"
                ) : (
                  <Link
                    to={`/dts/managementOfCommunications/reports/${
                      chartData.length !== 0 && chartData[0].com_ids
                    }`}
                  >
                    PENDING
                  </Link>
                )}
              </div>
            </CardBody>
          </StyledCard>
          <StyledCard color="light" className="ms-3">
            <CardBody>
              <div
                className="me-4 img-fluid rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: "50px",
                  height: "50px",
                  fontSize: "24px",
                  background: "#c6e8d0",
                }}
              >
                <BsFillCheckCircleFill className="text-success" />
              </div>
              <div>
                <h3>{chartData.length !== 0 && chartData[0].data[2][1]}</h3>
                <span>COMPLETED</span>
              </div>
            </CardBody>
          </StyledCard>
        </Container>
        <Container>
          <Chart
            chartType="PieChart"
            data={chartData.length !== 0 && chartData[0].data}
            options={options}
            width={"100%"}
            height={"400px"}
            loader={
              <div className="d-flex justify-content-center mt-5">
                <Spinner />
                <span className="ms-2">Loading Chart...</span>
              </div>
            }
          />
        </Container>
      </Container>
    </>
  );
};

export default AnalyticsCharts;

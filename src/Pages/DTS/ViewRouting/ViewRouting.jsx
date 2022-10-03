// View ROuting Page
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRouting } from "../../../features/dts/routing/routingSlice";
import { useParams } from "react-router-dom";
import RoutingSlip from "../RoutingSlip/RoutingSlip";
import { ContentLoader } from "../../../Layouts/Portal";
import { BackButton, NextTaskButton } from "../../../Layouts/DTS";
import { Container } from "reactstrap";
import { Tab, Tabs } from "react-bootstrap";

const ViewRouting = () => {
  const { viewRoutingData, isLoading, errorMessage } = useSelector((state) => state.routing);
  const { com_id, inbox_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRouting({ com_id, inbox_id }));
  }, []);

  const routingSlips = viewRoutingData?.map((data) => {
    return (
      <Tab eventKey={data.value} title={data.label}>
        <div>
          <RoutingSlip data={data} viewOnly />
        </div>
      </Tab>
    );
  });

  return (
    <Container className="mt-3">
      <ContentLoader isLoading={isLoading} errorMessage={errorMessage}>
        <h4>View Routing</h4>
        <hr />
        <Tabs>{routingSlips}</Tabs>
        <div className="d-flex justify-content-between">
          <BackButton />
          <NextTaskButton />
        </div>
      </ContentLoader>
    </Container>
  );
};

export default ViewRouting;

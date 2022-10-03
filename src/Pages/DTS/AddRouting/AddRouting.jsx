// Add Routing Page
import React, { useEffect } from "react";
import { ContentLoader, IconatedButton } from "../../../Layouts/Portal";
import { useNavigate, useParams } from "react-router-dom";
import { BsChevronRight } from "react-icons/bs";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import RoutingSlip from "../RoutingSlip/RoutingSlip";
import { AddRecipientButton, PreviewRouting, RoutingTab } from "../../../Layouts/DTS";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import {
  addInitialRouting,
  getRoutingSlips,
  routeCommunication,
} from "../../../features/dts/routing/routingSlice";
import { taskComplete } from "../../../features/dts/tasks/tasksSlice";
import BackButton from "../../../Layouts/DTS/BackButton/BackButton";
import { Container, Spinner } from "reactstrap";
import { useState } from "react";
const _ = require("lodash");

const AddRouting = ({ initial }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { com_id, inbox_id } = useParams();
  const { routingRecipients, addRoutingLoading, errorMessage , isLoading} = useSelector((state) => state.routing);
  const { viewCommunicationData } = useSelector((state) => state.tasks);
  const [previewRouting, setPreview] = useState(false);
  const [routingData, setRoutingData] = useState([]);

  const togglePreview = () => {
    setPreview(!previewRouting)
  }

  const onPreviewRouting = async () => {
    const routing_slip_array = [];
    routingRecipients.forEach((routing) => {
      const form = document.getElementById(`routing_${routing.value}`);
      const formData = new FormData(form);
      const routing_legends = Array.from(
        form.querySelectorAll('input[type="checkbox"]:checked')
      ).map((data) => data.value);
      const formDataObject = {};
      formData.forEach(function (value, key) {
        formDataObject[key] = value;
      });
      formDataObject.routing_legend = routing_legends;

      formDataObject.routing_recipients = [routing];
      formDataObject.com_id = com_id;

      if (routing.type === "group") {
        formDataObject.routing_recipients = routing.recipients;
      }

      routing_slip_array.push(formDataObject);
    });

    if(_.isEmpty(routing_slip_array)){
      return alert('Please add recipients')
    }
      // console.log(routing_slip_array);
      setRoutingData(routing_slip_array);
      togglePreview();
  };

  const onAddRouting = async () => {
    if (initial) {
      // console.log("initial routing sent");
      const response = await dispatch(addInitialRouting(routingData));
      if (response.payload.routingData.com_id) {
        await dispatch(taskComplete(inbox_id));
        navigate("/dts/managementOfCommunications/inbox");
      }
    } else {
      const response = await dispatch(
        routeCommunication(routingData)
      );
      if (response.payload.com_id) {
        await dispatch(taskComplete(inbox_id));
        navigate("/dts/managementOfCommunications/inbox");
      }
    }
  }


  useEffect(() => {
    if (!initial) {
      dispatch(getRoutingSlips({ com_id, status: "for_routing" }));
    }
  }, [dispatch]);

  const routingSlips = routingRecipients.map((recipient) => {
    return (
      <Tab
        eventKey={recipient.value}
        title={
          <RoutingTab label={recipient.label} username={recipient.value} />
        }
      >
        <RoutingSlip data={recipient} />
      </Tab>
    );
  });

  return (
    <ContentLoader isLoading={isLoading} errorMessage={errorMessage} className="m-3">
      <PreviewRouting previewRouting={previewRouting} togglePreview={togglePreview} routingData={routingData} onProceed={onAddRouting} />
      <Container>
      <div className="d-block d-md-flex mt-3">
        <h4 className="me-3">
          {viewCommunicationData.com_urgency === "Rush" || !initial
            ? "Route Communication"
            : "Add Initial Routing"}
        </h4>
        <AddRecipientButton />
      </div>
      <hr />
      <Tabs>{routingSlips}</Tabs>

      {_.isEmpty(routingRecipients) && (
        <p className="text-center lead p-3 bg-super-light-green text-secondary mt-3">
          Add Recipient/s
        </p>
      )}

      <div className="d-flex justify-content-between">
        <BackButton />
        <IconatedButton
          size="md"
          color="primary"
          name={addRoutingLoading ? <Spinner color="light" /> : "Submit"}
          onClick={onPreviewRouting}
          icon={<BsChevronRight />}
        />
      </div>
      </Container>
    </ContentLoader>
  );
};

export default AddRouting;

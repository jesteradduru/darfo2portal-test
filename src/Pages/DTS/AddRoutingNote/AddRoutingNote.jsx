// Add Routing Note Page
import React, { useEffect } from "react";
import { IconatedButton } from "../../../Layouts/Portal";
import { useNavigate, useParams } from "react-router-dom";
import {  BsChevronRight } from "react-icons/bs";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import RoutingSlip from "../RoutingSlip/RoutingSlip";
import { AddRecipientButton, BackButton, PreviewRouting, RoutingTab } from "../../../Layouts/DTS";
import { useDispatch, useSelector } from "react-redux";
import '../AddRouting/style.css'
import { addForRouting, getRoutingSlips } from "../../../features/dts/routing/routingSlice";
import { taskComplete } from "../../../features/dts/tasks/tasksSlice";
import { useState } from "react";
const _ = require("lodash");

const AddRoutingNote = ({socket}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {com_id, inbox_id} = useParams()
  const { routingRecipients } = useSelector((state) => state.routing);
  const { viewCommunicationData } = useSelector((state) => state.tasks);
  const [previewRouting, setPreview] = useState(false);
  const [routingData, setRoutingData] = useState([]);

  const togglePreview = () => {
    setPreview(!previewRouting)
  }

  const onPreview = async () => {

    const routing_slip_array = []
    routingRecipients.forEach(routing => {

      const form = document.getElementById(`routing_${routing.value}`)
      const formData = new FormData(form);
      const routing_legends = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(data => data.value)
      const formDataObject = {};
      formData.forEach(function (value, key) {
        formDataObject[key] = value;
      });
      formDataObject.routing_legend = routing_legends;

      formDataObject.routing_recipients = [routing];
      formDataObject.com_id = com_id;

      if(routing.type === 'group'){
        formDataObject.routing_recipients = routing.recipients;
      }

      routing_slip_array.push(formDataObject);
    })

    // console.log(routing_slip_array);
    setRoutingData(routing_slip_array);
    togglePreview();

    // console.log(JSON.stringify(routing_slip_array))

    // const routingData = await dispatch(addForRouting(routing_slip_array))

    // if(routingData.payload.routingData.com_id){
    //   await dispatch(taskComplete(inbox_id))
    //   navigate('/dts/managementOfCommunications/inbox')
    // }
  } 

  const onAddRouting = async () => {
    const res = await dispatch(addForRouting(routingData))

    if(res.payload.routingData.com_id){
      await dispatch(taskComplete(inbox_id))
      navigate('/dts/managementOfCommunications/inbox')
    }
  }


  useEffect(() => {
    if(_.isEmpty(routingRecipients)){
      dispatch(getRoutingSlips({com_id, status: 'initial'}))
    }
  }, [dispatch, com_id]);

  const routingSlips = routingRecipients.map((recipient) => {
    return (
      <Tab
        eventKey={recipient.value}
        title={<RoutingTab label={recipient.label} username={recipient.value} />}
      >
        <RoutingSlip data={recipient} defaultFrom />
      </Tab> 
    );
  });



  return (
    <div className="m-3">
      <PreviewRouting previewRouting={previewRouting} togglePreview={togglePreview} routingData={routingData} onProceed={onAddRouting} />
      <div className="d-block d-md-flex mt-3">
        <h4 className="me-3">Add Routing Note</h4>
        <AddRecipientButton />
      </div>
      <hr />
    
      {/* <Form> */}
        <Tabs>
            {routingSlips}
        </Tabs>

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
            name="Submit"
            onClick={onPreview}
            icon={<BsChevronRight />}
          />
        </div>
      {/* </Form> */}
    </div>
  );
};

export default AddRoutingNote;

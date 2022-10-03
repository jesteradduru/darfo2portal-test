// Routing slip layout
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Col, Row, FormGroup, Label, Input, Form } from "reactstrap";
import {
  setGroupRecipient,
} from "../../../features/dts/routing/routingSlice";
import { RoutingCheckbox } from "../../../Layouts/DTS";
import { getUser } from "../../../features/Portal/userSlice";
import { getAccounts } from "../../../features/Portal/accountsSlice";
import {useReactToPrint} from "react-to-print";
import { useRef } from "react";
import { IconatedButton } from "../../../Layouts/Portal";
import { BsPrinter } from "react-icons/bs";
const _ = require('lodash')

const RoutingSlip = ({ data, viewOnly }) => {
  const { users } = useSelector((state) => state.accounts);
  const { user } = useSelector((state) => state.user);
  const { viewCommunicationData } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const { routingRecipients } = useSelector((state) => state.routing);
  const { tasks, taskCounter } = useSelector((state) => state.tasks);
  const printHtml = useRef();
  const handlePrintRouting = useReactToPrint({
    content: () => printHtml.current,
    documentTitle:'routing_slip',
    pageStyle:'print'
  })

  const groupList = users
    .filter((user) => user.group_id === data.value)
    .map((user) => {
      return {
        value: user.user_username,
        label: `${user.emp_firstname}  ${user.emp_lastname} - ${user.office_code}`,
        user_id: user.user_id,
        user_username: user.user_username,
        user_fullname: `${user.emp_firstname}  ${user.emp_lastname} - ${user.office_code}`,
        role_name: user.role_name,
        role_id: user.role_id,
      };
    });

  const onChangeGroupRecipient = (selectedUsers) => {
    // setGroupRecipients(selectedUsers);
    dispatch(
      setGroupRecipient({ group_id: data.value, recipients: selectedUsers })
    );
    // console.log(selectedUsers);
  };

  const routingFrom = () => {
    if(!_.isEmpty(users)){
      if(user.role_name.includes('Process-level') && !viewOnly){
        const pl_approver = users.filter(item => item.role_name === 'Process-level Approver')[0]
        return `${pl_approver.emp_firstname} ${pl_approver.emp_middlename[0]}. ${pl_approver.emp_lastname} - ${pl_approver.emp_position}`; 
      }else if(viewOnly){
        const from = users.filter(item => item.user_id === data.routing_from)[0]
        return `${from.emp_firstname} ${from.emp_middlename[0]}. ${from.emp_lastname} - ${from.emp_position}`;
      }else{
        return `${user.emp_firstname} ${user.emp_middlename[0]}. ${user.emp_lastname} - ${user.emp_position}`;
      }
    }
  };

  const routingData = routingRecipients.filter((r) => r.value === data.value);

  // const usersList = users
  //   .filter(
  //     (user) =>
  //       !routingRecipients.map((r) => r.value).includes(user.user_username)
  //   )
  //   .map((user) => {
  //     return {
  //       value: user.user_username,
  //       label: `${user.emp_firstname}  ${user.emp_lastname} - ${user.office_code}`,
  //       type: "user",
  //     };
  //   });

  useEffect(() => {
    dispatch(
      setGroupRecipient({ group_id: data.value, recipients: groupList })
    );
    dispatch(getAccounts())
    dispatch(getUser())

  }, [dispatch]);


  const isLegendContains = (legend) => {
    if(data.routing_legend){
      return data.routing_legend.includes(legend)
    }
  }

  const showToTask = (task) => {
    const allowedTask = ['viewRouting', 'addRoutingNote', 'forRouting', 'routeCommunication']
    return allowedTask.includes(task);
  }

  return (
    <>
    <IconatedButton
        name='Print Routing'
        outline
        icon={<BsPrinter />}
        className="ms-auto d-block my-2 d-print-none"
        onClick={handlePrintRouting}
      />
    <Form
      id={`routing_${data.value}`}
      ref={printHtml}
      className="p-md-4 p-1 rounded bg-super-light-green m-md-2 routing_slip_form"
      style={{pointerEvents: viewOnly ? 'none' : ''}}
    >
      <FormGroup>
        <Label for={`reference_no`}>Reference No.</Label>
        <Input
          type="text"
          id={`reference_no`}
          name="reference_no"
          size="sm"
          defaultValue={data.routing_referenceNo ? data.routing_referenceNo : `139-9-${viewCommunicationData.class_code}-` }
        />
      </FormGroup>
      <FormGroup>
        <Label for={`routing_from`}>From</Label>
        <Input
          type="text"
          id={`routing_from`}
          defaultValue={routingFrom()}
          name="routing_from"
          size="sm"
        />
      </FormGroup>
      {data.type === "group" ? (
        <FormGroup>
          <Label for="routing_to">To</Label>
          <Select
            options={groupList}
            isMulti
            defaultValue={groupList}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={onChangeGroupRecipient}
          />
        </FormGroup>
      ) : (
        <FormGroup>
          <Label for="routing_to">To</Label>
          <Select
            options={routingData}
            defaultValue={!data.routing_to ? routingData : [{label: data.label}]}
            classNamePrefix="select"
          />
        </FormGroup>
      )}

      <Row style={{wordWrap: 'break-word'}}>
        <Col md='6'>
          <RoutingCheckbox
            name="routing_legend"
            id={`for_action_${data.value}`}
            value={`for_action`}
            desc="For your appropriate action"
            isLegendContains={isLegendContains}
          />
          <RoutingCheckbox
            name="routing_legend"
            id={`for_information_${data.value}`}
            value={`for_information`}
            desc="For your information/file & reference"
            isLegendContains={isLegendContains}
          />
          <RoutingCheckbox
            name="routing_legend"
            id={`for_review_${data.value}`}
            value={`for_review`}
            desc="For your review/ comments/ recommendation/ validation"
            isLegendContains={isLegendContains}
          />
          <RoutingCheckbox
            name="routing_legend"
            id={`draft_reply_${data.value}`}
            value={`draft_reply`}
            desc="Draft reply/For your acknowledgement"
            defaultValue={data.routing_draftReply}
            textbox
            isLegendContains={isLegendContains}
          />
        </Col>
        <Col md='6'>
          <RoutingCheckbox 
            name="routing_legend" 
            id={`rush_${data.value}`} 
            value={`rush`} 
            desc="Rush" 
            isLegendContains={isLegendContains}
          />
          <RoutingCheckbox 
            name="routing_legend" 
            id={`urgent_${data.value}`} 
            value={`urgent`} 
            desc="Urgent" 
            isLegendContains={isLegendContains}
          />
          <RoutingCheckbox
            name="routing_legend"
            id={`for_circulation_${data.value}`}
            value={`for_circulation`}
            desc="For circulation & dissemination"
            isLegendContains={isLegendContains}
          />
          <RoutingCheckbox
            name="routing_legend"
            id={`for_schedule_${data.value}`}
            value='for_schedule'
            desc="For schedule"
            isLegendContains={isLegendContains}
          />
          <RoutingCheckbox
            name="routing_legend"
            id={`attend_${data.value}`}
            value={`attend`}
            desc="Attend/Represent Me"
            isLegendContains={isLegendContains}
          />
          <RoutingCheckbox
            name="routing_legend"
            id={`consolidate_${data.value}`}
            value={`consolidate`}
            textbox
            defaultValue={isLegendContains('consolidate') ? data.routing_consolidate : "\nPlease consolidate & submit to my office on or before\n"}
            isLegendContains={isLegendContains}
          />
        </Col>
        {(viewCommunicationData.com_urgency === "Rush" || showToTask(tasks[taskCounter])  ) && (
          <Col md="12">
            <FormGroup>
              <Label for={`routing_remarks`}>Remarks</Label>
              <Input
                defaultValue={data.routing_remarks}
                type="textarea"
                id={`routing_remarks_${data.value}`}
                name="routing_remarks"
                size="sm"
                rows="5"
              />
            </FormGroup>
          </Col>
        )}
      </Row>
    </Form>
    </>
  );
};

export default RoutingSlip;

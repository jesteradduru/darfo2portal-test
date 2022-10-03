import _, { isEmpty } from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BsX, BsCheck2 } from "react-icons/bs";
import { useSelector } from "react-redux";
import {
  Container,
  ModalBody,
  ModalFooter,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import { IconatedButton, ModalContainer } from "../../Portal";
import { getLegendDescription } from "./PreviewRoutingLogic";

const PreviewRouting = ({
  previewRouting,
  togglePreview,
  routingData,
  onProceed,
}) => {
  const [open, setOpen] = useState("0");
  const [recipientsArray, setRecipients] = useState([]);
  const { viewCommunicationData } = useSelector((state) => state.tasks);

  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  const recipientLayout = recipientsArray.map((data, index) => {
    return (
      <AccordionItem>
        <AccordionHeader targetId={index}>{data.fullname}</AccordionHeader>
        <AccordionBody accordionId={index}>
          <strong className="d-block">Legends</strong>
          {!_.isEmpty(data.legends) ? (
            <ul>
              {data.legends.map((legend) => {
                const text =
                  legend === "consolidate"
                    ? data.consolidate_text
                    : data.draft_reply_text;
                return <li>{getLegendDescription(legend, text)}</li>;
              })}
            </ul>
          ) : (
            <i className="text-info">No checked/selected routing legends.</i>
          )}

          <strong className="d-block">Remarks</strong>
          {isEmpty(data.remarks) ? (
            <i className="text-info">No remarks.</i>
          ) : (
            <p className="ms-3">{data.remarks}</p>
          )}
        </AccordionBody>
      </AccordionItem>
    );
  });

  useEffect(() => {
    const recipients = routingData.map((r_data) => {
      const recipientsPerRouting = r_data.routing_recipients.map((data) => {
        return {
          fullname: data.user_fullname,
          remarks: r_data.routing_remarks,
          legends: r_data.routing_legend,
          consolidate_text: r_data.consolidate_text,
          draft_reply_text: r_data.draft_reply_text,
        };
      });

      return recipientsPerRouting;
    });

    setRecipients(recipients.flat());
  }, [routingData]);

  return (
    <ModalContainer
      isModalOpen={previewRouting}
      toggleModal={togglePreview}
      title={"Do you really want to proceed?"}
      size="md"
    >
      <ModalBody>
        <Container>
          <strong>{`${viewCommunicationData.com_controlNo}`}</strong>
          <p>{viewCommunicationData.com_subject}</p>
          <hr />
          <strong>Recipients</strong>
          <Accordion open={open} toggle={toggle}>
            {recipientLayout}
          </Accordion>
        </Container>
      </ModalBody>
      <ModalFooter>
        <IconatedButton
          name="Cancel"
          color="danger"
          onClick={togglePreview}
          icon={<BsX />}
        />
        <IconatedButton icon={<BsCheck2 />} name="Yes" onClick={onProceed} />
      </ModalFooter>
    </ModalContainer>
  );
};

export default PreviewRouting;

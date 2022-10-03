import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from "reactstrap";
import {
  AttachmentsContainer,
  EditCommunicationModal,
  ImageGallery,
  NextTaskButton,
} from "../../../Layouts/DTS";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementTaskCounter,
  getCommunication,
} from "../../../features/dts/tasks/tasksSlice";
import {
  Confirmation,
  ContentLoader,
  IconatedButton,
  RequirePermission,
} from "../../../Layouts/Portal";
import {
  BsChevronLeft,
  BsPencilFill,
  BsPrinter,
  BsTrashFill,
} from "react-icons/bs";
import { seenCommunication } from "../../../features/dts/inbox/inboxSlice";
import { useState } from "react";
import { discardDraft } from "../../../features/dts/drafts/draftsSlice";
import { getAttachments, getScanned } from "../../../Helpers/dts_helpers";
import { useReactToPrint } from "react-to-print";
const _ = require("lodash");

const ViewCommunication = () => {
  const { com_id, inbox_id } = useParams();
  const { viewCommunicationData, isLoading, errorMessage } = useSelector(
    (state) => state.tasks
  );
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpenConfirm, setOpenConfirm] = useState(false)

  useEffect(() => {
    dispatch(getCommunication(com_id));
    dispatch(seenCommunication(inbox_id));
  }, [dispatch, com_id]);

  const {
    com_controlNo,
    com_source_name,
    com_source_position,
    com_source_office,
    com_subject,
    com_dateCreated,
    com_other_remarks,
    // class_name,
    // cat_name,
    com_urgency,
    com_due_date,
    scanned = [],
    attachments = [],
    employee = {},
  } = viewCommunicationData;
  const handlePrintImages = useReactToPrint({
    content: () => {
      const wrapper = document.createElement("div");
      const scannedCopies = getScanned(scanned);

      scannedCopies.forEach((scan) => {
        const img = document.createElement("img");
        img.setAttribute("src", scan.src);
        img.setAttribute("class", "img-fluid");
        wrapper.appendChild(img);
      });

      return wrapper;
    },
    pageStyle: "print",
    documentTitle: "scanned",
  });

  const [isEditModalOpen, toggleEditModal] = useState(false);

  const onDeleteCommunication = async () => {
    if (window.confirm("Are you sure you want to delete this communication?")) {
      const res = await dispatch(discardDraft(com_id));
      if (res.payload === "succesfully deleted") {
        console.log("Communication has been deleted");
        navigate("/dts/managementOfCommunications/inbox");
      }
    }
  };

  const EditDelete = ({ className }) => {
    return (
      <div className={className}>
        <RequirePermission allowedPermissions={"editCommunication"}>
          <IconatedButton
            color="success"
            size="sm"
            icon={<BsPencilFill />}
            onClick={() => {
              toggleEditModal(!isEditModalOpen);
            }}
          />
        </RequirePermission>
        <RequirePermission allowedPermissions={"deleteCommunication"}>
          <IconatedButton
            icon={<BsTrashFill />}
            color="danger"
            size="sm"
            className="ms-1"
            onClick={onDeleteCommunication}
          />
        </RequirePermission>
      </div>
    );
  };
  const UrgencyBadge = () => {
    switch(com_urgency){
      case 'OMG':
        return <Badge color="danger">OMG</Badge> 
      case 'Rush':
        return <Badge color="warning">Rush</Badge>
      default:
        return <Badge color="secondary">Regular</Badge>
    }
  }

  return (
    <Container
      className="py-3"
    >
      {!_.isEmpty(viewCommunicationData) && (
        <EditCommunicationModal
          comData={viewCommunicationData}
          isModalOpen={isEditModalOpen}
          toggleModal={toggleEditModal}
        />
      )}
      <ContentLoader isLoading={isLoading} errorMessage={errorMessage}>
        <Confirmation isOpen={isOpenConfirm} />
        <Card>
          <CardHeader className="d-flex flex-column">
            <div className="d-flex justify-content-end">
              <EditDelete className={"d-flex d-sm-none"} />
            </div>
            <div className="d-flex justify-content-between">
              <h4>{com_controlNo}</h4>
              <EditDelete className="d-none d-sm-flex" />
            </div>
            <div>
              <UrgencyBadge />
              {!_.isNull(com_due_date) && (
                <Badge color="info" className="ms-1">
                  Due Date: {moment(com_due_date).format("dddd, MMMM DD, YYYY")}
                </Badge>
              )}
              <i className="text-secondary d-block">
                Created by{" "}
                {`${employee.emp_firstname} ${employee.emp_lastname}`} -{" "}
                {moment(com_dateCreated).format("DD/MM/YYYY")}
              </i>
            </div>
          </CardHeader>
          <CardBody>
            <h4 className="text-info">{com_subject}</h4>
            {(user.role_name?.includes("Process-level Approver") ||
              (user.role_name?.includes("Approver") &&
                user.office_code.includes("RTD"))) && (
              <IconatedButton
                name="Print Scanned Copies"
                className="ms-auto d-block"
                outline
                icon={<BsPrinter />}
                onClick={handlePrintImages}
              />
            )}

            <ImageGallery
              title={"Scanned Copies"}
              images={getScanned(scanned)}
            />
            <br />
            <AttachmentsContainer attachments={getAttachments(attachments)} />
            <hr />

            <div className="p-2">
              <span className="lead">Other Remarks</span>
              <p>{com_other_remarks}</p>
            </div>
          </CardBody>
          <CardFooter>
            <div>
              <span>Source: </span>
              <u>
                <strong>{com_source_name}</strong>
                {!_.isEmpty(com_source_position) && (
                  <span>, {com_source_position}</span>
                )}
                {!_.isEmpty(com_source_office) && (
                  <span>, {com_source_office}</span>
                )}
              </u>
            </div>
          </CardFooter>
        </Card>
        <div className="d-flex justify-content-between mt-2">
          <IconatedButton
            size="md"
            color="primary"
            name="Back"
            icon={<BsChevronLeft />}
            onClick={() => {
              navigate(-1);
              dispatch(decrementTaskCounter());
            }}
          />
          <NextTaskButton />
        </div>
      </ContentLoader>
    </Container>
  );
};

export default ViewCommunication;

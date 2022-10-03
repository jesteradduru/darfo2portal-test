// View Action Taken Status Page
import React from "react";
import { useEffect } from "react";
import { BsChevronRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Container, Card, CardText, CardTitle, Spinner } from "reactstrap";
import {
  getActionTaken,
  reforwardForAction,
} from "../../../features/dts/action/actionSlice";
import {
  AttachmentsContainer,
  BackButton,
  ImageGallery,
  NextTaskButton,
} from "../../../Layouts/DTS";
import { Confirmation, ContentLoader, IconatedButton } from "../../../Layouts/Portal";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { taskComplete } from "../../../features/dts/tasks/tasksSlice";
import { getAttachments, getScanned } from "../../../Helpers/dts_helpers";
import { useState } from "react";

const ViewActionStatus = ({ reforward }) => {
  const { com_id, inbox_id } = useParams();
  const dispatch = useDispatch();
  const {
    reviewActionTakenData,
    isLoading,
    errorMessage,
    actor,
    rejectedBy,
    last_touch,
    addLoading,
  } = useSelector((state) => state.action);
  const navigate = useNavigate();
  const [confirmationOpen, setConfirmation] = useState(false);

  useEffect(() => {
    dispatch(getActionTaken({ com_id, inbox_id }));
  }, [dispatch]);

  const onClickSubmit = async () => {
    const res = await dispatch(reforwardForAction(reviewActionTakenData));
    if (res.payload.inbox_id) {
      await dispatch(taskComplete(inbox_id));
      navigate("/dts/managementOfCommunications/inbox");
    }
  };

  const onConfirmSubmit = (e)  => {
    e.preventDefault()
    setConfirmation(!confirmationOpen);
  }



  return (
    <Container className="mt-3">
      <Confirmation isOpen={confirmationOpen} toggleModal={() => setConfirmation(!confirmationOpen)} onProceed={onClickSubmit} />
      <ContentLoader isLoading={isLoading} errorMessage={errorMessage}>
        <h4>View Action Status</h4>
        <hr />
        <Card
          body
          style={{
            backgroundColor: "#ffdede",
          }}
        >
          <CardTitle className="text-danger" tag={"h4"}>
            For Revision
          </CardTitle>
          <CardText>
            <div>
              <span className="lead">Action Taken: </span>
              <pre className="pre-wrap-text p-2 rounded bg-light shadow">
                {reviewActionTakenData.act_taken}
                <br />
                <i className="text-secondary">{`by ${actor.emp_firstname} ${actor.emp_lastname} - ${actor.office_code}`}</i>
              </pre>
            </div>
            <div>
              <span className="lead">Remarks: </span>
              <pre className="pre-wrap-text p-2 rounded bg-light shadow">
                {reviewActionTakenData.act_remarks}
                <br />
                {rejectedBy && (
                  <i className="text-secondary">{`by ${
                    rejectedBy.emp_firstname
                  } ${rejectedBy.emp_lastname} - ${
                    rejectedBy.office_code
                  } | ${moment(
                    reviewActionTakenData.act_reject_date
                  ).fromNow()}`}</i>
                )}
              </pre>
            </div>
            <ImageGallery
              title={"Scanned Copies"}
              images={reviewActionTakenData.scanned && getScanned(reviewActionTakenData.scanned)}
            />
            <br />
            <AttachmentsContainer
              attachments={ reviewActionTakenData.attachments && getAttachments(reviewActionTakenData.attachments)}
            />
          </CardText>
        </Card>
        {reforward && (
          <i className="text-info">
            Note: clicking submit button will forward this communication to{" "}
            {`${last_touch.emp_firstname} ${last_touch.emp_lastname} - ${last_touch.office_code}`}{" "}
          </i>
        )}
        <div className="d-flex justify-content-between mt-3">
          <BackButton />
          {reforward ? (
            <IconatedButton
              size="md"
              color="primary"
              name={addLoading ? <Spinner color="light" /> : "Submit"}
              onClick={onConfirmSubmit}
              icon={<BsChevronRight />}
            />
          ) : (
            <NextTaskButton />
          )}
        </div>
      </ContentLoader>
    </Container>
  );
};

export default ViewActionStatus;

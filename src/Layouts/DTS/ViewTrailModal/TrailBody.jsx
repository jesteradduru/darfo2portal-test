import React, { useState } from "react";
import { BsPaperclip } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { getComUploads } from "../../../features/dts/uploads/uploadsSlice";
import ViewUploadsModal from "../ViewUploadsModal/ViewUploadsModal";

const TrailBody = ({ active, trail, by, com_id, act_id }) => {
  const [isOpen, setOpen] = useState(false);
  const dispatch = useDispatch();
  const {scanned, attachments, isLoading} = useSelector(state => state.uploads)

  const viewUploads = (type) => {
    switch(type){
      case 'act':
        // console.log(`act ${act_id}`)
        dispatch(getComUploads({act_id}))
        break;
      case 'signed':
        // console.log(`signed_attach_id ${act_id}`)
        dispatch(getComUploads({signed_attach_id: act_id}))
        break;
      default:
        // console.log(`com ${com_id}`);
        dispatch(getComUploads({com_id}))
        break;
    }
    setOpen(!isOpen)
  }

  return (
    <>
      <div className="border w-100 rounded p-2 ms-3">
        <div className="d-flex justify-content-between">
          <h6 className={`${active && "text-success"}`}>{trail}</h6>
          { trail.includes("Communication has been created") && (
          <Button
            outline
            className="ms-auto d-block mb-3"
            color="primary p-1"
            style={{ fontSize: "16px" }}
            onClick={() => viewUploads('com')}
          >
            <BsPaperclip />
          </Button>
        )}
        { trail.includes("Added action taken." )&& (
          <Button
            outline
            className="ms-auto d-block mb-3"
            color="primary p-1"
            style={{ fontSize: "16px" }}
            onClick={() => viewUploads('act')}
          >
            <BsPaperclip />
          </Button>
        )}
        { trail.includes('Communication complied') && (
          <Button
            outline
            className="ms-auto d-block mb-3"
            color="primary p-1"
            style={{ fontSize: "16px" }}
            onClick={() => viewUploads('signed')}
          >
            <BsPaperclip />
          </Button>
        )}
        </div>
        <div className="d-flex justify-content-between">
          <i>by {by}</i>
        </div>
      </div>
        
      <ViewUploadsModal isOpen={isOpen} scanned={scanned} attachments={attachments} setOpen={setOpen} isLoading={isLoading} />
    </>
  );
};

export default TrailBody;

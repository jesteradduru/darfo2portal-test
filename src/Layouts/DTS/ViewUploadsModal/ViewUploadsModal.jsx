import React from "react";
import { ModalBody } from "reactstrap";
import { getAttachments, getScanned } from "../../../Helpers/dts_helpers";
import { ContentLoader, ModalContainer } from "../../Portal";
import AttachmentsContainer from "../AttachmentsContainer/AttachmentsContainer";
import ImageGallery from "../ImageGallery/ImageGallery";

const ViewUploadsModal = ({isOpen, scanned, attachments, setOpen, isLoading}) => {
  return (
    <ModalContainer
        isModalOpen={isOpen}
        toggleModal={setOpen}
        title={"View Uploads"}
        size="lg"
      >
        <ModalBody>
          <ContentLoader isLoading={isLoading}>
            {
                scanned.length === 0 && attachments.length === 0 ? <p className="lead text-info text-center">No Uploads To Display</p> :
                <>
                    <ImageGallery title={"Scanned Copies"} images={getScanned(scanned)} />
                    <AttachmentsContainer attachments={getAttachments(attachments)} />
                </>
            }
          </ContentLoader>
        </ModalBody>
      </ModalContainer>
  )
}

export default ViewUploadsModal
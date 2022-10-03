// View Trail Modal
import React from "react";
import { ContentLoader, ModalContainer } from "../../Portal";
import { ModalBody } from "reactstrap";
import { useSelector } from "react-redux";
import TrailContainer from "./TrailContainer";

const ViewTrailModal = ({ isModalOpen, toggleModal }) => {
  const { isLoading, errorMessage, trails } = useSelector(
    (state) => state.trail
  );

  const document_trail = trails.map((trail, index) => {
    const by = `${trail.emp_firstname} ${trail.emp_middlename[0]} ${trail.emp_lastname} - ${trail.office_code}`;
    return (
      <TrailContainer
        key={index}
        active={index === 0}
        trail={trail.trail_description}
        act_id={trail.act_id}
        com_id={trail.com_id}
        by={by}
        date={trail.trail_date}
      />
    );
  });


  return (
    <div>
      <ModalContainer
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        title={"Document Trail"}
        size="md"
      >
        <ModalBody>
          <ContentLoader isLoading={isLoading} errorMessage={errorMessage}>
            {document_trail}
          </ContentLoader>
        </ModalBody>
      </ModalContainer>
    </div>
  );
};

export default ViewTrailModal;

// CALENDAR PAGE
import React from "react";
import { Container } from "reactstrap";

const Calendar = () => {
  return (
    <Container className="d-flex flex-column mt-3">
      <h3>RED's Activities</h3>
      <iframe
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=Asia%2FManila&src=b3JlZC5yZm8yQGRhLmdvdi5waA&color=%23039BE5"
        style={{border:"solid 1px #777"}}
        width="800"
        height="600"
        frameBorder="0"
        scrolling="no"
        title="Red's Activities"
        className="mx-auto"
      ></iframe>
    </Container>
  );
};

export default Calendar;

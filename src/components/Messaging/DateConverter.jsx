import moment from "moment";
import React from "react";

function DateConverter({ date }) {
  var time = moment(date).startOf(date, "day").fromNow();
  return <div className="ml-1">Sent: {time}</div>;
}

export default DateConverter;

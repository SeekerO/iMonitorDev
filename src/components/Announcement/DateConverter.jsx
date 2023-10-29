import moment from "moment";
import React from "react";

function DateConverter({ date }) {
  var time = moment(date).format('LLL'); ;
  return <div className="ml-1">{time}</div>;
}

export default DateConverter;

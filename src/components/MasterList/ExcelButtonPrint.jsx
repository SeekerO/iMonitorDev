import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { RiFileExcel2Fill } from "react-icons/ri";
const ExcelButtonPrint = ({ data }) => {
  const dataExcel = [
    [
      "Fullname",
      "Program",
      "Section",
      "ojtStarting",
      "ojtEnd",
      "o365",
      "remarks",
      "companyname",
      "companyaddress",
      "companyemail",
      "supervisorName",
      "designation",
      "supervisorContact",
      "officeNumber",
    ],
  ];
  useEffect(() => {
    DataSetForExcel();
  }, [data]);

  const DataSetForExcel = () => {
    for (let index = 0; index < data.length; index++) {
      var Details = [
        data[index].studname,
        data[index].filterby,
        data[index].studsection,
        data[index].ojtstart,
        data[index].ojtend,
        data[index].studemail,
        data[index].studremarks,
        data[index].companyname,
        data[index].companyaddress,
        data[index].companyemail,
        data[index].supervisorname,
        data[index].companydesignation,
        data[index].supervisorcontactnumber,
        data[index].supervisorofficenumber,
      ];
      dataExcel.push(Details);
    }
  };

  const fileName = "MasterList.xlsx";

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(dataExcel);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, fileName);
  };

  return (
    <div>
      <button
        onClick={exportToExcel}
        className="hover:bg-[#65af58bc] bg-[#4cb551] text-white rounded-md flex items-center gap-1 p-1 w-full justify-center cursor-pointer mt-2"
      >
        <RiFileExcel2Fill />
        Export to Excel
      </button>
    </div>
  );
};

export default ExcelButtonPrint;

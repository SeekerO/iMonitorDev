import React from "react";

const CompanyNameSearch = ({ companyinfo }) => {


  return (
    <div>
      <div className="hover:cursor-pointer hover:underline">
        {companyinfo.companyname} 
      </div>
    </div>
  );
};

export default CompanyNameSearch;

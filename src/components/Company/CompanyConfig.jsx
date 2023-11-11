import { useState, useEffect } from "react";
import ViewCompanyModal from "./ViewCompanyModal";
import Tooltip from "@mui/material/Tooltip";
import AOS from "aos";
import "aos/dist/aos.css";

const CompanyConfig = ({ companyinfos, Data }) => {
  // AOS ANIMATION
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [showmodalcompany, setShowModalCompany] = useState(false);
  const handleclosemodalcompany = () => setShowModalCompany(false);

  return (
    <div className="companyinfo-data w-[100%] ">
      <div className=" grid gap-4 mt-[0.5%] hover:translate-x-4 duration-500 hover:shadow-lg cursor-pointer">
        <div
          onClick={() => setShowModalCompany(true)}
          className="bg-slate-200 p-3 text-black flex font-medium rounded "
        >
          <Tooltip
            title="View Information"
            arrow
            placement="left"
            className="w-[30%]"
          >
            <div className="pl-[2%]  w-[100%] hover:underline hover:text-blue-600 md:text-base text-smhover:before:opacity-100 hover:cursor-pointer">
              {companyinfos.companyname}{" "}
            </div>{" "}
          </Tooltip>
          <div className="pl-[2%]  w-[39%]  md:text-base text-sm">
            {companyinfos.companyaddress}
          </div>
          <div className="pl-[2%]  w-[30%] md:pr-0 pr-2 md:text-base text-sm">
            NUMBER OF STUDENT ENTERED OJT: {companyinfos.companyOJT}
          </div>
        </div>
      </div>
      <ViewCompanyModal
        onClose={handleclosemodalcompany}
        visible={showmodalcompany}
        companyinfos={companyinfos}
        number={companyinfos.companyOJT}
        compName={companyinfos.companyname}
        Data={Data}
      />
    </div>
  );
};

export default CompanyConfig;

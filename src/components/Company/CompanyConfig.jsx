import { useState, useEffect } from "react";
import ViewCompanyModal from "./ViewCompanyModal";

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
          className="bg-slate-200 p-1 text-black flex  pt-2 font-medium rounded "
        >
          <div
            data-tip="ViewInfo"
            className="pl-[2%] -mt-1 w-[30%] hover:underline hover:text-blue-600
            md:text-base text-sm

            before:content-[attr(data-tip)]
            before:absolute
            before:px-3 before: py-2
            before:left/12 before: top-3
            before:w-max before:max-w-xs
            before:-translate-x-1/2 before:-translate-y-full
            before:bg-gray-400 before:text-white
            before:rounded-sm before:opacity-0
            before:transition-all
            hover:before:opacity-100 
            hover:cursor-pointer
          "
          >
            {companyinfos.companyname}
          </div>
          <div className="pl-[2%] mt-1 w-[39%]  md:text-base text-sm">
            {companyinfos.companyaddress}
          </div>
          <div className="pl-[2%] mt-1 w-[30%] md:pr-0 pr-2 md:text-base text-sm">
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

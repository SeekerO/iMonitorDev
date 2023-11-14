import { useState, useEffect } from "react";
import ViewCompanyModal from "./ViewCompanyModal";
import { Tooltip as ReactTooltip } from "react-tooltip";
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
    <div className="company.info-data w-[100%] ">
      <div className=" grid gap-4 mt-[0.5%] hover:translate-x-4 duration-500 hover:shadow-lg cursor-pointer">
        <div
          onClick={() => setShowModalCompany(true)}
          className="bg-slate-200 p-3 text-black flex font-medium rounded "
        >
          <div className="w-[30%]">
            <a data-tooltip-id="View" className="pl-[2%]  w-fit ">
              {companyinfos.companyname}
            </a>
          </div>

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
      <ReactTooltip
        id="View"
        place="bottom"
        variant="info"
        content="View Information"
      />
    </div>
  );
};

export default CompanyConfig;

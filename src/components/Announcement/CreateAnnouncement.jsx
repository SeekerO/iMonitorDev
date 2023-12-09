import React, { useState, useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import supabase from "../iMonitorDBconfig";
import moment from "moment";
import { BsCheckCircleFill } from "react-icons/bs";
import { AiOutlineCheck } from "react-icons/ai";
import Datepicker from "react-tailwindcss-datepicker";
import "react-datepicker/dist/react-datepicker.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateAnnouncement({ Data }) {
  // AOS ANIMATION
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [title, setTitle] = useState("");
  const [endDate, setendDate] = useState("");
  const [allow, setAllow] = useState(false);
  const [message, setMessage] = useState("");

  const [performerror, setPerformError] = useState("");
  var currDate = moment().format("LLL");
  var endDateSend = moment(endDate).format("LLL");

  const [isEmpty, setIsEmpty] = useState(false);
  let [file, setFile] = useState([]);
  const [filename, setFileName] = useState();

  const handleFileInputChange = (event) => {
    try {
      const files = event.target.files;
      const datafile = event.target.files[0];

      if (files.length > 0) {
        setIsEmpty(true);
        setFile(datafile);
        setFileName(datafile.name);
      } else {
        setIsEmpty(false);
      }
    } catch (error) {}
  };

  function handlePostAnnouncement() {
    if (
      title.trim().length === 0 ||
      endDate.trim().length === 0 ||
      message.trim().length === 0
    ) {
      toast.warning("Invalid input", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    var a = false;
    const postdata = async () => {
      if (title.trim() === 0 || message.trim() === 0) {
        toast.warning("Invalid Input", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      if (isEmpty === false) {
        const { data, error } = await supabase
          .from("AnnouncementTable")
          .insert([
            {
              announcementTitle: title,
              announcementAllow: allow,
              announcementStartDate: currDate,
              announcementEndDate: endDateSend,
              announcementMessage: message,
              PostedBy: Data.beneName,
            },
          ]);
        clear();
      } else {
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
        const documentExtenstions = ["docx", "pdf", "ods", "pptx", "xlsx"];
        const fileExtenstion = filename.split(".").pop().toLowerCase();

        if (
          imageExtensions.includes(fileExtenstion) ||
          documentExtenstions.includes(fileExtenstion)
        ) {
          await supabase.storage
            .from("AnnouncementAttachmentFiles")
            .upload(title + "/" + filename, file);

          const { data, error } = await supabase
            .from("AnnouncementTable")
            .insert([
              {
                announcementTitle: title,
                announcementAllow: allow,
                announcementStartDate: currDate,
                announcementEndDate: endDateSend,
                announcementMessage: message,
              },
            ]);

          clear();
        } else {
          setIsEmpty();
          toast.warning("Invalid File", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return;
        }
      }
    };

    postdata();
  }

  function clear() {
    setIsEmpty(false);
    handlealert();
    setAllow(false);
    setMessage("");
    setTitle("");
    setendDate("");
    setPerformError("");
    setFile();
    setFileName();
  }

  function handlealert() {
    toast.success("Announcement Posted!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  return (
    <>
      <div className=" h-screen  w-[100%] text-white  justify-center place-content-center flex">
        <form
          className="flex-col w-[100%] md:h-[85%] h-[82%] md:mt-3 mt-14 overflow-y-auto p-2 "
          data-aos="fade-left"
        >
          <label className="text-[30px] font-bold ">CREATE ANNOUNCEMENT</label>
          <div className="mt-14">
            <label className="pr-5 text-[20px] font-semibold ">
              TITLE OF ANNOUNCEMENT:
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="rounded-md p-2 md:w-[75%] w-[100%] text-black"
            />
          </div>
          <div className="pt-6 flex ">
            <label className="pr-5 text-[20px] font-semibold ">DURATION:</label>
            <input
              min={disablePastDate()}
              required
              value={endDate}
              onChange={(e) => setendDate(e.target.value)}
              type="date"
              className="rounded-md p-2 text-black hover:cursor-pointer"
            />
          </div>
          <div className="flex pt-6 ">
            <label className="pr-5 text-[20px] font-semibold ">
              ALLOW DROPBOX:
            </label>

            <input
              type="checkbox"
              value={allow}
              onClick={() => setAllow(!allow)}
              className="w-6 h-6 mt-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="md:flex grid pt-6 ">
            <label className="pr-5 text-[20px] font-semibold mb-1">
              ADD ATTACHMENT:
            </label>

            <input
              type="file"
              accept="e.g:.jpg,.jpeg,.png,.gif,.bmp,.docx,.pdf,.ods,.pptx,.xlsx"
              onChange={handleFileInputChange}
            />
            {isEmpty && (
              <div className="">
                <AiOutlineCheck size={25} style={{ fill: "black" }} />
              </div>
            )}
          </div>

          <div className="pt-6">
            <label className="pr-5 text-[20px] font-semibold ">MESSSAGE:</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="10"
              className="mt-3  p-1 md:w-[97%] w-full text-sm text-gray-900  rounded-md resize-none"
              placeholder="Write Remaks Here.."
            ></textarea>
          </div>
          <div>
            <button
              onClick={() => handlePostAnnouncement()}
              className="md:w-[97%] w-[100%] h-[35px] mb-[100px] bg-[#0074B7]  rounded-md hover:bg-[#3282b5]"
            >
              SEND
            </button>
          </div>
        </form>
      </div>
      <ToastContainer limit={1} />
    </>
  );
}

export default CreateAnnouncement;

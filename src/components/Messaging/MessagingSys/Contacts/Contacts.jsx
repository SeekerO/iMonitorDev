import React, { useEffect, useState } from "react";
import { ContactsGetter } from "./ContactsGetter";
import ContactsConfig from "./ContactsConfig";

export default function Contacts({ user, setUserClicked, setHeaderData }) {
  const [meta_contacts, setMeta_Contacts] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  useEffect(() => {
    const getContacts = async () => {
      setMeta_Contacts(await ContactsGetter(user));
    };
    getContacts();
  }, [user]);

  return (
    <div className="min-w-[250px] h-full bg-slate-200">
      <div className="h-[50px] items-center flex justify-center text-[20px] font-bold text-white bg-blue-950 w-full text-center">
        CHATS
      </div>
      <div className="grid justify-center ">
        <input
          type="search"
          value={inputSearch}
          placeholder="Search Here..."
          className="p-1 bg-slate-300 min-w-[250px] outline-none h-fit "
          onChange={(e) => setInputSearch(e.target.value)}
        />
        {inputSearch !== "" && (
          <div className="h-[400px] overflow-y-auto">
            {meta_contacts
              ?.filter((val) => {
                try {
                  if (inputSearch === "") {
                    return;
                  } else if (
                    val.studname
                      .toLowerCase()
                      .includes(inputSearch.toLowerCase())
                  ) {
                    return val;
                  }
                } catch (error) {}
              })
              .sort()
              .map((data, index) => (
                <ContactsConfig
                  key={index}
                  data={data}
                  setUserClicked={setUserClicked}
                  setInputSearch={setInputSearch}
                  setHeaderData={setHeaderData}
                />
              ))}
          </div>
        )}
      </div>
      {inputSearch === "" && (
        <div className="">
          {user?.Contacts.map((data, index) => (
            <ContactsConfig
              key={index}
              data={data}
              setUserClicked={setUserClicked}
              setInputSearch={setInputSearch}
              setHeaderData={setHeaderData}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import React from "react";
import supabase from "../../../iMonitorDBconfig";

export const ContactsGetter = async (user) => {
  const responseInfo = await supabase.from("StudentInformation").select("*");

  const responseInfoFiltered = await supabase
    .from("StudentInformation")
    .select()
    .match({ studcourse: user.filterby });

  const responseInfoBene = await supabase.from("BeneAccount").select("*");

  if (user.ROLE === "BENE") {
    if (user.filterby === "ALL") {
      return responseInfo.data;
    } else {
      return responseInfoFiltered.data;
    }
  } else {
    return responseInfoBene.data;
  }
};

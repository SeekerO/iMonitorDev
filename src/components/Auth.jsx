import React, { useState } from "react";
import supabase from "./iMonitorDBconfig";

export default async function Auth(
  token,
  user,
  beneChecker,
  studChecker,
  remove,
  setUserName,
  greetings,
  beneInfoGetter,
  studInfoGetter,
  setEmail
) {
  const { data: bene } = await supabase.from("BeneAccount").select();
  var check = false;
  if (bene) {
    for (let index = 0; index < bene.length; index++) {
      if (user.username === bene[index].beneEmail) {
        if (bene[index].status === "active") {
          if (
            window.localStorage.getItem("token") === bene[index].accessToken
          ) {
            passTokenBene();
            beneChecker(true);
            remove();

            check = true;
            setUserName(bene[index].beneName);
          } else {
            passTokenBene();
            beneChecker(true);
            remove();

            check = true;
            setUserName(bene[index].beneName);
          }
          if (bene[index].accessToken === null) {
            passTokenBene();
            beneChecker(true);
            remove();

            check = true;
            setUserName(bene[index].beneName);
          }
          beneInfoGetter();
        } else {
          alert("Your account is deactivated");
        }
      }
    }
  }

  const { data: stud } = await supabase.from("StudentInformation").select();
  if (stud) {
    for (let index = 0; index < stud.length; index++) {
      if (user.username === stud[index].studemail) {
        if (window.localStorage.getItem("token") === stud[index].accessToken) {
          passTokenStud();
          studChecker(true);
          remove();

          check = true;
          setUserName(stud[index].studname);
        } else {
          passTokenStud();
          studChecker(true);
          remove();

          check = true;
          setUserName(stud[index].studname);
        }

        if (stud[index].accessToken === null) {
          passTokenStud();
          studChecker(true);
          remove();

          check = true;
          setUserName(stud[index].studname);
        }
        studInfoGetter();
      }
    }
  }

  async function passTokenBene() {
    const { data: update } = await supabase
      .from("BeneAccount")
      .update({ accessToken: token })
      .eq("beneEmail", user.username)
      .select();

    const { data: name } = await supabase
      .from("BeneAccount")
      .select()
      .eq("beneEmail", user.username)
      .single();

    window.localStorage.setItem("token", token);
  }

  async function passTokenStud() {
    const { data: update } = await supabase
      .from("StudentInformation")
      .update({ accessToken: token })
      .eq("studemail", user.username)
      .select();

    const { data: name } = await supabase
      .from("StudentInformation")
      .select()
      .eq("studemail", user.username)
      .single();

    window.localStorage.setItem("token", token);
  }

  if (check === true) {
    await greetings(true);
  } else {
    await greetings(false);
  }
}

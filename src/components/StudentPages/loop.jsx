import React from "react";

export default function loop(check, setAnnouncement_NOTIF, em) {
  for (let index = 0; index < check.length; index++) {
    var em1 = check[index];
    var em2 = em;
    if (em1 !== em2) return setAnnouncement_NOTIF(true);
  }
}

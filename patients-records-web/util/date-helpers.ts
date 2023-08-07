/** @format */

export const formatDateTime = (dateTime: Date): string => {
  let m = new Date();
  if (dateTime && typeof dateTime === "string") {
    m = new Date((dateTime as unknown as string).slice(0, -1));
  } else {
    m = new Date(dateTime as unknown as string);
  }
  let dateString =
    m.getFullYear() +
    "-" +
    (m.getMonth() + 1 < 10 ? "0" + (m.getMonth() + 1) : m.getMonth() + 1) +
    "-" +
    (m.getDate() < 10 ? "0" + m.getDate() : m.getDate()) +
    "T" +
    (m.getHours() < 10 ? "0" + m.getHours() : m.getHours()) +
    ":" +
    (m.getUTCMinutes() < 10 ? "0" + m.getMinutes() : m.getMinutes());
  return dateString;
};

export const formatDateTimePTBR = (dateTime: Date): string => {
  let m = new Date();
  if (dateTime && typeof dateTime === "string") {
    m = new Date((dateTime as unknown as string).slice(0, -1));
  } else {
    m = new Date(dateTime as unknown as string);
  }
  let dateString =
    (m.getDate() < 10 ? "0" + m.getDate() : m.getDate()) +
    "/" +
    (m.getMonth() + 1 < 10 ? "0" + (m.getMonth() + 1) : m.getMonth() + 1) +
    "/" +
    m.getFullYear() +
    " " +
    (m.getHours() < 10 ? "0" + m.getHours() : m.getHours()) +
    ":" +
    (m.getUTCMinutes() < 10 ? "0" + m.getMinutes() : m.getMinutes());
  return dateString;
};

export const getAgePTBR = (brithdate?: Date): string => {
  if (brithdate) {
    var today = new Date();
    var birthDate = new Date(brithdate);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} anos`;
  } else {
    return "...";
  }
};

/** @format */

export const formatDateTime = (dateTime: Date): string => {
  let m = new Date(dateTime);
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

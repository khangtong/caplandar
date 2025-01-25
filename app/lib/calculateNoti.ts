export default function calculateNoti(
  date: string,
  noti: string,
  from: string,
  unit: string
): string {
  const start = new Date(`${date}T${from}`);

  let notiMs;

  if (unit == "m") notiMs = +noti * 60 * 1000;
  else if (unit == "h") notiMs = +noti * 60 * 60 * 1000;
  else if (unit == "d") notiMs = +noti * 24 * 60 * 60 * 1000;
  else notiMs = +noti * 7 * 24 * 60 * 60 * 1000;

  const notiDate = new Date(Date.parse(start.toString()) - notiMs);

  return `${notiDate.getFullYear()}-${
    notiDate.getMonth() + 1 < 10
      ? `0${notiDate.getMonth() + 1}`
      : notiDate.getMonth() + 1
  }-${
    notiDate.getDate() < 10 ? `0${notiDate.getDate()}` : notiDate.getDate()
  }T${
    notiDate.getHours() < 10 ? `0${notiDate.getHours()}` : notiDate.getHours()
  }:${
    notiDate.getMinutes() < 10
      ? `0${notiDate.getMinutes()}`
      : notiDate.getMinutes()
  }:00`;
}

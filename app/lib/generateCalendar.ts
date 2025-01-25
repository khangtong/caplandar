export const generateCalendar = function (
  currentMonth: number,
  currentYear: number
) {
  const currentDate: number = new Date().getDate();

  let weekdaysInWord = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  // Calculate the first day of the month to weekday (Gauss's algorithm)
  // 1. Leap year or common year
  const leapYear =
    (currentYear % 4 == 0 && currentYear % 100 != 0) || currentYear % 400 == 0;

  // 2. Get month offset with current month
  let m = 0;
  if (currentMonth === 1) {
    m = 0;
  }
  if (currentMonth === 2) {
    m = 3;
  }
  if (leapYear) {
    switch (currentMonth) {
      case 3:
        m = 4;
        break;
      case 4:
        m = 0;
        break;
      case 5:
        m = 2;
        break;
      case 6:
        m = 5;
        break;
      case 7:
        m = 0;
        break;
      case 8:
        m = 3;
        break;
      case 9:
        m = 6;
        break;
      case 10:
        m = 1;
        break;
      case 11:
        m = 4;
        break;
      case 12:
        m = 6;
        break;
    }
  } else {
    switch (currentMonth) {
      case 3:
        m = 3;
        break;
      case 4:
        m = 6;
        break;
      case 5:
        m = 1;
        break;
      case 6:
        m = 4;
        break;
      case 7:
        m = 6;
        break;
      case 8:
        m = 2;
        break;
      case 9:
        m = 5;
        break;
      case 10:
        m = 0;
        break;
      case 11:
        m = 3;
        break;
      case 12:
        m = 5;
        break;
    }
  }

  // 3. Calculate with formula
  const weekday =
    (1 +
      m +
      5 * ((currentYear - 1) % 4) +
      4 * ((currentYear - 1) % 100) +
      6 * ((currentYear - 1) % 400)) %
    7;

  // Calculate the number of days of the month and the previous month
  const numDays = new Date(currentYear, currentMonth, 0).getDate();
  const numDaysP = new Date(currentYear, currentMonth - 1, 0).getDate();

  // Insert days to html calendar
  let html = '',
    wd = 0;

  let daysToRender: any[] = [];

  // 1. Insert days of previous month if the first day of current month is not on sunday
  if (weekday != 0) {
    for (let i = numDaysP - weekday + 1; i <= numDaysP; i++) {
      wd++;
      daysToRender.push({
        date: i,
        inMonth: false,
        current: false,
        firstLine: true,
        prevMonth: true,
        nextMonth: false,
      });
    }
    // Insert days of current month for full week
    for (let i = 1; i <= 7 - weekday; i++) {
      wd++;
      daysToRender.push({
        date: i,
        inMonth: true,
        current:
          i == currentDate &&
          currentMonth == new Date().getMonth() + 1 &&
          currentYear == new Date().getFullYear(),
        firstLine: true,
        prevMonth: false,
        nextMonth: false,
      });
    }
  }

  // 2. Insert next days of current month
  let i = weekday != 0 ? 7 - weekday + 1 : 1;
  let c = 0;
  while (i <= numDays) {
    for (let j = 0; j < 7; j++) {
      daysToRender.push({
        date: i,
        inMonth: true,
        current:
          i == currentDate &&
          currentMonth == new Date().getMonth() + 1 &&
          currentYear == new Date().getFullYear(),
        firstLine: weekday == 0 && c < 7,
        prevMonth: false,
        nextMonth: false,
      });
      i++;
      c++;
      wd++;
      if (i > numDays) break;
    }
  }

  // 3. Insert remain days if calendar is not full
  let remainDays = 0;
  if (daysToRender.length < 42) {
    remainDays = 42 - daysToRender.length;
    for (let i = 1; i <= remainDays; i++) {
      daysToRender.push({
        date: i,
        inMonth: false,
        current: false,
        firstLine: false,
        prevMonth: false,
        nextMonth: true,
      });
    }
  }

  return daysToRender;
};

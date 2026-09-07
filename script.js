const API_KEY = "AIzaSyDCgXLDdFsKeM8kwhI6Gi71jkquQlfSgP0";

const CALENDAR_ID =
  "c1dac8f4f09dd4a69b570d5ae649a8019daa077a5b3dd5b3bbe4ea3aaa6ebd3c@group.calendar.google.com";


let currentDate = new Date();


const calendarEl = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");

const prevButton = document.getElementById("prevMonth");
const nextButton = document.getElementById("nextMonth");


prevButton.addEventListener("click", () => {

  currentDate.setMonth(currentDate.getMonth() - 1);

  renderCalendar();

});


nextButton.addEventListener("click", () => {

  currentDate.setMonth(currentDate.getMonth() + 1);

  renderCalendar();

});


async function renderCalendar() {

  calendarEl.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();


  monthTitle.textContent =
    `${year}. ${String(month + 1).padStart(2, "0")}`;


  const firstDay =
    new Date(year, month, 1);

  const lastDay =
    new Date(year, month + 1, 0);


  const startDate =
    new Date(
      year,
      month,
      1 - firstDay.getDay()
    );


  const endDate =
    new Date(
      year,
      month + 1,
      6 - lastDay.getDay()
    );


  const events =
    await getGoogleCalendarEvents(
      startDate,
      endDate
    );


  let date =
    new Date(startDate);


  while (date <= endDate) {

    const dayEl =
      document.createElement("div");

    dayEl.classList.add("day");


    if (date.getMonth() !== month) {
      dayEl.classList.add("other-month");
    }


    const dayNumber =
      document.createElement("div");

    dayNumber.classList.add("day-number");

    dayNumber.textContent =
      date.getDate();


    dayEl.appendChild(dayNumber);


    const dateString =
      getLocalDateString(date);


    const dayEvents =
      events.filter(event => {

        const eventDate =
          event.start.date ||
          event.start.dateTime?.split("T")[0];

        return eventDate === dateString;

      });


    dayEvents.forEach(event => {

      const eventEl =
        document.createElement("div");

      eventEl.classList.add("event");


      const title =
        event.summary || "";


      const type =
        getEventType(title);


      eventEl.classList.add(type);

      eventEl.textContent = title;


      dayEl.appendChild(eventEl);

    });


    calendarEl.appendChild(dayEl);


    date.setDate(
      date.getDate() + 1
    );

  }

}


async function getGoogleCalendarEvents(
  startDate,
  endDate
) {

  const timeMin =
    startDate.toISOString();


  const timeMax =
    new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() + 1
    ).toISOString();


  const url =
    `https://www.googleapis.com/calendar/v3/calendars/` +
    `${encodeURIComponent(CALENDAR_ID)}/events` +
    `?key=${API_KEY}` +
    `&timeMin=${encodeURIComponent(timeMin)}` +
    `&timeMax=${encodeURIComponent(timeMax)}` +
    `&singleEvents=true` +
    `&orderBy=startTime`;


  try {

    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        "Google Calendar 데이터를 불러오지 못했습니다."
      );

    }


    const data =
      await response.json();


    return data.items || [];

  }

  catch (error) {

    console.error(error);

    return [];

  }

}


function getEventType(title) {

  const lowerTitle =
    title.toLowerCase();


  if (lowerTitle.includes("sober")) {
    return "sober";
  }


  if (lowerTitle.includes("buzzed")) {
    return "buzzed";
  }


  if (lowerTitle.includes("drunk")) {
    return "drunk";
  }


  return "other";

}


function getLocalDateString(date) {

  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(date.getDate())
      .padStart(2, "0");


  return `${year}-${month}-${day}`;

}


renderCalendar();
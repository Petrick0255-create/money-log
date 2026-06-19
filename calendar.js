export let selectedCalendarDate = null;

export function shortMoney(value) {
  value = Number(value);

  if (value >= 100000000) {
    return (value / 100000000).toFixed(1) + "억";
  }

  if (value >= 10000) {
    return Math.round(value / 1000) / 10 + "만";
  }

  return value.toLocaleString("ko-KR");
}

export function renderCalendar(records, viewDate) {

  const grid = document.getElementById("calendarGrid");

  if (!grid) return;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);

  const firstDay = firstDate.getDay();
  const lastDay = lastDate.getDate();

  const weekNames = ["일", "월", "화", "수", "목", "금", "토"];

  let html = "";

  weekNames.forEach(day => {
    html += `
      <div class="day-name">
        ${day}
      </div>
    `;
  });

  for (let i = 0; i < firstDay; i++) {
    html += `
      <div class="calendar-day blank"></div>
    `;
  }

  for (let day = 1; day <= lastDay; day++) {

    const date =
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const dayRecords =
      records.filter(r => r.date === date);

    const expense =
      dayRecords
        .filter(r => r.type === "expense")
        .reduce((sum, r) => sum + Number(r.amount), 0);

    const income =
      dayRecords
        .filter(r => r.type !== "expense")
        .reduce((sum, r) => sum + Number(r.amount), 0);

    let moneyText = "";

    if (expense > 0) {
      moneyText += `
        <div class="day-money">
          -${shortMoney(expense)}
        </div>
      `;
    }

    if (income > 0) {
      moneyText += `
        <div class="day-money day-income">
          +${shortMoney(income)}
        </div>
      `;
    }

    const hasRecord = dayRecords.length > 0;

    html += `
      <button
        class="calendar-day ${hasRecord ? "has" : ""}"
        data-date="${date}"
      >
        <div class="day-num">
          ${day}
        </div>

        <div>
          ${moneyText}
        </div>
      </button>
    `;
  }

  grid.innerHTML = html;

  document.querySelectorAll(".calendar-day[data-date]")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        selectedCalendarDate =
          btn.dataset.date;

        renderSelectedDate(records);
        updateSelectedStyle();
      });

    });

  updateSelectedStyle();
}

function updateSelectedStyle() {

  document
    .querySelectorAll(".calendar-day[data-date]")
    .forEach(el => {

      el.classList.remove("selected");

      if (
        el.dataset.date === selectedCalendarDate
      ) {
        el.classList.add("selected");
      }

    });

}

export function renderSelectedDate(records) {

  const title =
    document.getElementById("selectedDateTitle");

  const list =
    document.getElementById("selectedDateList");

  if (!selectedCalendarDate) {

    title.textContent =
      "날짜를 선택하세요";

    list.innerHTML = `
      <div class="empty">
        달력에서 날짜를 선택하세요
      </div>
    `;

    return;
  }

  title.textContent =
    selectedCalendarDate;

  const dayRecords =
    records
      .filter(r => r.date === selectedCalendarDate)
      .sort((a, b) => b.id - a.id);

  if (!dayRecords.length) {

    list.innerHTML = `
      <div class="empty">
        기록 없음
      </div>
    `;

    return;
  }

  list.innerHTML =
    dayRecords.map(r => {

      const sign =
        r.type === "expense" ? "-" : "+";

      const cls =
        r.type === "expense"
          ? "minus"
          : "plus";

      return `
        <div class="list-item">

          <div>

            <div class="item-main">
              ${r.memo || r.category}
            </div>

            <div class="item-sub">
              ${r.category}
            </div>

          </div>

          <div class="item-money ${cls}">
            ${sign}${Number(r.amount).toLocaleString("ko-KR")}원
          </div>

        </div>
      `;

    }).join("");
}
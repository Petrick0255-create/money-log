export let selectedCalendarDate = null;

export function shortMoney(value) {
  value = Number(value);
  if (value >= 10000) return Math.round(value / 1000) / 10 + "만";
  return value.toLocaleString("ko-KR");
}

export function renderCalendar(records, viewDate) {
  const grid = document.getElementById("calendarGrid");
  if (!grid) return;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  const weekNames = ["일", "월", "화", "수", "목", "금", "토"];

  let html = weekNames.map(d => `<div class="day-name">${d}</div>`).join("");

  for (let i = 0; i < first.getDay(); i++) {
    html += `<div class="calendar-day blank"></div>`;
  }

  for (let d = 1; d <= last.getDate(); d++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayRecords = records.filter(r => r.date === date);

    const expense = dayRecords.filter(r => r.type === "expense").reduce((s, r) => s + Number(r.amount), 0);
    const income = dayRecords.filter(r => r.type !== "expense").reduce((s, r) => s + Number(r.amount), 0);

    html += `
      <button class="calendar-day ${dayRecords.length ? "has" : ""} ${selectedCalendarDate === date ? "selected" : ""}" data-date="${date}">
        <div class="day-num">${d}</div>
        <div>
          ${expense ? `<div class="day-money">-${shortMoney(expense)}</div>` : ""}
          ${income ? `<div class="day-money day-income">+${shortMoney(income)}</div>` : ""}
        </div>
      </button>
    `;
  }

  grid.innerHTML = html;

  document.querySelectorAll(".calendar-day[data-date]").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedCalendarDate = btn.dataset.date;
      renderCalendar(records, viewDate);
      renderSelectedDate(records);
    });
  });

  renderSelectedDate(records);
}

export function renderSelectedDate(records) {
  const title = document.getElementById("selectedDateTitle");
  const list = document.getElementById("selectedDateList");

  if (!selectedCalendarDate) {
    title.textContent = "날짜를 선택하세요";
    list.innerHTML = `<div class="empty">달력에서 날짜를 선택하세요</div>`;
    return;
  }

  title.textContent = selectedCalendarDate;

  const data = records.filter(r => r.date === selectedCalendarDate).sort((a, b) => Number(b.id) - Number(a.id));

  if (!data.length) {
    list.innerHTML = `<div class="empty">기록 없음</div>`;
    return;
  }

  list.innerHTML = data.map(r => {
    const sign = r.type === "expense" ? "-" : "+";
    const cls = r.type === "expense" ? "minus" : "plus";

    return `
      <div class="list-item">
        <div>
          <div class="item-main">${r.memo || r.category}</div>
          <div class="item-sub">${r.category}</div>
        </div>
        <div class="item-money ${cls}">${sign}${Number(r.amount).toLocaleString("ko-KR")}원</div>
        <button class="more-btn" data-id="${r.id}">⋯</button>
      </div>
    `;
  }).join("");
}
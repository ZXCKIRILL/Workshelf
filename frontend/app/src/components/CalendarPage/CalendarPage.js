import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import "./calendar.css";

const WEEK_DAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

function getWeekStart(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());

  const weekStart = useMemo(() => getWeekStart(date), [date]);
  const weekEnd = useMemo(() => addDays(weekStart, 7), [weekStart]);
  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const HOURS_FROM = 9;
  const HOURS_TO = 22;
  const hours = useMemo(
    () => Array.from({ length: HOURS_TO - HOURS_FROM + 1 }, (_, i) => HOURS_FROM + i),
    []
  );

  const onPrevWeek = () => setDate((prev) => addDays(prev, -7));
  const onNextWeek = () => setDate((prev) => addDays(prev, 7));

  const goToUsers = () => navigate("/users");

  return (
    <Layout>
      <div className="calendarMain">
        <header className="topbar">
          <div className="pageTitle">календарь</div>

          <div className="topbarRight">
            <div
              className="avatarTop"
              role="button"
              tabIndex={0}
              onClick={goToUsers}
              onKeyDown={(e) => e.key === "Enter" && goToUsers()}
              title="Профиль"
            />
            <div className="userBadgeTop" />
          </div>
        </header>

        <div className="calStage">
          <div className="calSheet">
            <div className="calInnerBar">
              <button className="innerBtn" type="button" title="Домой">⌂</button>
              <button className="innerBtn" type="button" title="Календарь">📅</button>
              <button className="innerBtn" type="button" title="Список">≡</button>
              <button className="innerBtn" type="button" title="Чат">💬</button>
            </div>

            <div className="calHeadRow">
              <button className="chev" type="button" onClick={onPrevWeek}>‹</button>
              <div className="calRange">
                {formatDate(weekStart)} - {formatDate(weekEnd)}
              </div>
              <button className="chev" type="button" onClick={onNextWeek}>›</button>
            </div>

            <div className="calDaysRow">
              <div className="timeStub" />
              {weekDates.map((_, i) => (
                <div key={i} className="dayHeaderCell">{WEEK_DAYS[i]}</div>
              ))}
            </div>

            <div className="calGrid">
              <div className="timeCol">
                {hours.map((h) => (
                  <div key={h} className="timeCell">{h}.00</div>
                ))}
              </div>

              <div className="daysArea">
                {weekDates.map((_, col) => (
                  <div key={col} className="dayCol">
                    {hours.map((h) => (
                      <div key={h} className="gridCell" />
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

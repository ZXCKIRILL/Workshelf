import React, { useMemo, useState, useEffect } from "react";
import "./calendar.css";
import Sidebar from "../HomePage/Sidebar";
import api from "../../api";

const TYPES = [
  { id: "task", label: "Задача" },
  { id: "call", label: "Звонок" },
  { id: "meeting", label: "Встреча" },
  { id: "doc", label: "Документы" },
];

const WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function formatTime(t) {
  const h = Math.floor(t);
  const m = Math.round((t - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

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

function sameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function MiniMonth({ value, onPick }) {
  const year = value.getFullYear();
  const month = value.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  const firstWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = last.getDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const monthName = value.toLocaleString("ru-RU", { month: "long" });

  return (
    <div className="miniMonth">
      <div className="miniHead">
        <div className="miniTitle">{monthName} {year}</div>
      </div>

      <div className="miniWeek">
        {WEEK_DAYS.map((w) => (
          <div key={w} className="miniWeekDay">{w}</div>
        ))}
      </div>

      <div className="miniGrid">
        {cells.map((d, idx) => (
          <button
            key={idx}
            type="button"
            className={`miniCell ${d && sameDate(d, value) ? "active" : ""} ${!d ? "empty" : ""}`}
            onClick={() => d && onPick(d)}
            disabled={!d}
          >
            {d ? d.getDate() : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

function TypeFilter({ selected, onToggle }) {
  return (
    <div className="typeBox">
      <div className="typeTitle">Задачи</div>
      <div className="typeList">
        {TYPES.map((t) => {
          const checked = selected.includes(t.id);
          return (
            <label key={t.id} className="typeItem">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(t.id)}
              />
              <span>{t.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [active, setActive] = useState("calendar");
  const [view, setView] = useState("week");
  const [date, setDate] = useState(new Date());
  const [types, setTypes] = useState(TYPES.map((t) => t.id));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const weekStart = useMemo(() => getWeekStart(date), [date]);
  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/tasks');
        const tasksData = response.data;

        const calendarEvents = tasksData.map(task => {
          const startDate = new Date(task.startDate);
          const endDate = new Date(task.endDate);
          const dayIndex = (startDate.getDay() + 6) % 7;
          const startHour = startDate.getHours() + startDate.getMinutes() / 60;
          const endHour = endDate.getHours() + endDate.getMinutes() / 60;
          
          return {
            id: task.id,
            dayIndex,
            start: startHour,
            end: endHour,
            title: task.title,
            type: "task",
            description: task.description,
            priority: task.priority,
            status: task.status
          };
        });

        setTasks(tasksData);
        setEvents(calendarEvents);
      } catch (error) {
        console.error("Ошибка загрузки задач:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [date]);

  const filteredEvents = useMemo(
    () => events.filter((e) => types.includes(e.type)),
    [events, types]
  );

  const HOURS_FROM = 9;
  const HOURS_TO = 22;
  const hourRows = Array.from({ length: HOURS_TO - HOURS_FROM + 1 }, (_, i) => HOURS_FROM + i);

  const onPrevWeek = () => setDate(addDays(date, -7));
  const onNextWeek = () => setDate(addDays(date, 7));

  const toggleType = (id) => {
    setTypes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleCreateTask = async () => {
    try {
      const newTask = {
        title: "Новая задача",
        description: "Описание новой задачи",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        createdBy: 1,
        status: "NotReady",
        priority: 1
      };

      const response = await api.post('/tasks', newTask);
      setTasks(prev => [...prev, response.data]);

      const startDate = new Date(response.data.startDate);
      const endDate = new Date(response.data.endDate);
      const dayIndex = (startDate.getDay() + 6) % 7;
      const startHour = startDate.getHours() + startDate.getMinutes() / 60;
      const endHour = endDate.getHours() + endDate.getMinutes() / 60;
      
      setEvents(prev => [...prev, {
        id: response.data.id,
        dayIndex,
        start: startHour,
        end: endHour,
        title: response.data.title,
        type: "task"
      }]);
      
    } catch (error) {
      console.error("Ошибка создания задачи:", error);
    }
  };

  return (
    <div className="calendarWrap">
      <Sidebar activeId={active} onSelect={setActive} />
      <div className="calendarMain">
        <header className="calTopbar">
          <div className="calTitle">Все дела</div>
          <div className="calTopRight">
            <div className="calViewTabs">
              <button type="button" className={`tab ${view === "day" ? "active" : ""}`} onClick={() => setView("day")}>
                День
              </button>
              <button type="button" className={`tab ${view === "week" ? "active" : ""}`} onClick={() => setView("week")}>
                Неделя
              </button>
              <button type="button" className={`tab ${view === "month" ? "active" : ""}`} onClick={() => setView("month")}>
                Месяц
              </button>
            </div>
            <button className="createBtn" type="button" onClick={handleCreateTask}>
              Создать дело
            </button>
          </div>
        </header>

        <div className="calBody">
          <aside className="calLeft">
            <MiniMonth value={date} onPick={setDate} />
            <TypeFilter selected={types} onToggle={toggleType} />
          </aside>

          <section className="calCenter">
            <div className="weekHeader">
              <button type="button" className="navBtn" onClick={onPrevWeek}>‹</button>
              <div className="weekRange">
                {weekStart.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })} —{" "}
                {addDays(weekStart, 6).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
              </div>
              <button type="button" className="navBtn" onClick={onNextWeek}>›</button>
            </div>

            <div className="gridWrap">
              {loading ? (
                <div className="loading">Загрузка задач...</div>
              ) : (
                <>
                  <div className="gridHeader">
                    <div className="timeColHeader" />
                    {weekDates.map((d, i) => (
                      <div key={i} className="dayColHeader">
                        <div className="dayName">{WEEK_DAYS[i]}</div>
                        <div className="dayDate">{String(d.getDate()).padStart(2, "0")}</div>
                      </div>
                    ))}
                  </div>

                  <div className="gridBody">
                    <div className="timeCol">
                      {hourRows.map((h) => (
                        <div key={h} className="timeCell">{String(h).padStart(2, "0")}:00</div>
                      ))}
                    </div>

                    <div className="daysCols">
                      {weekDates.map((_, dayIndex) => (
                        <div key={dayIndex} className="dayCol">
                          {hourRows.map((h) => (
                            <div key={h} className="hourCell" />
                          ))}

                          {filteredEvents
                            .filter((e) => e.dayIndex === dayIndex)
                            .map((e) => {
                              const topHours = clamp(e.start - HOURS_FROM, 0, HOURS_TO - HOURS_FROM);
                              const heightHours = clamp(e.end - e.start, 0.25, 24);
                              return (
                                <div
                                  key={e.id}
                                  className={`eventCard type-${e.type}`}
                                  style={{
                                    top: `calc(${topHours} * var(--hour-h))`,
                                    height: `calc(${heightHours} * var(--hour-h))`,
                                  }}
                                  title={`${formatTime(e.start)}–${formatTime(e.end)} • ${e.title}`}
                                >
                                  <div className="eventTitle">{e.title}</div>
                                  <div className="eventTime">{formatTime(e.start)}–{formatTime(e.end)}</div>
                                </div>
                              );
                            })}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
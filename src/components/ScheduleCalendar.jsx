import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, List, LayoutGrid } from "lucide-react";

const CATEGORY_STYLES = {
  심리상담: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  프로그램: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-500" },
  문화체험: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  건강관리: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
  생활행사: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  자원봉사: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", dot: "bg-teal-500" }
};

function getStyle(category) {
  return CATEGORY_STYLES[category] || {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-[#28b899]"
  };
}

function toYmd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getEventsForDate(date, schedules) {
  const ymd = toYmd(date);
  const dow = date.getDay();
  return schedules.filter((sch) => {
    if (sch.dateStr && sch.dateStr === ymd) return true;
    if (Array.isArray(sch.repeatDays) && sch.repeatDays.includes(dow)) return true;
    return false;
  });
}

export default function ScheduleCalendar({ schedules = [] }) {
  const today = useMemo(() => new Date(), []);
  const [viewMode, setViewMode] = useState("month"); // month | week | day | list
  const [cursorDate, setCursorDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredSchedules = useMemo(() => {
    if (categoryFilter === "all") return schedules;
    return schedules.filter((s) => s.category === categoryFilter);
  }, [schedules, categoryFilter]);

  const categories = useMemo(() => {
    const set = new Set(schedules.map((s) => s.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [schedules]);

  const handleToday = () => {
    const now = new Date();
    setCursorDate(now);
    setSelectedDate(now);
  };

  const handlePrev = () => {
    const d = new Date(cursorDate);
    if (viewMode === "month") d.setMonth(d.getMonth() - 1);
    else if (viewMode === "week") d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCursorDate(d);
    if (viewMode === "day") setSelectedDate(d);
  };

  const handleNext = () => {
    const d = new Date(cursorDate);
    if (viewMode === "month") d.setMonth(d.getMonth() + 1);
    else if (viewMode === "week") d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCursorDate(d);
    if (viewMode === "day") setSelectedDate(d);
  };

  // 월간 캘린더 셀 (이전/다음 달 여백 포함 35 or 42칸)
  const monthCells = useMemo(() => {
    const y = cursorDate.getFullYear();
    const m = cursorDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const prevMonthLast = new Date(y, m, 0).getDate();
    const cells = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ date: new Date(y, m - 1, prevMonthLast - i), isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(y, m, d), isCurrentMonth: true });
    }
    while (cells.length % 7 !== 0) {
      const nextIdx = cells.length - (firstDay + daysInMonth) + 1;
      cells.push({ date: new Date(y, m + 1, nextIdx), isCurrentMonth: false });
    }
    return cells;
  }, [cursorDate]);

  // 주간 캘린더 7일
  const weekDays = useMemo(() => {
    const start = new Date(cursorDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [cursorDate]);

  const headerLabel = useMemo(() => {
    if (viewMode === "month" || viewMode === "list") {
      return `${cursorDate.getFullYear()} . ${String(cursorDate.getMonth() + 1).padStart(2, "0")}`;
    }
    if (viewMode === "week") {
      const first = weekDays[0];
      const last = weekDays[6];
      return `${first.getMonth() + 1}월 ${first.getDate()}일 ~ ${last.getMonth() + 1}월 ${last.getDate()}일`;
    }
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    return `${cursorDate.getFullYear()}년 ${cursorDate.getMonth() + 1}월 ${cursorDate.getDate()}일 (${dayNames[cursorDate.getDay()]})`;
  }, [viewMode, cursorDate, weekDays]);

  const selectedDayEvents = useMemo(
    () => getEventsForDate(selectedDate, filteredSchedules),
    [selectedDate, filteredSchedules]
  );

  const dayHeaders = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8 max-w-6xl mx-auto">
      {/* 상단 툴바: 구글 캘린더 스타일 네비게이션 + 보기 전환 */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            오늘
          </button>
          <div className="flex items-center gap-1.5">
            <button onClick={handlePrev} className="saeron-cal-nav" aria-label="이전">
              <ChevronLeft size={16} />
            </button>
            <button onClick={handleNext} className="saeron-cal-nav" aria-label="다음">
              <ChevronRight size={16} />
            </button>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 ml-1 tracking-tight">
            {headerLabel}
          </h2>
        </div>

        {/* 보기 전환 (월간 / 주간 / 일간 / 목록) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: "month", label: "월간" },
            { id: "week", label: "주간" },
            { id: "day", label: "일간" },
            { id: "list", label: "목록" }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setViewMode(m.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === m.id
                  ? "bg-[#28b899] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              categoryFilter === cat
                ? "bg-[#eefaf7] border-[#28b899] text-[#16846d]"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat === "all" ? "전체 일정" : cat}
          </button>
        ))}
      </div>

      {/* 1. 월간 보기 (새론 스타일 대형 그리드 + 일정 칩) */}
      {viewMode === "month" && (
        <div>
          <div className="border-t-2 border-t-[#28b899] border-x border-b border-slate-200 rounded-b-xl overflow-hidden">
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
              {dayHeaders.map((d, idx) => (
                <div
                  key={d}
                  className={`py-2.5 text-center text-xs font-bold border-r last:border-r-0 border-slate-200 ${
                    idx === 0 ? "text-rose-500" : idx === 6 ? "text-sky-500" : "text-slate-700"
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {monthCells.map((cell, idx) => {
                const ymd = toYmd(cell.date);
                const isTodayCell = ymd === toYmd(today);
                const isSelectedCell = ymd === toYmd(selectedDate);
                const dayEvents = getEventsForDate(cell.date, filteredSchedules);
                const dow = cell.date.getDay();

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedDate(cell.date);
                    }}
                    className={`min-h-[96px] md:min-h-[115px] p-1.5 border-r border-b border-slate-200 cursor-pointer transition-colors ${
                      idx % 7 === 6 ? "border-r-0" : ""
                    } ${!cell.isCurrentMonth ? "bg-slate-50/70" : isSelectedCell ? "bg-[#eefaf7]/50" : "bg-white hover:bg-slate-50/70"}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full ${
                          isTodayCell
                            ? "bg-[#28b899] text-white"
                            : !cell.isCurrentMonth
                              ? "text-slate-300"
                              : dow === 0
                                ? "text-rose-500"
                                : dow === 6
                                  ? "text-sky-500"
                                  : "text-slate-700"
                        }`}
                      >
                        {cell.date.getDate()}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
                          {dayEvents.length}건
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((ev) => {
                        const st = getStyle(ev.category);
                        return (
                          <div
                            key={ev.id}
                            className={`text-[11px] font-semibold px-1.5 py-0.5 rounded border truncate ${st.bg} ${st.text} ${st.border}`}
                            title={`${ev.time ? ev.time + " " : ""}${ev.title}`}
                          >
                            {ev.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] font-bold text-[#1ea386] pl-1">
                          +{dayEvents.length - 3}건 더보기
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 선택한 날짜의 상세 일정 패널 */}
          <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <CalendarIcon size={16} className="text-[#28b899]" />
                <span>
                  {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 (
                  {dayHeaders[selectedDate.getDay()]}) 일정
                </span>
              </h3>
              <button
                onClick={() => {
                  setCursorDate(selectedDate);
                  setViewMode("day");
                }}
                className="text-xs font-bold text-[#1ea386] hover:underline"
              >
                일간 보기로 크게 보기 →
              </button>
            </div>

            {selectedDayEvents.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">선택한 날짜에 등록된 일정이 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedDayEvents.map((ev) => {
                  const st = getStyle(ev.category);
                  return (
                    <div key={ev.id} className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${st.dot}`}></span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${st.bg} ${st.text}`}>
                            {ev.category}
                          </span>
                          {ev.time && (
                            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                              <Clock size={11} /> {ev.time}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-sm text-slate-900">{ev.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">대상: {ev.target || "전체 아동"}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. 주간 보기 */}
      {viewMode === "week" && (
        <div className="grid grid-cols-1 md:grid-cols-7 border-t-2 border-t-[#28b899] border-x border-b border-slate-200 rounded-b-xl overflow-hidden">
          {weekDays.map((d, idx) => {
            const isTodayCell = toYmd(d) === toYmd(today);
            const dayEvents = getEventsForDate(d, filteredSchedules);
            return (
              <div
                key={idx}
                className="min-h-[240px] border-b md:border-b-0 md:border-r last:border-r-0 border-slate-200 flex flex-col"
              >
                <div
                  onClick={() => {
                    setSelectedDate(d);
                    setCursorDate(d);
                    setViewMode("day");
                  }}
                  className={`p-3 text-center border-b border-slate-200 cursor-pointer ${
                    isTodayCell ? "bg-[#eefaf7]" : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div
                    className={`text-xs font-bold ${
                      idx === 0 ? "text-rose-500" : idx === 6 ? "text-sky-500" : "text-slate-500"
                    }`}
                  >
                    {dayHeaders[idx]}
                  </div>
                  <div
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-extrabold mt-1 ${
                      isTodayCell ? "bg-[#28b899] text-white" : "text-slate-800"
                    }`}
                  >
                    {d.getDate()}
                  </div>
                </div>

                <div className="p-2.5 space-y-2 flex-1 bg-white">
                  {dayEvents.length === 0 ? (
                    <div className="text-[11px] text-slate-300 text-center py-6">일정 없음</div>
                  ) : (
                    dayEvents.map((ev) => {
                      const st = getStyle(ev.category);
                      return (
                        <div key={ev.id} className={`p-2 rounded-lg border text-xs ${st.bg} ${st.border}`}>
                          <div className={`font-bold text-[10px] ${st.text}`}>{ev.category}</div>
                          <div className="font-bold text-slate-900 mt-0.5 leading-snug">{ev.title}</div>
                          {ev.time && <div className="text-[10px] text-slate-500 mt-1">{ev.time}</div>}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. 일간 보기 */}
      {viewMode === "day" && (
        <div className="border-t-2 border-t-[#28b899] border border-slate-200 rounded-xl p-6 bg-slate-50/50">
          <div className="space-y-3">
            {getEventsForDate(cursorDate, filteredSchedules).length === 0 ? (
              <div className="text-center py-14 text-slate-400 text-sm">
                해당 날짜에 예정된 일정이 없습니다.
              </div>
            ) : (
              getEventsForDate(cursorDate, filteredSchedules).map((ev) => {
                const st = getStyle(ev.category);
                return (
                  <div
                    key={ev.id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="px-3.5 py-2 rounded-lg bg-[#eefaf7] text-[#16846d] text-xs font-extrabold min-w-[110px] text-center">
                        {ev.time || "종일 일정"}
                      </div>
                      <div>
                        <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded mb-1 ${st.bg} ${st.text}`}>
                          {ev.category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base">{ev.title}</h4>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full font-semibold self-start sm:self-center">
                      <Users size={12} /> 대상: {ev.target || "전체 아동"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 4. 목록 보기 */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {filteredSchedules.map((sch) => {
            const st = getStyle(sch.category);
            return (
              <div
                key={sch.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#28b899] transition-colors flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="px-3 py-2 rounded-lg bg-[#28b899] text-white text-xs font-extrabold min-w-[110px] text-center">
                    {sch.date || sch.dateStr}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${st.bg} ${st.text}`}>
                        {sch.category}
                      </span>
                      {sch.time && <span className="text-xs text-slate-500">{sch.time}</span>}
                    </div>
                    <h4 className="font-bold text-slate-900 text-base mt-0.5">{sch.title}</h4>
                  </div>
                </div>
                <span className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-full font-semibold">
                  대상: {sch.target || "전체 아동"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

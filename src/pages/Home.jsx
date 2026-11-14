import React, { useState, useEffect } from "react";
import {
  Award, MessageSquare, Monitor, Puzzle, FileText,
  Plus, ChevronLeft, ChevronRight, Phone, Heart, Copy, MapPin, ArrowRight
} from "lucide-react";
import { FACILITY_INFO, INITIAL_BANNERS, INITIAL_SCHEDULES } from "../data/initialData";
import { fetchPosts, fetchBanners } from "../services/firebase";

export default function Home({ setRoute, openPostDetail }) {
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [noticePosts, setNoticePosts] = useState([]);
  const [galleryPosts, setGalleryPosts] = useState([]);

  // 달력 상태 (현재 월 기준)
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth()); // 0-indexed

  useEffect(() => {
    fetchBanners(true).then((data) => {
      if (data && data.length > 0) setBanners(data);
    });
    fetchPosts().then((data) => {
      setNoticePosts(data.filter((p) => p.category !== "gallery").slice(0, 5));
      setGalleryPosts(data.filter((p) => p.category === "gallery").slice(0, 4));
    });
  }, []);

  // 배너 자동 슬라이드 (6초)
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, banners.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalYear((y) => y - 1);
      setCalMonth(11);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalYear((y) => y + 1);
      setCalMonth(0);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  // 달력 날짜 배열 생성
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  const isToday = (day) =>
    day &&
    calYear === today.getFullYear() &&
    calMonth === today.getMonth() &&
    day === today.getDate();

  const copyAccount = () => {
    const acc = `${FACILITY_INFO.donationAccount.bank} ${FACILITY_INFO.donationAccount.accountNumber}`;
    navigator.clipboard.writeText(acc);
    alert(`새볕원 공식 후원계좌가 복사되었습니다!\n${acc} (예금주: ${FACILITY_INFO.donationAccount.holder})`);
  };

  const aboutCards = [
    {
      title: "새볕원 소개",
      icon: Award,
      page: "about",
      tab: "about-greeting"
    },
    {
      title: "서비스 소개",
      icon: MessageSquare,
      page: "services",
      tab: "srv-admission"
    },
    {
      title: "새볕 소식",
      icon: Monitor,
      page: "board",
      tab: "board-notice"
    },
    {
      title: "후원 및 자원봉사",
      icon: Puzzle,
      page: "support",
      tab: "sup-donation"
    },
    {
      title: "법인소개",
      icon: FileText,
      page: "about",
      tab: "about-foundation"
    }
  ];

  const activeBanner = banners[currentSlide] || INITIAL_BANNERS[0];

  return (
    <div className="home-page bg-white">
      {/* 1. 새론 스타일 풀-와이드 메인 히어로 배너 슬라이더 (관리자에서 이미지·문구 수정 가능) */}
      <section
        className="saeron-hero-slider"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="saeron-hero-slide"
          style={{ backgroundImage: `url('${activeBanner.image || "/images/banner_real_2.jpg"}')` }}
        >
          <div className="saeron-hero-overlay"></div>

          <div className="container relative z-10 h-full flex flex-col justify-center">
            <div className="max-w-2xl text-white">
              <div className="saeron-hero-eyebrow">
                <span>{activeBanner.subtitle || "아동일시보호시설 새볕원"}</span>
                <span className="saeron-eyebrow-line"></span>
              </div>

              <h1 className="saeron-hero-title">
                {(activeBanner.title || "").split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < (activeBanner.title || "").split("\n").length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h1>

              {activeBanner.description && (
                <p className="saeron-hero-desc">{activeBanner.description}</p>
              )}

              {activeBanner.linkText && (
                <div className="mt-6">
                  <button
                    onClick={() =>
                      setRoute({
                        page: activeBanner.linkPage || "services",
                        tab: activeBanner.linkTab || "srv-admission"
                      })
                    }
                    className="saeron-hero-cta"
                  >
                    <span>{activeBanner.linkText}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 좌우 화살표 버튼 (새론 스타일) */}
          {banners.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="saeron-slider-arrow left-0"
                aria-label="이전 배너"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="saeron-slider-arrow right-0"
                aria-label="다음 배너"
              >
                <ChevronRight size={20} />
              </button>

              {/* 인디케이터 점 */}
              <div className="saeron-slider-dots">
                {banners.map((b, idx) => (
                  <button
                    key={b.id || idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`saeron-dot ${idx === currentSlide ? "active" : ""}`}
                    aria-label={`배너 ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 2. 새론 스타일 ABOUT US 섹션 (민트 타이틀 + 5개 아이콘 카드 + Read More 버튼) */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="saeron-about-heading">ABOUT US</h2>
            <p className="text-slate-600 text-[15px] leading-relaxed mt-3">
              &lsquo;아동일시보호시설 새볕원&rsquo; 임직원은<br />
              &lsquo;아이들 스스로 빛나는 존재&rsquo;가 될 수 있도록 최선을 다하겠습니다.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {aboutCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setRoute({ page: card.page, tab: card.tab })}
                  className="saeron-about-card group cursor-pointer"
                >
                  <div className="saeron-about-icon">
                    <IconComp size={42} strokeWidth={1.35} />
                  </div>
                  <h3 className="saeron-about-title">{card.title}</h3>
                  <span className="saeron-readmore-btn">Read More</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 새론 스타일 3단 대시보드 카드 (공지사항 | 일정 안내 달력 | 새볕 갤러리 2x2) */}
      <section className="pb-16 md:pb-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 카드 1: 공지사항 */}
            <div className="saeron-board-card">
              <div className="saeron-board-card-header">
                <h3>공지사항</h3>
                <button
                  onClick={() => setRoute({ page: "board", tab: "board-notice" })}
                  className="saeron-plus-btn"
                  title="공지사항 더보기"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="saeron-notice-table-head">
                <span>제목</span>
                <span>작성일</span>
              </div>

              <div className="divide-y divide-slate-100">
                {noticePosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => openPostDetail(post)}
                    className="saeron-notice-row cursor-pointer"
                  >
                    <span className="saeron-notice-title">{post.title}</span>
                    <span className="saeron-notice-date">{post.createdAt}</span>
                  </div>
                ))}
                {noticePosts.length === 0 && (
                  <div className="py-10 text-center text-sm text-slate-400">
                    등록된 공지사항이 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 카드 2: 일정 안내 (새론 스타일 미니 월간 달력) */}
            <div className="saeron-board-card">
              <div className="saeron-board-card-header">
                <h3>일정 안내</h3>
                <button
                  onClick={() => setRoute({ page: "board", tab: "board-schedule" })}
                  className="saeron-plus-btn"
                  title="일정 안내 전체보기"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 my-3">
                <button onClick={prevMonth} className="saeron-cal-nav" aria-label="이전 달">
                  <ChevronLeft size={16} />
                </button>
                <div className="text-2xl font-bold text-slate-800 tracking-tight">
                  {calYear} . {String(calMonth + 1).padStart(2, "0")}
                </div>
                <button onClick={nextMonth} className="saeron-cal-nav" aria-label="다음 달">
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="saeron-calendar-grid">
                {["일", "월", "화", "수", "목", "금", "토"].map((d, idx) => (
                  <div
                    key={d}
                    className={`saeron-cal-weekday ${
                      idx === 0 ? "text-rose-400" : idx === 6 ? "text-sky-500" : "text-slate-500"
                    }`}
                  >
                    {d}
                  </div>
                ))}

                {calendarCells.map((day, idx) => {
                  const hasEvent = day && (day === 14 || day === 20 || day === 25 || day === 28);
                  return (
                    <div
                      key={idx}
                      onClick={() => day && setRoute({ page: "board", tab: "board-schedule" })}
                      className={`saeron-cal-cell ${day ? "cursor-pointer hover:bg-emerald-50" : ""}`}
                    >
                      {day && (
                        <span
                          className={`saeron-cal-day ${
                            isToday(day)
                              ? "today"
                              : idx % 7 === 0
                                ? "text-rose-400"
                                : idx % 7 === 6
                                  ? "text-sky-500"
                                  : "text-slate-700"
                          }`}
                        >
                          {day}
                        </span>
                      )}
                      {hasEvent && !isToday(day) && <span className="saeron-cal-dot"></span>}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>이번 달 주요 일정 {INITIAL_SCHEDULES.length}건</span>
                <button
                  onClick={() => setRoute({ page: "board", tab: "board-schedule" })}
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  상세 일정 보기 →
                </button>
              </div>
            </div>

            {/* 카드 3: 새볕 갤러리 (2x2 썸네일 그리드) */}
            <div className="saeron-board-card">
              <div className="saeron-board-card-header">
                <h3>새볕 갤러리</h3>
                <button
                  onClick={() => setRoute({ page: "board", tab: "board-gallery" })}
                  className="saeron-plus-btn"
                  title="갤러리 더보기"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3.5 mt-2">
                {galleryPosts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openPostDetail(item)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                      <img
                        src={item.image || "/images/saebyeotwon.jpg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-xs font-medium text-slate-700 mt-1.5 truncate group-hover:text-emerald-600">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 하단 깔끔한 후원 및 긴급보호 상담 안내 바 */}
      <section className="py-12 bg-slate-50 border-t border-slate-200/70">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 후원계좌 안내 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-1">
                  <Heart size={14} />
                  <span>아이들의 내일을 응원하는 후원 안내</span>
                </div>
                <div className="text-lg font-extrabold text-slate-900">
                  {FACILITY_INFO.donationAccount.bank} {FACILITY_INFO.donationAccount.accountNumber}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  예금주: {FACILITY_INFO.donationAccount.holder} • 법정/지정기부금 세액공제 가능
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={copyAccount}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
                >
                  <Copy size={13} />
                  <span>계좌복사</span>
                </button>
                <button
                  onClick={() => setRoute({ page: "support", tab: "sup-donation" })}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#28b899] hover:bg-[#1ea386] transition-colors"
                >
                  후원 신청
                </button>
              </div>
            </div>

            {/* 긴급보호 상담 및 오시는 길 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-1">
                  <Phone size={14} />
                  <span>24시간 아동 긴급 일시보호 · 상담 문의</span>
                </div>
                <div className="text-lg font-extrabold text-slate-900">
                  {FACILITY_INFO.phone}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin size={12} />
                  <span>{FACILITY_INFO.address}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setRoute({ page: "about", tab: "about-location" })}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  오시는 길
                </button>
                <button
                  onClick={() => setRoute({ page: "services", tab: "srv-admission" })}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors"
                >
                  입소절차 안내
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

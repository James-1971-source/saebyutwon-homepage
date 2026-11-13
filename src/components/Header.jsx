import React, { useState } from "react";
import {
  Heart, Phone, Lock, Menu, X, ChevronDown,
  ZoomIn, ZoomOut, RotateCcw, ExternalLink, Sparkles
} from "lucide-react";
import { FACILITY_INFO } from "../data/initialData";
import { SaebyeotwonLogo } from "./Logos";

export default function Header({ currentRoute, setRoute, fontSize, setFontSize }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 대전아동일시보호시설 '새론' 스타일 5대 대메뉴 체계
  const menuStructure = [
    {
      id: "about",
      label: "새볕원 소개",
      subItems: [
        { label: "인사말", target: "about-greeting" },
        { label: "설립목적 · 미션 · 핵심가치", target: "about-mission" },
        { label: "연혁 (70년 발자취)", target: "about-history" },
        { label: "조직도", target: "about-org" },
        { label: "시설현황 (둘러보기)", target: "about-facility" },
        { label: "법인소개 (새볕재단)", target: "about-foundation" },
        { label: "오시는 길", target: "about-location" }
      ]
    },
    {
      id: "services",
      label: "보호 및 서비스 안내",
      subItems: [
        { label: "입소대상 및 입·퇴소 절차", target: "srv-admission" },
        { label: "아동 심리상담 및 치유", target: "srv-counseling" },
        { label: "아동 건강 · 생활관리", target: "srv-health" },
        { label: "프로그램 지원 안내", target: "srv-programs" }
      ]
    },
    {
      id: "board",
      label: "새볕 소식",
      subItems: [
        { label: "공지사항 (회의록·공고)", target: "board-notice" },
        { label: "새볕 갤러리 (활동소식)", target: "board-gallery" },
        { label: "일정 안내", target: "board-schedule" },
        { label: "자료실 (서식 다운로드)", target: "board-data" },
        { label: "재정공시 (결산·후원금)", target: "board-finance" }
      ]
    },
    {
      id: "support",
      label: "후원 및 자원봉사",
      subItems: [
        { label: "후원 안내 및 온라인 신청", target: "sup-donation" },
        { label: "자원봉사 안내 및 신청", target: "sup-volunteer" },
        { label: "후원 · 봉사 나눔 갤러리", target: "sup-gallery" }
      ]
    },
    {
      id: "qna",
      label: "소통 · 문의하기",
      subItems: [
        { label: "1:1 온라인 상담문의", target: "qna-contact" },
        { label: "자주 묻는 질문 (FAQ)", target: "qna-faq" }
      ]
    }
  ];

  const handleNavClick = (menuId, subTarget = null) => {
    setRoute({ page: menuId, tab: subTarget });
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* 1. 상단 유틸리티 탑바 */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-left">
            <span className="flex items-center gap-1.5 text-amber-200 font-semibold">
              <Sparkles size={13} />
              <span>사회복지법인 새볕재단 산하 • 아동일시보호시설 새볕원</span>
            </span>
            <span className="hidden md:inline text-stone-500">|</span>
            <span className="hidden md:inline text-stone-300">
              24시간 긴급보호 상담: <strong className="text-white">{FACILITY_INFO.phone}</strong>
            </span>
          </div>

          <div className="top-bar-right">
            <a
              href={FACILITY_INFO.foundationUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-amber-300 hover:text-white transition-colors font-semibold"
            >
              <span>새볕재단 본부</span>
              <ExternalLink size={11} />
            </a>

            {/* 글자 크기 조절 */}
            <div className="font-size-controls">
              <span className="text-[11px] text-stone-300 mr-1">글자크기</span>
              <button
                onClick={() => setFontSize((prev) => Math.min(prev + 1, 20))}
                className="font-btn"
                title="글자 확대"
              >
                <ZoomIn size={13} />
              </button>
              <button
                onClick={() => setFontSize((prev) => Math.max(prev - 1, 14))}
                className="font-btn"
                title="글자 축소"
              >
                <ZoomOut size={13} />
              </button>
              <button
                onClick={() => setFontSize(16)}
                className="font-btn"
                title="기본 크기"
              >
                <RotateCcw size={11} />
              </button>
            </div>

            {/* 관리자모드 바로가기 */}
            <button
              onClick={() => handleNavClick("admin")}
              className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors font-semibold"
            >
              <Lock size={12} className="text-amber-400" />
              <span>관리자센터</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 메인 헤더 & GNB */}
      <header className="header">
        <div className="container header-inner">
          {/* 로고 영역 */}
          <div
            onClick={() => handleNavClick("home")}
            className="logo-area cursor-pointer"
          >
            <SaebyeotwonLogo size="md" showSubtitle={true} />
          </div>

          {/* PC GNB 내비게이션 */}
          <nav className="gnb-nav">
            {menuStructure.map((menu) => (
              <div key={menu.id} className="nav-item">
                <button
                  onClick={() => handleNavClick(menu.id, menu.subItems[0].target)}
                  className={`nav-link ${currentRoute.page === menu.id ? "active" : ""}`}
                >
                  <span>{menu.label}</span>
                  <ChevronDown size={14} className="text-stone-400" />
                </button>

                {/* 서브메뉴 드롭다운 */}
                <div className="sub-menu">
                  {menu.subItems.map((sub, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNavClick(menu.id, sub.target)}
                      className="sub-link text-left w-full"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* 우측 CTA 버튼 */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button
              onClick={() => handleNavClick("services", "srv-admission")}
              className="header-sub-cta-btn"
            >
              <Phone size={14} />
              <span>입소절차 안내</span>
            </button>
            <button
              onClick={() => handleNavClick("support", "sup-donation")}
              className="header-cta-btn"
            >
              <Heart size={15} fill="white" />
              <span>아이들 후원하기</span>
            </button>
          </div>

          {/* 모바일 햄버거 메뉴 버튼 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-800"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* 모바일 드로어 메뉴 */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 shadow-xl px-5 py-6">
            <div className="flex flex-col gap-4">
              {menuStructure.map((menu) => (
                <div key={menu.id} className="border-b border-stone-100 pb-3">
                  <div
                    onClick={() => handleNavClick(menu.id, menu.subItems[0].target)}
                    className="font-bold text-stone-900 text-lg mb-2 flex items-center justify-between cursor-pointer"
                  >
                    <span>{menu.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {menu.subItems.map((sub, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleNavClick(menu.id, sub.target)}
                        className="text-left text-sm text-stone-600 hover:text-orange-600 py-1"
                      >
                        • {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleNavClick("support", "sup-donation")}
                  className="btn-primary w-full py-3"
                >
                  <Heart size={18} fill="white" />
                  <span>아이들 후원하기</span>
                </button>
                <button
                  onClick={() => handleNavClick("admin")}
                  className="btn-secondary w-full py-2.5 text-center text-sm"
                >
                  관리자센터 로그인
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}


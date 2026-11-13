import React, { useState, useEffect } from "react";
import {
  Heart, Users, ArrowRight, Phone, ShieldCheck, Sparkles,
  ChevronRight, Copy, Smile, Stethoscope, BookOpen, Calendar, ClipboardCheck
} from "lucide-react";
import { FACILITY_INFO, ADMISSION_PROCESS, SERVICE_SECTIONS } from "../data/initialData";
import { fetchPosts } from "../services/firebase";
import { SaebyeotFoundationLogo } from "../components/Logos";

export default function Home({ setRoute, openPostDetail }) {
  const [boardTab, setBoardTab] = useState("all");
  const [posts, setPosts] = useState([]);
  const [galleryPosts, setGalleryPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then((data) => {
      setPosts(data.filter((p) => p.category !== "gallery").slice(0, 5));
      setGalleryPosts(data.filter((p) => p.category === "gallery").slice(0, 3));
    });
  }, []);

  const handleTabChange = async (tab) => {
    setBoardTab(tab);
    const data = await fetchPosts(tab === "all" ? null : tab);
    const filtered = tab === "all" ? data.filter((p) => p.category !== "gallery") : data;
    setPosts(filtered.slice(0, 5));
  };

  const copyAccount = () => {
    const acc = `${FACILITY_INFO.donationAccount.bank} ${FACILITY_INFO.donationAccount.accountNumber}`;
    navigator.clipboard.writeText(acc);
    alert(`새볕원 공식 후원계좌가 복사되었습니다!\n${acc} (예금주: ${FACILITY_INFO.donationAccount.holder})`);
  };

  return (
    <div className="home-page">
      {/* 1. 메인 히어로 배너 (새론 스타일: 따뜻하고 포근한 웜 파스텔 감성 슬로건) */}
      <section className="hero-section">
        <div className="hero-warm-bg"></div>
        <div className="hero-blob hero-blob-1"></div>
        <div className="hero-blob hero-blob-2"></div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 hero-content">
              <div className="hero-badge">
                <Sparkles size={14} className="text-orange-600" />
                <span>사회복지법인 새볕재단 • 아동일시보호시설 새볕원</span>
              </div>

              <h1 className="hero-title">
                「아이들의 오늘을 지키고,<br />
                <span>내일을 함께 준비합니다」</span>
              </h1>

              <p className="hero-desc">
                {FACILITY_INFO.subSlogan}<br />
                일시적인 보호가 필요한 아이들에게 상처를 치유하고 새로운 미래를 준비하는 회복과 성장의 시간이 되도록 새볕원이 곁에서 함께 걷겠습니다.
              </p>

              <div className="hero-actions">
                <button
                  onClick={() => setRoute({ page: "services", tab: "srv-admission" })}
                  className="btn-primary"
                  style={{ padding: "14px 28px", fontSize: "15.5px" }}
                >
                  <span>입소대상 및 입·퇴소 절차</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  onClick={() => setRoute({ page: "support", tab: "sup-donation" })}
                  className="btn-warm-outline"
                >
                  <Heart size={17} className="text-rose-500" fill="currentColor" />
                  <span>아이들 후원 참여하기</span>
                </button>
              </div>
            </div>

            {/* 우측: 감성 비주얼 카드 (새론 스타일 둥근 카드 프리뷰) */}
            <div className="lg:col-span-5">
              <div className="hero-visual-card">
                <div className="hero-visual-img-wrap">
                  <img
                    src="/images/saebyeotwon.jpg"
                    alt="아동일시보호시설 새볕원 전경"
                    className="w-full h-64 object-cover"
                  />
                  <div className="hero-visual-tag">24시간 긴급 일시보호</div>
                </div>
                <div className="p-5 bg-white">
                  <div className="text-xs font-bold text-orange-600 mb-1">새볕원 긴급보호 · 상담 안내</div>
                  <div className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
                    <Phone size={18} className="text-orange-600" />
                    <span>{FACILITY_INFO.phone}</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    대구광역시 북구 영송로 36-6 • 팩스 {FACILITY_INFO.fax}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 새론 스타일 4대 퀵 서비스 카드 (히어로 하단 오버랩) */}
      <section className="quick-cards-section">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              onClick={() => setRoute({ page: "services", tab: "srv-admission" })}
              className="saeron-quick-card card-coral cursor-pointer"
            >
              <div className="sqc-icon"><ClipboardCheck size={24} /></div>
              <h3>입소대상 · 절차</h3>
              <p>지자체·경찰·아동보호전문기관 긴급 보호 의뢰 및 입·퇴소 안내</p>
              <span className="sqc-more">자세히 보기 <ChevronRight size={14} /></span>
            </div>

            <div
              onClick={() => setRoute({ page: "services", tab: "srv-counseling" })}
              className="saeron-quick-card card-amber cursor-pointer"
            >
              <div className="sqc-icon"><Smile size={24} /></div>
              <h3>아동 심리상담</h3>
              <p>초기 위기개입 심리검사 및 놀이·미술 치유 프로그램 운영</p>
              <span className="sqc-more">자세히 보기 <ChevronRight size={14} /></span>
            </div>

            <div
              onClick={() => setRoute({ page: "services", tab: "srv-health" })}
              className="saeron-quick-card card-sage cursor-pointer"
            >
              <div className="sqc-icon"><Stethoscope size={24} /></div>
              <h3>건강 · 영유아 돌봄</h3>
              <p>24시간 신생아·아동 안전 보육, 건강검진 및 맞춤 영양 급식</p>
              <span className="sqc-more">자세히 보기 <ChevronRight size={14} /></span>
            </div>

            <div
              onClick={() => setRoute({ page: "services", tab: "srv-programs" })}
              className="saeron-quick-card card-sky cursor-pointer"
            >
              <div className="sqc-icon"><BookOpen size={24} /></div>
              <h3>프로그램 지원</h3>
              <p>학습지원, 문화체험, 체육, 나들이 등 전인적 성장 프로그램</p>
              <span className="sqc-more">자세히 보기 <ChevronRight size={14} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 새볕원 미션 & 4대 핵심가치 섹션 */}
      <section className="py-14 bg-white border-y border-stone-200/70">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold tracking-widest text-orange-600 uppercase">
              SAEBYUTWON MISSION & VALUES
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-2">
              아동 최우선의 가치로 지키는 안전한 울타리
            </h2>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed">
              {FACILITY_INFO.mission}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FACILITY_INFO.coreValues.map((val, idx) => (
              <div key={idx} className="value-pill-card">
                <div className="text-xs font-extrabold text-orange-600 mb-1">0{idx + 1}. {val.eng}</div>
                <h4 className="text-lg font-extrabold text-stone-900 mb-2">“{val.title}”</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 입·퇴소 절차 요약 프로세스 & 5대 프로그램 */}
      <section className="py-14">
        <div className="container">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold text-orange-600 tracking-wider uppercase">PROCESS</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1">
                일시보호 입·퇴소 절차 안내
              </h2>
            </div>
            <button
              onClick={() => setRoute({ page: "services", tab: "srv-admission" })}
              className="text-sm font-bold text-orange-600 hover:underline flex items-center gap-1"
            >
              <span>입소대상 및 절차 상세보기</span>
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {ADMISSION_PROCESS.map((p, idx) => (
              <div key={idx} className="process-step-card">
                <div className="process-step-badge">{p.step}</div>
                <h3 className="text-base font-extrabold text-stone-900 mt-3 mb-1">{p.title}</h3>
                <div className="text-xs font-semibold text-orange-600 mb-3">{p.subtitle}</div>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {p.items.map((it, i) => (
                    <li key={i}>• {it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 새볕 소식(공지사항/자료실/재정공시) & 후원·봉사 빠른 안내 */}
      <section className="main-content-section">
        <div className="container">
          <div className="main-board-grid">
            {/* 왼쪽: 새볕 소식 */}
            <div className="card-box" style={{ padding: "28px" }}>
              <div className="section-header" style={{ marginBottom: "18px" }}>
                <div className="section-title-wrap">
                  <h2 style={{ fontSize: "22px" }}>새볕 소식 · 공지사항</h2>
                  <p>새볕원의 주요 공지, 운영위원회 회의록, 서식 및 재정공시를 확인하세요.</p>
                </div>
                <button
                  onClick={() => setRoute({ page: "board", tab: "board-notice" })}
                  className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                >
                  <span>전체보기</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="board-tabs">
                <button onClick={() => handleTabChange("all")} className={`tab-btn ${boardTab === "all" ? "active" : ""}`}>
                  전체
                </button>
                <button onClick={() => handleTabChange("notice")} className={`tab-btn ${boardTab === "notice" ? "active" : ""}`}>
                  공지사항
                </button>
                <button onClick={() => handleTabChange("data")} className={`tab-btn ${boardTab === "data" ? "active" : ""}`}>
                  자료실
                </button>
                <button onClick={() => handleTabChange("finance")} className={`tab-btn ${boardTab === "finance" ? "active" : ""}`}>
                  재정공시
                </button>
              </div>

              <div className="board-list">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => openPostDetail(post)}
                    className="post-item cursor-pointer"
                  >
                    <div className="post-title-area">
                      <span className={`post-badge badge-${post.category}`}>
                        {post.category === "notice" && "공지"}
                        {post.category === "data" && "자료"}
                        {post.category === "finance" && "공시"}
                      </span>
                      <span className="post-title-text font-medium text-stone-800 hover:text-orange-600 transition-colors">
                        {post.title}
                      </span>
                    </div>
                    <span className="post-date">{post.createdAt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽: 후원 및 자원봉사 참여 박스 (새론 스타일 따뜻한 안내) */}
            <div className="quick-service-box">
              <div>
                <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold mb-2">
                  <Heart size={14} fill="currentColor" />
                  <span>아이들의 내일을 밝히는 따뜻한 손길</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-2">후원 및 자원봉사 안내</h3>
                <p className="text-stone-300 text-xs leading-relaxed mb-5">
                  여러분의 따뜻한 관심과 나눔이 긴급 보호 아동들이 상처를 치유하고 밝게 성장하는 가장 큰 힘이 됩니다.
                </p>

                <div className="bg-white/10 border border-white/15 rounded-xl p-4 mb-5">
                  <div className="text-[11px] text-amber-300 font-bold">새볕원 전용 후원계좌</div>
                  <div className="text-lg font-extrabold text-white mt-0.5">
                    {FACILITY_INFO.donationAccount.bank} {FACILITY_INFO.donationAccount.accountNumber}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-stone-300">예금주: {FACILITY_INFO.donationAccount.holder}</span>
                    <button
                      onClick={copyAccount}
                      className="inline-flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs px-3 py-1 rounded-md"
                    >
                      <Copy size={12} /> 계좌복사
                    </button>
                  </div>
                </div>
              </div>

              <div className="quick-actions-grid">
                <button
                  onClick={() => setRoute({ page: "support", tab: "sup-donation" })}
                  className="quick-action-btn"
                >
                  <Heart size={20} className="text-rose-400" />
                  <span>온라인 후원신청</span>
                </button>

                <button
                  onClick={() => setRoute({ page: "support", tab: "sup-volunteer" })}
                  className="quick-action-btn"
                >
                  <Users size={20} className="text-amber-400" />
                  <span>자원봉사 신청</span>
                </button>

                <button
                  onClick={() => setRoute({ page: "board", tab: "board-schedule" })}
                  className="quick-action-btn"
                >
                  <Calendar size={20} className="text-emerald-400" />
                  <span>이달의 일정</span>
                </button>

                <button
                  onClick={() => setRoute({ page: "qna", tab: "qna-contact" })}
                  className="quick-action-btn"
                >
                  <ShieldCheck size={20} className="text-sky-400" />
                  <span>1:1 상담문의</span>
                </button>
              </div>
            </div>
          </div>

          {/* 6. 새볕 갤러리 프리뷰 (활동 소식) */}
          <div className="mt-14">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-xs font-extrabold text-orange-600 uppercase">GALLERY</span>
                <h2 className="text-2xl font-extrabold text-stone-900 mt-1">새볕원 활동 갤러리</h2>
              </div>
              <button
                onClick={() => setRoute({ page: "board", tab: "board-gallery" })}
                className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
              >
                <span>갤러리 더보기</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => openPostDetail(post)}
                  className="facility-card cursor-pointer"
                >
                  <div className="facility-card-img-wrap h-48">
                    <img
                      src={post.image || "/images/hero_banner.jpg"}
                      alt={post.title}
                      className="facility-card-img"
                    />
                    <span className="facility-card-tag">{post.createdAt}</span>
                  </div>
                  <div className="facility-card-body p-5">
                    <h3 className="font-bold text-stone-900 text-base mb-2 line-clamp-1">{post.title}</h3>
                    <p className="text-xs text-stone-500 line-clamp-2 mb-3">{post.summary}</p>
                    <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                      자세히 보기 <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. 운영법인 사회복지법인 새볕재단 연계 배너 */}
      <section className="container mb-16">
        <div className="foundation-link-banner">
          <div className="flex flex-wrap items-center gap-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <SaebyeotFoundationLogo layout="vertical" size="sm" />
            </div>
            <div>
              <div className="text-xs font-bold text-orange-700 mb-1">SINCE 1955 • 운영법인 안내</div>
              <h3 className="text-xl md:text-2xl font-extrabold text-stone-900 mb-1">
                사회복지법인 새볕재단과 함께하는 70년의 사랑
              </h3>
              <p className="text-sm text-stone-600 max-w-xl">
                새볕원은 1955년 전쟁고아 구호사업으로 태동한 사회복지법인 새볕재단 산하 아동일시보호시설입니다.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setRoute({ page: "about", tab: "about-foundation" })}
              className="btn-primary text-sm"
            >
              <span>법인소개 보기</span>
              <ChevronRight size={16} />
            </button>
            <a
              href={FACILITY_INFO.foundationUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary text-sm flex items-center gap-1"
            >
              <span>새볕재단 홈페이지 바로가기</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}


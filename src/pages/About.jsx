import React, { useState, useEffect, useRef } from "react";
import {
  FACILITY_INFO,
  ORG_CHART_DATA,
  FACILITY_SPACES,
  HISTORY_ITEMS
} from "../data/initialData";
import { SaebyeotwonLogo, SaebyeotFoundationLogo } from "../components/Logos";
import { Heart, Target, Compass, Camera, ExternalLink, Info } from "lucide-react";

function InteractiveMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || !window.L) return;

    const lat = 35.9283267;
    const lng = 128.5458014;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const L = window.L;
    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 16,
      scrollWheelZoom: true,
      zoomControl: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    const customIcon = L.divIcon({
      className: "wmind-custom-pin",
      html: `<div style="position:relative; display:flex; flex-direction:column; align-items:center;">
        <div style="background:#fff; border:1px solid #d97706; border-radius:6px; padding:5px 11px; font-weight:800; font-size:12.5px; color:#292524; white-space:nowrap; box-shadow:0 2px 6px rgba(0,0,0,0.2); margin-bottom:3px;">
          아동일시보호시설 새볕원
        </div>
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35));">
          <path d="M14 0C6.27 0 0 6.27 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.27 21.73 0 14 0Z" fill="#ea580c"/>
          <circle cx="14" cy="13.5" r="8.5" fill="#ffffff"/>
          <text x="14" y="17.5" text-anchor="middle" fill="#ea580c" font-size="12" font-weight="900" font-family="Arial, sans-serif">S</text>
        </svg>
      </div>`,
      iconSize: [210, 70],
      iconAnchor: [105, 70]
    });

    L.marker([lat, lng], { icon: customIcon }).addTo(map);
    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="wmind-roughmap-wrap">
      <div ref={mapContainerRef} style={{ width: "100%", height: "420px", zIndex: 1 }} />
      <div className="wmind-roughmap-footer">
        <span className="wmind-roughmap-brand">
          <strong>{FACILITY_INFO.name}</strong> — {FACILITY_INFO.address}
        </span>
        <div className="wmind-roughmap-links">
          <a
            href={`https://map.kakao.com/link/search/${encodeURIComponent("대구 북구 영송로 36-6")}`}
            target="_blank"
            rel="noreferrer"
          >
            큰지도보기
          </a>
          <span className="bar">|</span>
          <a
            href={`https://map.kakao.com/link/to/${encodeURIComponent("아동일시보호시설 새볕원")},35.9283267,128.5458014`}
            target="_blank"
            rel="noreferrer"
          >
            길찾기
          </a>
        </div>
      </div>
    </div>
  );
}

export default function About({ defaultTab = "about-greeting" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  const tabs = [
    { id: "about-greeting", label: "인사말" },
    { id: "about-mission", label: "설립목적 · 미션 · 핵심가치" },
    { id: "about-history", label: "연혁 (70년 발자취)" },
    { id: "about-org", label: "조직도" },
    { id: "about-facility", label: "시설현황" },
    { id: "about-foundation", label: "법인소개" },
    { id: "about-location", label: "오시는 길" }
  ];

  return (
    <div className="about-page">
      <div className="sub-hero">
        <div className="container">
          <h1>새볕원 소개</h1>
          <p>「{FACILITY_INFO.slogan}」 — 아동일시보호시설 새볕원을 소개합니다.</p>
        </div>
      </div>

      <div className="sub-nav-tabs">
        <div className="container sub-nav-tabs-inner flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`sub-nav-tab ${activeTab === t.id ? "active" : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-12">
        {/* 1. 인사말 (홈페이지 정리.hwp 1. 인사말 100% 반영) */}
        {activeTab === "about-greeting" && (
          <div className="card-box">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-wrap justify-between items-center gap-6 pb-6 mb-8 border-b border-stone-200">
                <div className="flex-1 min-w-[260px]">
                  <span className="text-orange-600 font-bold text-xs tracking-wider uppercase">
                    GREETING • SAEBYUTWON
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1 leading-snug">
                    「{FACILITY_INFO.slogan}」
                  </h2>
                </div>
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl px-6 py-4 shrink-0">
                  <SaebyeotwonLogo size="md" />
                </div>
              </div>

              <div className="text-stone-700 leading-loose space-y-5 text-base">
                <p className="font-bold text-stone-900 text-lg">
                  안녕하세요, 아동일시보호시설 ‘새볕원’입니다.
                </p>
                <p>
                  모든 아이들은 안전하게 보호받을 권리, 존중받을 권리, 사랑받으며 성장할 권리가 있습니다.
                </p>
                <p>
                  일시적인 보호가 필요한 아이들에게 단순히 머무는 시간이 아니라, 자신의 마음을 돌아보고 상처를 치유하며 새로운 환경과 미래를 준비하는 <strong>회복과 성장의 시간</strong>이 되도록 노력하고 있습니다.
                </p>
                <p>
                  한 아이의 안전한 오늘이 건강한 내일로 이어지도록, 새볕원은 아이들 곁에서 함께 걷겠습니다.
                </p>
                <div className="pt-6 border-t border-stone-100 flex justify-end">
                  <div className="text-right">
                    <div className="text-xs text-stone-500">사회복지법인 새볕재단 산하</div>
                    <div className="text-lg font-extrabold text-stone-900 mt-0.5">
                      아동일시보호시설 새볕원 임직원 일동
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. 설립목적 · 미션 · 핵심가치 (홈페이지 정리.hwp 2. 설립목적 100% 반영) */}
        {activeTab === "about-mission" && (
          <div className="space-y-8">
            <div className="card-box p-8 bg-gradient-to-br from-amber-50/80 to-white border-amber-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    <Heart size={13} />
                    <span>설립목적</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900 mb-3">긴급 보호와 초기 치유, 지속 가능한 연계</h3>
                  <p className="text-stone-700 text-sm leading-relaxed">
                    {FACILITY_INFO.purpose}
                  </p>
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    <Target size={13} />
                    <span>새볕원 미션</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900 mb-3">아동 최우선 양육대책 수립 및 보호</h3>
                  <p className="text-stone-700 text-sm leading-relaxed">
                    {FACILITY_INFO.mission}
                  </p>
                </div>
              </div>
            </div>

            <div className="card-box p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-1.5 text-orange-600 text-xs font-bold uppercase mb-1">
                  <Compass size={15} />
                  <span>CORE VALUES</span>
                </div>
                <h3 className="text-2xl font-extrabold text-stone-900">새볕원 4대 핵심가치</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {FACILITY_INFO.coreValues.map((val, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-stone-50 border border-stone-200 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 text-white font-extrabold flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="text-xs text-orange-600 font-bold">{val.eng}</div>
                      <h4 className="text-lg font-extrabold text-stone-900 mb-1.5">“{val.title}”</h4>
                      <p className="text-sm text-stone-600 leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. 연혁 (홈페이지 정리.hwp 연혁 100% 반영) */}
        {activeTab === "about-history" && (
          <div className="timeline-section">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-orange-600 font-bold text-sm tracking-widest uppercase">
                HISTORY OF SAEBYUTWON
              </span>
              <h2 className="text-3xl font-extrabold text-stone-900 mt-2 mb-3">
                새볕원 · 새볕재단 발자취 (1955 ~ 현재)
              </h2>
              <p className="text-stone-600 text-sm">
                1955년 전쟁고아 구호사업으로 시작하여 오늘날 아동일시보호시설 새볕원으로 이어진 공식 연혁입니다.
              </p>
            </div>

            <div className="timeline-flow max-w-4xl mx-auto px-4">
              {HISTORY_ITEMS.map((item, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div key={item.no} className={`timeline-item ${isLeft ? "left" : "right"}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-card">
                      <div className="timeline-date">{item.date}</div>
                      <h4 className="timeline-title">{item.title}</h4>
                      <p className="timeline-desc">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. 조직도 (홈페이지 정리.hwp 3. 조직도 이미지 완벽 재현) */}
        {activeTab === "about-org" && (
          <div className="card-box p-8">
            <div className="text-center mb-10">
              <span className="text-xs font-extrabold text-orange-600 uppercase">ORGANIZATION</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1">
                아동일시보호시설 새볕원 조직도
              </h3>
              <p className="text-stone-500 text-sm mt-2">
                원장을 중심으로 인사위원회·운영위원회 및 4개 전문 팀이 유기적으로 협력하여 아동을 보호합니다.
              </p>
            </div>

            <div className="wmind-org-wrap">
              {/* 최상단: 원장 */}
              <div className="wmind-org-top">{ORG_CHART_DATA.head}</div>
              <div className="wmind-org-line-v"></div>

              {/* 중간: 인사위원회 / 운영위원회 */}
              <div className="wmind-org-mid-row flex-wrap justify-center">
                {ORG_CHART_DATA.committees.map((c, idx) => (
                  <div key={idx} className="wmind-org-sub text-center">
                    <div className="font-extrabold text-stone-900">{c.name}</div>
                    <div className="text-[11px] text-stone-500 font-normal mt-0.5">{c.desc}</div>
                  </div>
                ))}
              </div>
              <div className="wmind-org-line-v"></div>

              {/* 하단: 4대 팀 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full border-t-2 border-stone-300 pt-6">
                {ORG_CHART_DATA.teams.map((team, idx) => (
                  <div key={idx} className="wmind-org-branch">
                    <div className={`wmind-org-branch-head ${team.color}`}>
                      <div className="text-[10px] uppercase tracking-wider opacity-75">{team.badge}</div>
                      <div className="text-base font-extrabold">{team.name}</div>
                    </div>
                    <ul>
                      {team.duties.map((d, i) => (
                        <li key={i}>• {d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. 시설현황 (추후 실제 시설 사진 전달 시 교체 예정) */}
        {activeTab === "about-facility" && (
          <div className="space-y-6">
            <div className="card-box p-6 bg-amber-50 border-amber-200 flex items-start gap-3">
              <Info size={20} className="text-orange-600 shrink-0 mt-0.5" />
              <div className="text-sm text-stone-700 leading-relaxed">
                <strong>시설 사진 업데이트 예정 안내:</strong> 현재 새볕원 시설 실사 사진이 준비 중이며, 자료 전달 즉시 각 공간별 실제 사진으로 반영될 예정입니다. (위치: {FACILITY_INFO.address} / 생활관 연면적 1,239.4㎡)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FACILITY_SPACES.map((space) => (
                <div key={space.id} className="facility-card">
                  <div className="facility-card-img-wrap h-52">
                    <img src={space.image} alt={space.name} className="facility-card-img" />
                    <span className="facility-card-tag flex items-center gap-1">
                      <Camera size={11} /> {space.floor}
                    </span>
                  </div>
                  <div className="facility-card-body p-5">
                    <h4 className="text-lg font-extrabold text-stone-900 mb-2">{space.name}</h4>
                    <p className="text-sm text-stone-600 leading-relaxed">{space.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. 법인소개 (홈페이지 정리.hwp 새볕재단 인사말 완벽 반영) */}
        {activeTab === "about-foundation" && (
          <div className="card-box p-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-wrap justify-between items-center gap-6 pb-6 mb-8 border-b border-stone-200">
                <div className="flex-1 min-w-[260px]">
                  <span className="text-orange-600 font-bold text-xs uppercase">FOUNDATION INTRODUCTION</span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1">
                    「사람을 존중하고 사랑으로 희망을 만들어 가는 새볕재단」
                  </h2>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 shrink-0">
                  <SaebyeotFoundationLogo layout="vertical" size="md" />
                </div>
              </div>

              <div className="text-stone-700 leading-loose space-y-5 text-base">
                <p>안녕하십니까! 사회복지법인 새볕재단을 찾아주신 여러분을 진심으로 환영합니다.</p>
                <p>
                  새볕재단은 우리 사회의 모든 사람이 존엄한 존재로 존중받고 사랑 속에서 희망을 잃지 않도록 함께하는 사회복지법인입니다.
                </p>
                <p>
                  새볕이라는 이름처럼, 어두운 곳에서 빛을 비추고 지친 이웃에게 일어설 힘이 되어 주도록 곁에서 함께 걸어 가겠습니다.
                </p>
                <p>
                  새볕재단은 사람을 중심에 두는 복지, 권리를 존중하는 복지, 지역사회와 함께하는 복지를 실천하고자 노력하며 희망을 만들어 가겠습니다.
                </p>
              </div>

              <div className="mt-8 p-6 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <div className="font-extrabold text-stone-900 text-base">사회복지법인 새볕재단 공식 홈페이지</div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    산하시설: 새볕원(아동일시보호시설) • 새볕실버빌(노인전문요양시설) • 새볕실버케어센터(재가장기요양)
                  </div>
                </div>
                <a
                  href={FACILITY_INFO.foundationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-xs py-2.5 px-4"
                >
                  <span>새볕재단 바로가기</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 7. 오시는 길 */}
        {activeTab === "about-location" && (
          <div className="card-box p-8">
            <h3 className="text-2xl font-bold text-stone-900 mb-6">새볕원 오시는 길 안내</h3>

            <div className="marBott50">
              <InteractiveMap />

              <div className="mapBg">
                <dl className="mh">
                  <dt>주소</dt>
                  <dd>(41452) {FACILITY_INFO.address}</dd>
                </dl>
                <dl className="mt">
                  <dt>전화</dt>
                  <dd>{FACILITY_INFO.phone}</dd>
                </dl>
                <dl className="mf">
                  <dt>팩스</dt>
                  <dd>{FACILITY_INFO.fax}</dd>
                </dl>
              </div>
            </div>

            <div className="Traffic">
              <h5 className="text-xl font-bold text-stone-900 mb-4">대중교통 및 자가용 이용 안내</h5>
              <div className="TrB marBott10">
                <div className="TF">
                  <strong>지하철 이용 시</strong>
                  <ul className="Aul">
                    <li>
                      대구 도시철도 3호선 <strong>구암역 1번 출구</strong> 하차 후 도보 약 8~10분 (태전도서관 · 대구보건대학교 방면)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="TrA marBott10">
                <div className="TF">
                  <strong>버스 이용 시</strong>
                  <div>
                    <span className="BDL marBott10">
                      대구보건대학교 / 태전도서관 인근 정류장 하차 도보 5분
                    </span>
                    <ul>
                      <li><span className="sort02 marBott10">간선버스</span> 527, 708, 719, 724, 726, 730, 750</li>
                      <li><span className="sort03 marBott10">지선버스</span> 칠곡1, 칠곡1-1, 북구1, 북구4</li>
                      <li><span className="sort01">급행버스</span> 급행3, 급행7 (보건대네거리·구암역 인근 하차)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="TrC marBott10">
                <div className="TF">
                  <strong>자가용 이용 시</strong>
                  <ul className="Aul">
                    <li style={{ marginBottom: "6px" }}>
                      <span className="sort04" style={{ marginRight: "6px" }}>칠곡중앙대로</span>
                      보건대네거리에서 대구보건대학교·태전도서관 방향(영송로) 진입 후 태전도서관 바로 옆
                    </li>
                    <li>
                      <span className="sort03" style={{ marginRight: "6px" }}>고속도로</span>
                      북대구IC 또는 칠곡IC 진출 → 태전교/보건대네거리 방면 → 영송로 36-6 진입
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


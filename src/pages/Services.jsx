import React, { useState, useEffect } from "react";
import {
  ADMISSION_TARGETS,
  ADMISSION_PROCESS,
  SERVICE_SECTIONS,
  FACILITY_INFO
} from "../data/initialData";
import {
  ShieldAlert, Phone, ArrowRight, CheckCircle2,
  Smile, Stethoscope, BookOpen, Sparkles
} from "lucide-react";

export default function Services({ defaultTab = "srv-admission", setRoute }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  const tabs = [
    { id: "srv-admission", label: "입소대상 및 입·퇴소 절차" },
    { id: "srv-counseling", label: "아동 심리상담 및 치유" },
    { id: "srv-health", label: "아동 건강 · 생활관리" },
    { id: "srv-programs", label: "프로그램 지원 안내" }
  ];

  return (
    <div className="services-page">
      <div className="sub-hero">
        <div className="container">
          <h1>보호 및 서비스 안내</h1>
          <p>대전일시보호시설 새론과 동일한 전문 보호 체계로 아동의 안전과 회복, 건강한 성장을 지원합니다.</p>
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
        {/* 1. 입소대상 및 입·퇴소 절차 (새론 홈페이지 참조 모델 100% 반영) */}
        {activeTab === "srv-admission" && (
          <div className="space-y-10">
            {/* 긴급 보호 의뢰 안내 배너 */}
            <div className="card-box p-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <ShieldAlert size={26} />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-100 uppercase">24시간 긴급 보호 의뢰 접수</div>
                  <h3 className="text-xl font-extrabold mt-0.5">
                    시·군·구청, 경찰지구대, 아동보호전문기관 보호 의뢰 안내
                  </h3>
                  <p className="text-xs text-amber-50 mt-1">
                    긴급 보호 필요 아동 발생 시 아래 대표전화로 연락 주시면 즉시 입소 절차를 진행합니다.
                  </p>
                </div>
              </div>

              <div className="bg-white text-stone-900 px-5 py-3 rounded-xl font-extrabold text-sm flex items-center gap-2 shadow-md">
                <Phone size={16} className="text-orange-600" />
                <span>{FACILITY_INFO.phone}</span>
              </div>
            </div>

            {/* 입소대상 6대 유형 */}
            <div className="card-box p-8">
              <div className="mb-8">
                <span className="text-xs font-extrabold text-orange-600 uppercase">ADMISSION TARGETS</span>
                <h2 className="text-2xl font-extrabold text-stone-900 mt-1">입소대상 안내</h2>
                <p className="text-sm text-stone-500 mt-1">
                  보호자의 부재나 긴급한 위기 상황으로 가정 내 보호가 어려워 일시적인 보호와 지원이 필요한 만 18세 미만 아동을 대상으로 합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ADMISSION_TARGETS.map((item) => (
                  <div key={item.no} className="p-6 rounded-2xl border border-stone-200 bg-stone-50/70 hover:border-orange-300 hover:bg-white transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-black text-orange-500">{item.no}</span>
                      <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-stone-900 mb-2">{item.title}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 입·퇴소 절차 4단계 다이어그램 */}
            <div className="card-box p-8">
              <div className="mb-8">
                <span className="text-xs font-extrabold text-orange-600 uppercase">ADMISSION & DISCHARGE PROCESS</span>
                <h2 className="text-2xl font-extrabold text-stone-900 mt-1">입·퇴소 절차 안내</h2>
                <p className="text-sm text-stone-500 mt-1">
                  아동의 안전 확보부터 초기 위기개입, 향후 양육대책 수립 및 퇴소 연계까지 4단계로 체계화되어 있습니다.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {ADMISSION_PROCESS.map((p, idx) => (
                  <div key={idx} className="process-step-card relative">
                    <div className="process-step-badge">{p.step}</div>
                    <h4 className="text-lg font-extrabold text-stone-900 mt-3 mb-1">{p.title}</h4>
                    <div className="text-xs font-bold text-orange-600 mb-3">{p.subtitle}</div>
                    <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                      {p.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 bg-stone-50 rounded-xl border border-stone-200 flex flex-wrap justify-between items-center gap-4">
                <div className="text-sm text-stone-700">
                  <strong>의뢰 서식 다운로드:</strong> 자료실에서 「아동일시보호 의뢰서 및 초기상담 기록지」 양식을 바로 내려받으실 수 있습니다.
                </div>
                <button
                  onClick={() => setRoute && setRoute({ page: "qna", tab: "qna-contact" })}
                  className="btn-primary text-xs py-2.5 px-4"
                >
                  <span>입소 상담 문의하기</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. 아동 심리상담 및 치유 */}
        {activeTab === "srv-counseling" && (
          <div className="card-box p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-orange-600 flex items-center justify-center">
                <Smile size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-stone-900">{SERVICE_SECTIONS.counseling.title}</h2>
                <p className="text-sm text-stone-500">{SERVICE_SECTIONS.counseling.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {SERVICE_SECTIONS.counseling.items.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/80">
                  <div className="text-xs font-bold text-orange-600 mb-1">COUNSELING 0{idx + 1}</div>
                  <h4 className="text-lg font-extrabold text-stone-900 mb-2">{item.name}</h4>
                  <p className="text-sm text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. 아동 건강 · 생활관리 */}
        {activeTab === "srv-health" && (
          <div className="card-box p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Stethoscope size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-stone-900">{SERVICE_SECTIONS.health.title}</h2>
                <p className="text-sm text-stone-500">{SERVICE_SECTIONS.health.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {SERVICE_SECTIONS.health.items.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
                  <div className="text-xs font-bold text-emerald-700 mb-1">HEALTH & CARE 0{idx + 1}</div>
                  <h4 className="text-lg font-extrabold text-stone-900 mb-2">{item.name}</h4>
                  <p className="text-sm text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. 5대 프로그램 지원 안내 */}
        {activeTab === "srv-programs" && (
          <div className="card-box p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <BookOpen size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-stone-900">{SERVICE_SECTIONS.programs.title}</h2>
                <p className="text-sm text-stone-500">{SERVICE_SECTIONS.programs.subtitle}</p>
              </div>
            </div>

            <div className="space-y-5 mt-6">
              {SERVICE_SECTIONS.programs.list.map((pg, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-white hover:border-orange-300 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-orange-600">
                      <Sparkles size={13} /> {pg.code}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {pg.tags.map((t, i) => (
                        <span key={i} className="text-[11px] bg-white border border-stone-200 text-stone-600 px-2.5 py-0.5 rounded-full font-semibold">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h4 className="text-xl font-extrabold text-stone-900 mb-2">{pg.name}</h4>
                  <p className="text-sm text-stone-600 leading-relaxed">{pg.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


import React, { useState, useEffect } from "react";
import { FAQ_ITEMS, FACILITY_INFO } from "../data/initialData";
import { submitInquiry } from "../services/firebase";
import { HelpCircle, MessageSquare, Lock, CheckCircle2, ChevronDown, Phone } from "lucide-react";

export default function Qna({ defaultTab = "qna-contact" }) {
  const [activeTab, setActiveTab] = useState("contact");
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (defaultTab === "qna-faq") setActiveTab("faq");
    else setActiveTab("contact");
  }, [defaultTab]);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    phone: "",
    password: "",
    isPrivate: true,
    content: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.content) {
      alert("필수 입력 항목을 작성해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry(formData);
      setSubmitted(true);
    } catch (err) {
      alert("문의 접수 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="qna-page">
      <div className="sub-hero">
        <div className="container">
          <h1>소통 · 문의하기</h1>
          <p>새볕원은 열린 마음으로 여러분의 소중한 의견과 입소·후원·봉사 상담에 귀를 기울입니다.</p>
        </div>
      </div>

      <div className="sub-nav-tabs">
        <div className="container sub-nav-tabs-inner">
          <button
            onClick={() => setActiveTab("contact")}
            className={`sub-nav-tab ${activeTab === "contact" ? "active" : ""}`}
          >
            1:1 온라인 상담문의
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`sub-nav-tab ${activeTab === "faq" ? "active" : ""}`}
          >
            자주 묻는 질문 (FAQ)
          </button>
        </div>
      </div>

      <div className="container py-12">
        {activeTab === "contact" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            <div className="lg:col-span-8 card-box p-8">
              <h3 className="text-2xl font-bold text-stone-900 mb-2">1:1 온라인 맞춤 상담</h3>
              <p className="text-stone-500 text-sm mb-6">
                아동 일시보호 입소 의뢰, 후원, 자원봉사 등 궁금하신 사항을 남겨주시면 담당자가 친절히 안내해 드립니다.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-2xl font-bold text-stone-900">상담 문의가 성공적으로 접수되었습니다.</h4>
                  <p className="text-stone-600 text-sm max-w-md mx-auto">
                    접수된 문의는 비공개로 안전하게 보관되며, 담당자 확인 후 신속히 연락드리겠습니다.
                  </p>
                  <button
                    onClick={() => {
                      setFormData({ title: "", author: "", phone: "", password: "", isPrivate: true, content: "" });
                      setSubmitted(false);
                    }}
                    className="btn-secondary text-xs mt-4"
                  >
                    추가 문의 작성하기
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">문의 제목 *</label>
                    <input
                      type="text"
                      required
                      placeholder="예: 아동 일시보호 입소 절차 또는 물품 후원 문의"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">작성자 성함(기관명) *</label>
                      <input
                        type="text"
                        required
                        placeholder="홍길동"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">연락처 *</label>
                      <input
                        type="tel"
                        required
                        placeholder="010-1234-5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">비밀번호 (조회용 4자리)</label>
                      <input
                        type="password"
                        maxLength="4"
                        placeholder="숫자 4자리"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group flex items-center pt-6">
                      <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPrivate}
                          onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                        />
                        <Lock size={14} className="text-orange-600" />
                        <span>비공개 비밀글로 작성 (관리자만 열람)</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">상담 내용 *</label>
                    <textarea
                      rows="5"
                      required
                      placeholder="문의하실 내용을 상세히 적어주시면 더욱 정확한 안내가 가능합니다."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="form-textarea"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-4 text-base"
                  >
                    <MessageSquare size={18} />
                    <span>{isSubmitting ? "문의 등록 중..." : "1:1 온라인 상담 신청하기"}</span>
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-4 space-y-5">
              <div className="card-box p-6 bg-amber-50/70 border-amber-200">
                <div className="flex items-center gap-2 text-orange-700 font-bold text-sm mb-2">
                  <Phone size={16} />
                  <span>긴급 보호 및 유선 상담</span>
                </div>
                <div className="text-xl font-extrabold text-stone-900 mb-2">{FACILITY_INFO.phone}</div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  아동학대·유기 등 긴급 일시보호가 필요한 경우 24시간 유선 상담이 가능합니다.<br />
                  • 팩스: {FACILITY_INFO.fax}<br />
                  • 이메일: {FACILITY_INFO.email}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-box p-8 max-w-3xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <HelpCircle size={24} className="text-orange-600" />
              <span>자주 묻는 질문 (FAQ)</span>
            </h3>

            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="border border-stone-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-5 text-left font-bold text-stone-800 bg-stone-50 hover:bg-amber-50/50 flex justify-between items-center transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-orange-600 font-extrabold text-base">Q.</span>
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-stone-400 transition-transform ${openFaq === idx ? "rotate-180 text-orange-600" : ""}`}
                  />
                </button>

                {openFaq === idx && (
                  <div className="p-5 bg-white text-stone-600 text-sm leading-relaxed border-t border-stone-200">
                    <span className="font-bold text-emerald-600 mr-1.5">A.</span>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


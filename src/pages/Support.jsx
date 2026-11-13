import React, { useState, useEffect } from "react";
import { FACILITY_INFO } from "../data/initialData";
import { submitDonation, submitVolunteer, fetchPosts } from "../services/firebase";
import {
  Heart, Copy, CheckCircle2, ShieldCheck, Gift, Users, Award, ChevronRight
} from "lucide-react";
import confetti from "canvas-confetti";

export default function Support({ defaultTab = "sup-donation", openPostDetail }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [galleryPosts, setGalleryPosts] = useState([]);

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    fetchPosts("gallery").then(setGalleryPosts);
  }, []);

  // 온라인 후원 신청 상태 (신생원 양식)
  const [donForm, setDonForm] = useState({
    donorType: "개인",
    name: "",
    phone: "",
    email: "",
    category: "정기후원",
    amount: "매월 30,000원",
    isDesignated: false,
    designatedPurpose: "",
    receiptNeeded: true,
    address: "",
    message: "",
    privacyAgreed: false
  });
  const [donSubmitted, setDonSubmitted] = useState(false);
  const [donSubmitting, setDonSubmitting] = useState(false);

  // 온라인 자원봉사 신청 상태 (신생원 양식)
  const [volForm, setVolForm] = useState({
    vType: "개인",
    name: "",
    phone: "",
    field: "아동 학습지원 / 멘토링",
    day: "주말(토/일)",
    vmsId: "",
    headcount: 1,
    message: "",
    privacyAgreed: false
  });
  const [volSubmitted, setVolSubmitted] = useState(false);
  const [volSubmitting, setVolSubmitting] = useState(false);

  const copyAccount = () => {
    const text = `${FACILITY_INFO.donationAccount.bank} ${FACILITY_INFO.donationAccount.accountNumber}`;
    navigator.clipboard.writeText(text);
    alert(`새볕원 후원계좌가 복사되었습니다!\n${text}\n(예금주: ${FACILITY_INFO.donationAccount.holder})`);
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!donForm.privacyAgreed) {
      alert("개인정보 수집 및 이용에 동의해 주셔야 신청이 완료됩니다.");
      return;
    }
    setDonSubmitting(true);
    try {
      await submitDonation({
        ...donForm,
        type: donForm.category,
        needReceipt: donForm.receiptNeeded
      });
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      setDonSubmitted(true);
    } catch (err) {
      alert(`접수 중 오류가 발생했습니다. (${FACILITY_INFO.phone})`);
    } finally {
      setDonSubmitting(false);
    }
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    if (!volForm.privacyAgreed) {
      alert("개인정보 수집 및 이용에 동의해 주셔야 신청이 완료됩니다.");
      return;
    }
    setVolSubmitting(true);
    try {
      await submitVolunteer({
        type: volForm.vType,
        name: volForm.name.trim(),
        phone: volForm.phone.trim(),
        field: volForm.field,
        day: volForm.day,
        schedule: volForm.day,
        vmsId: volForm.vmsId.trim(),
        headcount: Number(volForm.headcount) || 1,
        message: volForm.message.trim(),
        intro: volForm.message.trim()
      });
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      setVolSubmitted(true);
    } catch (err) {
      alert(`접수 중 오류가 발생했습니다. (${FACILITY_INFO.phone})`);
    } finally {
      setVolSubmitting(false);
    }
  };

  return (
    <div className="support-page">
      <div className="sub-hero">
        <div className="container">
          <h1>후원 및 자원봉사</h1>
          <p>아이들의 오늘을 지키고 내일을 함께 준비하는 따뜻한 동행에 참여해 주세요.</p>
        </div>
      </div>

      <div className="sub-nav-tabs">
        <div className="container sub-nav-tabs-inner flex-wrap">
          <button
            onClick={() => setActiveTab("sup-donation")}
            className={`sub-nav-tab ${activeTab === "sup-donation" ? "active" : ""}`}
          >
            후원 안내 및 온라인 신청
          </button>
          <button
            onClick={() => setActiveTab("sup-volunteer")}
            className={`sub-nav-tab ${activeTab === "sup-volunteer" ? "active" : ""}`}
          >
            자원봉사 안내 및 신청
          </button>
          <button
            onClick={() => setActiveTab("sup-gallery")}
            className={`sub-nav-tab ${activeTab === "sup-gallery" ? "active" : ""}`}
          >
            후원 · 봉사 나눔 갤러리
          </button>
        </div>
      </div>

      <div className="container py-12">
        {/* 1. 후원 안내 및 온라인 신청 */}
        {activeTab === "sup-donation" && (
          <div>
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white p-8 rounded-2xl shadow-lg mb-10 flex flex-wrap justify-between items-center gap-6">
              <div>
                <div className="flex items-center gap-2 text-amber-100 text-xs font-bold mb-1">
                  <Heart size={15} fill="currentColor" />
                  <span>아동일시보호시설 새볕원 공식 후원계좌</span>
                </div>
                <div className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                  {FACILITY_INFO.donationAccount.bank} {FACILITY_INFO.donationAccount.accountNumber}
                </div>
                <div className="text-amber-50 text-sm mt-1">
                  예금주: <strong>{FACILITY_INFO.donationAccount.holder}</strong> (국세청 연말정산 기부금영수증 100% 연동)
                </div>
              </div>

              <button
                onClick={copyAccount}
                className="bg-white text-orange-700 font-bold px-6 py-3.5 rounded-xl shadow-md hover:bg-amber-50 transition-all flex items-center gap-2"
              >
                <Copy size={18} />
                <span>계좌번호 복사하기</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <div className="subpage-highlight-banner">
                  <p className="subpage-highlight-text">
                    별도의 서류 다운로드 없이 홈페이지에서 간편하게 온라인 후원신청서를 작성하실 수 있습니다.
                  </p>
                </div>

                {donSubmitted ? (
                  <div className="online-form-container text-center py-12">
                    <CheckCircle2 size={52} color="#4cab6e" className="mx-auto mb-3" />
                    <h4 className="text-2xl font-extrabold text-stone-900 mb-2">
                      온라인 후원신청이 성공적으로 접수되었습니다!
                    </h4>
                    <p className="text-sm text-stone-600 mb-6">
                      새볕원 아이들에게 따뜻한 사랑을 보내주셔서 진심으로 감사드립니다.<br />
                      담당자가 확인 후 정성껏 안내 연락을 드리겠습니다. (문의: {FACILITY_INFO.phone})
                    </p>
                    <button
                      onClick={() => setDonSubmitted(false)}
                      className="btn-form-submit"
                    >
                      새 후원신청서 작성하기
                    </button>
                  </div>
                ) : (
                  <div className="online-form-container">
                    <div className="form-guide-notice">
                      <strong>※ 개인정보 보안 안내:</strong> 주민등록번호 등 민감한 고유식별정보는 홈페이지에서 직접 입력받지 않으며, 기부금영수증 발급 시 담당자가 안전한 유선 확인을 통해 처리해 드립니다.
                    </div>

                    <form onSubmit={handleDonationSubmit}>
                      <div className="form-group-grid">
                        <label className="form-label required">후원자 구분</label>
                        <div className="form-radio-group">
                          <label className="form-radio-label">
                            <input
                              type="radio"
                              name="donorType"
                              value="개인"
                              checked={donForm.donorType === "개인"}
                              onChange={(e) => setDonForm({ ...donForm, donorType: e.target.value })}
                            />
                            개인 후원자
                          </label>
                          <label className="form-radio-label">
                            <input
                              type="radio"
                              name="donorType"
                              value="단체/기업"
                              checked={donForm.donorType === "단체/기업"}
                              onChange={(e) => setDonForm({ ...donForm, donorType: e.target.value })}
                            />
                            단체 / 기업 후원
                          </label>
                        </div>
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label required">
                          {donForm.donorType === "단체/기업" ? "단체 / 기업명" : "후원자 성함"}
                        </label>
                        <input
                          type="text"
                          className="form-input-text"
                          placeholder={donForm.donorType === "단체/기업" ? "예: (주)희망나눔" : "예: 홍길동"}
                          value={donForm.name}
                          onChange={(e) => setDonForm({ ...donForm, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label required">연락처</label>
                        <input
                          type="tel"
                          className="form-input-text"
                          placeholder="예: 010-1234-5678"
                          value={donForm.phone}
                          onChange={(e) => setDonForm({ ...donForm, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label">이메일</label>
                        <input
                          type="email"
                          className="form-input-text"
                          placeholder="예: saebyutwon@example.com"
                          value={donForm.email}
                          onChange={(e) => setDonForm({ ...donForm, email: e.target.value })}
                        />
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label required">후원 방식</label>
                        <select
                          className="form-select"
                          value={donForm.category}
                          onChange={(e) => setDonForm({ ...donForm, category: e.target.value })}
                          required
                        >
                          <option value="정기후원">정기후원 (매월 자동이체 / 계좌송금)</option>
                          <option value="일시후원">일시후원 (계좌 송금)</option>
                          <option value="결연후원">결연후원 (보호아동 1:1 결연)</option>
                          <option value="물품후원">물품후원 (신생아 분유, 기저귀, 의류, 학용품 등)</option>
                        </select>
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label required">후원 내용 / 금액</label>
                        <input
                          type="text"
                          className="form-input-text"
                          placeholder="예: 매월 30,000원 또는 지원 희망 물품"
                          value={donForm.amount}
                          onChange={(e) => setDonForm({ ...donForm, amount: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label">지정기탁 여부</label>
                        <div>
                          <label className="form-radio-label mb-2">
                            <input
                              type="checkbox"
                              checked={donForm.isDesignated}
                              onChange={(e) => setDonForm({ ...donForm, isDesignated: e.target.checked })}
                            />
                            특정 목적 지정기탁 희망
                          </label>
                          {donForm.isDesignated && (
                            <input
                              type="text"
                              className="form-input-text mt-2"
                              placeholder="예: 신생아 분유·기저귀 지원, 아동 심리치료비 지원 등"
                              value={donForm.designatedPurpose}
                              onChange={(e) => setDonForm({ ...donForm, designatedPurpose: e.target.value })}
                            />
                          )}
                        </div>
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label">기부금영수증</label>
                        <div>
                          <label className="form-radio-label mb-2">
                            <input
                              type="checkbox"
                              checked={donForm.receiptNeeded}
                              onChange={(e) => setDonForm({ ...donForm, receiptNeeded: e.target.checked })}
                            />
                            연말정산용 기부금영수증 신청
                          </label>
                          {donForm.receiptNeeded && (
                            <input
                              type="text"
                              className="form-input-text mt-2"
                              placeholder="영수증 수령 주소"
                              value={donForm.address}
                              onChange={(e) => setDonForm({ ...donForm, address: e.target.value })}
                            />
                          )}
                        </div>
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label">응원 메시지</label>
                        <textarea
                          className="form-textarea"
                          rows="3"
                          placeholder="새볕원 아이들에게 전하고 싶은 따뜻한 응원의 한마디를 남겨주세요."
                          value={donForm.message}
                          onChange={(e) => setDonForm({ ...donForm, message: e.target.value })}
                        ></textarea>
                      </div>

                      <div className="privacy-consent-box">
                        <div className="font-bold text-sm text-stone-800 mb-2">
                          [필수] 개인정보 수집 및 이용에 대한 동의
                        </div>
                        <div className="privacy-scroll-area">
                          1. 수집 항목: 성명(단체명), 연락처, 이메일, 주소(기부금영수증 신청 시)<br />
                          2. 수집 목적: 아동일시보호시설 새볕원 온라인 후원 신청 접수, 후원금·물품 관리, 기부금영수증 발급 및 소식 안내<br />
                          3. 보유 기간: 후원 종료 및 법정 세무·회계보존 의무 기간(5년) 경과 시 즉시 파기<br />
                          * 귀하는 개인정보 수집 동의를 거부할 권리가 있으나, 거부 시 온라인 후원신청 및 영수증 발급이 제한될 수 있습니다.
                        </div>
                        <div className="mt-3">
                          <label className="form-radio-label font-bold text-stone-900">
                            <input
                              type="checkbox"
                              checked={donForm.privacyAgreed}
                              onChange={(e) => setDonForm({ ...donForm, privacyAgreed: e.target.checked })}
                              required
                            />
                            개인정보 수집 및 이용에 동의합니다.
                          </label>
                        </div>
                      </div>

                      <div className="form-submit-row">
                        <button type="submit" disabled={donSubmitting} className="btn-form-submit">
                          {donSubmitting ? "신청 접수 중..." : "온라인 후원신청서 제출하기"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="card-box p-6 bg-stone-50 border-stone-200">
                  <h4 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-emerald-600" />
                    <span>기부금 세액공제 혜택 안내</span>
                  </h4>
                  <p className="text-stone-600 text-sm leading-relaxed mb-4">
                    새볕원은 소득세법 제34조 및 법인세법 제24조에 따른 <strong>공익·지정기부금 대상 사회복지시설</strong>입니다.
                  </p>
                  <div className="bg-white p-4 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-2">
                    <p><strong>개인 기부자:</strong> 소득금액의 30% 한도 내 15% 세액공제 (1천만원 초과분 30%)</p>
                    <p><strong>법인 기부자:</strong> 소득금액의 10% 한도 내 전액 손비 인정</p>
                    <p><strong>연말정산 간소화:</strong> 국세청 홈택스에 자동 등록되어 간편 제출 가능</p>
                  </div>
                </div>

                <div className="card-box p-6">
                  <h4 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <Gift size={20} className="text-orange-600" />
                    <span>필요 후원물품 안내</span>
                  </h4>
                  <ul className="text-sm text-stone-600 space-y-2.5">
                    <li>• <strong>신생아·영유아:</strong> 분유, 기저귀, 물티슈, 아기 내의</li>
                    <li>• <strong>학령기 아동:</strong> 계절 의류, 학용품, 도서, 간식류</li>
                    <li>• <strong>생활 필수품:</strong> 세탁세제, 샴푸·바디워시, 마스크</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. 자원봉사 안내 및 신청 */}
        {activeTab === "sup-volunteer" && (
          <div>
            <div className="card-box p-6 bg-stone-900 text-white mb-10 flex flex-wrap justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center shrink-0">
                  <Award size={26} />
                </div>
                <div>
                  <div className="font-bold text-lg text-white">VMS 사회복지자원봉사인증관리 공식 인증기관</div>
                  <p className="text-stone-300 text-xs">
                    새볕원에서 활동하신 모든 봉사 시간은 보건복지부 VMS 포털(1365 연계)에 공식 등록됩니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                {volSubmitted ? (
                  <div className="online-form-container text-center py-12">
                    <CheckCircle2 size={52} color="#4cab6e" className="mx-auto mb-3" />
                    <h4 className="text-2xl font-extrabold text-stone-900 mb-2">
                      자원봉사 신청이 성공적으로 접수되었습니다!
                    </h4>
                    <p className="text-sm text-stone-600 mb-6">
                      담당자가 일정 조율 및 사전 안내를 위해 확인 후 연락드리겠습니다. (문의: {FACILITY_INFO.phone})
                    </p>
                    <button onClick={() => setVolSubmitted(false)} className="btn-form-submit">
                      새 신청서 작성하기
                    </button>
                  </div>
                ) : (
                  <div className="online-form-container">
                    <div className="form-guide-notice">
                      <strong>※ 중요 안내:</strong> 원활한 봉사시간 인증을 위해 봉사활동 전 반드시{" "}
                      <strong>VMS(사회복지자원봉사인증관리)</strong> 회원가입을 완료해 주시기 바랍니다.
                    </div>

                    <form onSubmit={handleVolunteerSubmit}>
                      <div className="form-group-grid">
                        <label className="form-label required">신청 구분</label>
                        <div className="form-radio-group">
                          <label className="form-radio-label">
                            <input
                              type="radio"
                              name="vType"
                              value="개인"
                              checked={volForm.vType === "개인"}
                              onChange={(e) => setVolForm({ ...volForm, vType: e.target.value })}
                            />
                            개인 봉사자
                          </label>
                          <label className="form-radio-label">
                            <input
                              type="radio"
                              name="vType"
                              value="단체/동아리"
                              checked={volForm.vType === "단체/동아리"}
                              onChange={(e) => setVolForm({ ...volForm, vType: e.target.value })}
                            />
                            단체 / 동아리 / 기업
                          </label>
                        </div>
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label required">
                          {volForm.vType === "단체/동아리" ? "단체명 및 대표자" : "봉사자 성함"}
                        </label>
                        <input
                          type="text"
                          className="form-input-text"
                          placeholder="예: 홍길동"
                          value={volForm.name}
                          onChange={(e) => setVolForm({ ...volForm, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label required">연락처</label>
                        <input
                          type="tel"
                          className="form-input-text"
                          placeholder="예: 010-1234-5678"
                          value={volForm.phone}
                          onChange={(e) => setVolForm({ ...volForm, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label required">희망 봉사 분야</label>
                        <select
                          className="form-select"
                          value={volForm.field}
                          onChange={(e) => setVolForm({ ...volForm, field: e.target.value })}
                          required
                        >
                          <option value="아동 학습지원 / 멘토링">아동 학습지원 / 멘토링</option>
                          <option value="영유아 보육 및 정서놀이 보조">영유아 보육 및 정서놀이 보조</option>
                          <option value="문화체험 · 나들이 동행">문화체험 · 나들이 동행</option>
                          <option value="시설 환경미화 및 도서관 정리">시설 환경미화 및 도서관 정리</option>
                          <option value="행사 및 급식 보조">행사 및 급식 보조</option>
                        </select>
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label required">희망 활동 요일</label>
                        <select
                          className="form-select"
                          value={volForm.day}
                          onChange={(e) => setVolForm({ ...volForm, day: e.target.value })}
                          required
                        >
                          <option value="주말(토/일)">주말 (토요일 또는 일요일)</option>
                          <option value="평일 오전">평일 오전 (09:00 ~ 12:00)</option>
                          <option value="평일 오후">평일 오후 (14:00 ~ 18:00)</option>
                          <option value="시간협의">담당자와 일정 협의</option>
                        </select>
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label">VMS 아이디</label>
                        <input
                          type="text"
                          className="form-input-text"
                          placeholder="VMS 가입 아이디"
                          value={volForm.vmsId}
                          onChange={(e) => setVolForm({ ...volForm, vmsId: e.target.value })}
                        />
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label">참여 인원</label>
                        <input
                          type="number"
                          min="1"
                          className="form-input-text"
                          value={volForm.headcount}
                          onChange={(e) => setVolForm({ ...volForm, headcount: e.target.value })}
                        />
                      </div>

                      <div className="form-group-grid">
                        <label className="form-label">소개 및 특기</label>
                        <textarea
                          rows="3"
                          className="form-textarea"
                          placeholder="봉사 지원 동기 또는 보유하신 특기(아동교육, 미술, 음악 등)를 적어주세요."
                          value={volForm.message}
                          onChange={(e) => setVolForm({ ...volForm, message: e.target.value })}
                        ></textarea>
                      </div>

                      <div className="privacy-consent-box">
                        <div className="font-bold text-sm text-stone-800 mb-2">[필수] 개인정보 수집 및 이용 동의</div>
                        <div className="privacy-scroll-area">
                          1. 수집 항목: 성명(대표자명), 연락처, VMS 아이디, 참여 인원수<br />
                          2. 수집 목적: 새볕원 자원봉사 신청 접수, 일정 조율 및 VMS 봉사시간 인증 등록<br />
                          3. 보유 기간: 자원봉사 활동 종료 시까지 (VMS 등록 기록은 법정 보존 기준 준수)
                        </div>
                        <div className="mt-3">
                          <label className="form-radio-label font-bold text-stone-900">
                            <input
                              type="checkbox"
                              checked={volForm.privacyAgreed}
                              onChange={(e) => setVolForm({ ...volForm, privacyAgreed: e.target.checked })}
                              required
                            />
                            개인정보 수집 및 이용에 동의합니다.
                          </label>
                        </div>
                      </div>

                      <div className="form-submit-row">
                        <button type="submit" disabled={volSubmitting} className="btn-form-submit">
                          {volSubmitting ? "신청 접수 중..." : "자원봉사 신청서 제출하기"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="card-box p-6">
                  <h4 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <Users size={20} className="text-orange-600" />
                    <span>자원봉사 유의사항</span>
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-2.5 leading-relaxed">
                    <li>• 일시보호 아동의 초상권 및 개인정보 보호를 위해 원내 무단 사진 촬영은 엄격히 금지됩니다.</li>
                    <li>• 감염병 예방을 위해 호흡기 증상이나 발열 시 방문을 자제해 주세요.</li>
                    <li>• 사전 오리엔테이션 및 아동학대 예방·보안 서약서 작성이 진행됩니다.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. 후원·봉사 나눔 갤러리 */}
        {activeTab === "sup-gallery" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => openPostDetail && openPostDetail(post)}
                className="facility-card cursor-pointer"
              >
                <div className="facility-card-img-wrap h-48">
                  <img
                    src={post.image || "/images/hero_banner.jpg"}
                    alt={post.title}
                    className="facility-card-img"
                  />
                </div>
                <div className="facility-card-body p-5">
                  <div className="text-xs text-orange-600 font-semibold mb-1">{post.createdAt}</div>
                  <h3 className="font-bold text-stone-900 text-base mb-2 line-clamp-1">{post.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mb-4">{post.summary}</p>
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1 hover:text-orange-600">
                    자세히 보기 <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


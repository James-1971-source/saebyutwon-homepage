import React from "react";
import { FACILITY_INFO } from "../data/initialData";
import { SaebyeotwonLogo } from "./Logos";
import { Copy, Heart } from "lucide-react";

export default function Footer({ setRoute }) {
  const handleFamilySiteChange = (e) => {
    const val = e.target.value;
    if (!val) return;
    if (val.startsWith("http")) {
      window.open(val, "_blank", "noopener,noreferrer");
    } else if (val.startsWith("about-")) {
      setRoute({ page: "about", tab: val });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    e.target.value = "";
  };

  const copyAccount = () => {
    const acc = `${FACILITY_INFO.donationAccount.bank} ${FACILITY_INFO.donationAccount.accountNumber}`;
    navigator.clipboard.writeText(acc);
    alert(
      `새볕원 공식 후원계좌가 복사되었습니다!\n${acc} (예금주: ${FACILITY_INFO.donationAccount.holder})`
    );
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* 상단 후원계좌 배너 바 (새론 스타일 하단 계좌 노출 + 원클릭 복사) */}
        <div className="footer-donation-bar">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold">
              <Heart size={13} fill="currentColor" />
              <span>새볕원 후원계좌 안내</span>
            </span>
            <span className="text-white font-extrabold text-base md:text-lg tracking-wide">
              {FACILITY_INFO.donationAccount.bank} {FACILITY_INFO.donationAccount.accountNumber}
            </span>
            <span className="text-stone-300 text-xs md:text-sm">
              (예금주: <strong className="text-white">{FACILITY_INFO.donationAccount.holder}</strong>)
            </span>
          </div>
          <button
            onClick={copyAccount}
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold text-xs px-4 py-2 rounded-lg transition-all"
          >
            <Copy size={13} />
            <span>계좌번호 복사</span>
          </button>
        </div>

        {/* 상단 링크 및 패밀리사이트 드롭다운 */}
        <div className="footer-top">
          <div className="footer-links flex-wrap">
            <button
              onClick={() => {
                setRoute({ page: "policy", tab: "policy-privacy" });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="footer-link highlight"
            >
              개인정보처리방침
            </button>
            <button
              onClick={() => {
                setRoute({ page: "policy", tab: "policy-email" });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="footer-link"
            >
              이메일무단수집거부
            </button>
            <button
              onClick={() => {
                setRoute({ page: "services", tab: "srv-admission" });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="footer-link"
            >
              입·퇴소 절차 안내
            </button>
            <button
              onClick={() => {
                setRoute({ page: "about", tab: "about-location" });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="footer-link"
            >
              오시는 길
            </button>
            <button
              onClick={() => {
                setRoute({ page: "board", tab: "board-finance" });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="footer-link"
            >
              재정공시
            </button>
            <button
              onClick={() => {
                setRoute({ page: "admin" });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="footer-link text-stone-400 hover:text-amber-300"
            >
              [관리자센터]
            </button>
          </div>

          <div>
            <select
              onChange={handleFamilySiteChange}
              defaultValue=""
              className="footer-family-select"
              aria-label="법인 및 유관기관 바로가기"
            >
              <option value="">법인 및 유관기관 바로가기 (Family Site)</option>
              <optgroup label="사회복지법인 새볕재단 및 산하시설">
                <option value="https://saebyut-foundation-v2.web.app">사회복지법인 새볕재단 (법인본부)</option>
                <option value="about-foundation">새볕실버빌 (노인전문요양시설)</option>
                <option value="about-foundation">새볕실버케어센터 (재가장기요양기관)</option>
              </optgroup>
              <optgroup label="아동보호 유관기관">
                <option value="https://www.mohw.go.kr">보건복지부</option>
                <option value="https://www.ncrc.or.kr">아동권리보장원</option>
                <option value="https://www.daegu.go.kr">대구광역시청</option>
                <option value="https://www.buk.daegu.kr">대구광역시 북구청</option>
                <option value="https://www.vms.or.kr">VMS 사회복지자원봉사인증관리</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* 기관 상세 정보 */}
        <div className="footer-info flex flex-wrap items-center gap-8">
          <div className="shrink-0">
            <SaebyeotwonLogo size="md" dark={true} showSubtitle={true} />
          </div>
          <div>
            <div>
              <strong className="text-white text-base mr-3">{FACILITY_INFO.name}</strong>
              <span>운영법인: {FACILITY_INFO.foundationName} (대표이사: {FACILITY_INFO.representative})</span>
              <span>고유번호: {FACILITY_INFO.businessNo}</span>
            </div>
            <div className="mt-2 text-stone-400">
              <span>주소: (41452) {FACILITY_INFO.address}</span>
              <span>전화번호: {FACILITY_INFO.phone}</span>
              <span>팩스번호: {FACILITY_INFO.fax}</span>
              <span>이메일: {FACILITY_INFO.email}</span>
            </div>
            <div className="mt-1 text-stone-400">
              <span>
                후원계좌: {FACILITY_INFO.donationAccount.bank} {FACILITY_INFO.donationAccount.accountNumber} (예금주: {FACILITY_INFO.donationAccount.holder})
              </span>
            </div>
          </div>
        </div>

        {/* 카피라이트 */}
        <div className="footer-bottom">
          <p>
            © 1958-{new Date().getFullYear()} {FACILITY_INFO.name} ({FACILITY_INFO.foundationName}). All Rights Reserved.
          </p>
          <p>「아이들의 오늘을 지키고, 내일을 함께 준비합니다」</p>
        </div>
      </div>
    </footer>
  );
}


import React, { useState, useEffect } from "react";
import { FACILITY_INFO } from "../data/initialData";

export default function Policy({ defaultTab = "policy-privacy" }) {
  const [activeTab, setActiveTab] = useState(defaultTab || "policy-privacy");

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  return (
    <div className="policy-page">
      <div className="sub-hero">
        <div className="container">
          <h1>이용안내 및 약관</h1>
          <p>{FACILITY_INFO.name}은 후원자, 자원봉사자 및 이용자의 개인정보와 권익을 소중히 보호합니다.</p>
        </div>
      </div>

      <div className="sub-nav-tabs">
        <div className="container sub-nav-tabs-inner">
          <button
            onClick={() => setActiveTab("policy-privacy")}
            className={`sub-nav-tab ${activeTab === "policy-privacy" ? "active" : ""}`}
          >
            개인정보처리방침
          </button>
          <button
            onClick={() => setActiveTab("policy-email")}
            className={`sub-nav-tab ${activeTab === "policy-email" ? "active" : ""}`}
          >
            이메일무단수집거부
          </button>
        </div>
      </div>

      <div className="container py-12">
        <div className="card-box p-8">
          {activeTab === "policy-privacy" ? (
            <div className="CntBasic Personal">
              <h4 className="policy-h4">개인정보처리방침</h4>
              <div className="marBott40 text-stone-700 leading-relaxed">
                {FACILITY_INFO.name}({FACILITY_INFO.foundationName})은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
              </div>

              <div className="marBott40">
                <h4 className="policy-h4">1. 개인정보의 처리 목적</h4>
                <p className="marBott15 text-stone-700 leading-relaxed">
                  {FACILITY_INFO.name}은 다음의 목적을 위해 최소한의 개인정보를 처리하며, 목적 이외의 용도로는 사용되지 않습니다.
                </p>
                <div className="BoxLine">
                  <dl className="marBott20">
                    <dt>가. 후원 및 기부금영수증 관리</dt>
                    <dd>
                      온라인 후원 신청 접수, 후원금·물품 관리, 국세청 연말정산 기부금영수증 발급 및 소식 안내 등을 목적으로 개인정보를 처리합니다.
                    </dd>
                  </dl>
                  <dl className="marBott20">
                    <dt>나. 자원봉사 신청 및 VMS 인증</dt>
                    <dd>
                      자원봉사 신청 접수, 일정 조율, 사전 안전교육 안내 및 보건복지부 VMS(1365 연계) 봉사시간 인증 등록을 목적으로 처리합니다.
                    </dd>
                  </dl>
                  <dl>
                    <dt>다. 입소·상담 및 1:1 온라인 문의 응대</dt>
                    <dd>
                      긴급 보호 아동 입소 의뢰 상담, 일반 문의 확인 및 회신 처리를 목적으로 개인정보를 처리합니다.
                    </dd>
                  </dl>
                </div>
              </div>

              <div>
                <h4 className="policy-h4">2. 개인정보의 처리 및 보유 기간</h4>
                <div className="BoxLine">
                  <ul className="policy-ul">
                    <li>후원 및 기부금영수증 관련 기록: 5년 (국세기본법 및 상속세·증여세법 등 관계법령 기준)</li>
                    <li>자원봉사 신청 및 인증 기록: 봉사활동 종료 및 VMS 등록 보존 기준 준수</li>
                    <li>온라인 상담 및 문의 기록: 3년 (소비자 불만 또는 분쟁처리에 관한 기록 기준)</li>
                    <li>개인정보 보호책임자 문의: {FACILITY_INFO.phone} / {FACILITY_INFO.email}</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="CntBasic">
              <p className="marBott30 text-stone-700 leading-relaxed text-base">
                본 사이트에 게시된 이메일 주소({FACILITY_INFO.email})가 전자우편 수집프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를 위반 시 정보통신망법에 의해{" "}
                <strong className="text-red-600 font-bold">형사처벌</strong> 됨을 유념하시기 바랍니다.
              </p>
              <h4 className="policy-h4">정보통신망법 제50조의 2 (전자우편주소의 무단 수집행위 등 금지)</h4>
              <div className="BoxLine">
                <ol className="policy-ol">
                  <li>누구든지 전자우편주소의 수집을 거부하는 의사가 명시된 인터넷 홈페이지에서 자동으로 전자우편주소를 수집하는 프로그램 그 밖의 기술적 장치를 이용하여 전자우편주소를 수집하여서는 아니된다.</li>
                  <li>누구든지 제1항의 규정을 위반하여 수집된 전자우편주소를 판매·유통하여서는 아니된다.</li>
                  <li>누구든지 제1항 및 제2항의 규정에 의하여 수집·판매 및 유통이 금지된 전자우편주소임을 알고 이를 정보전송에 이용하여서는 아니된다.</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


import React from "react";

/**
 * 새볕원 / 새볕재단 상징 동백꽃 심벌
 */
export function CamelliaFlower({ size = 48, petalColor = "#ce1126", className = "" }) {
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 120 102"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <path
        d="M25 22 C30 8, 48 6, 58 14 C66 5, 84 8, 90 20 C104 20, 114 34, 106 48 C116 56, 112 72, 98 76 C102 86, 88 96, 74 90 C66 98, 46 98, 38 88 C22 92, 12 78, 18 64 C6 54, 10 34, 25 22 Z"
        fill={petalColor}
      />
      <path
        d="M32 28 C37 17, 50 16, 58 22 C65 15, 79 17, 84 27 C95 27, 103 38, 96 49 C104 56, 100 68, 89 72 C91 79, 80 87, 69 82 C62 88, 47 88, 41 80 C29 83, 21 72, 26 61 C17 53, 20 37, 32 28 Z"
        fill={petalColor}
        filter="brightness(0.95)"
      />
      <path
        d="M60 28 L65 34 L73 31 L74 39 L82 40 L79 47 L86 52 L80 58 L84 65 L76 67 L75 74 L67 71 L62 77 L56 71 L48 75 L47 67 L39 65 L43 58 L37 52 L44 46 L41 38 L49 38 L52 30 L57 35 Z"
        fill="#ffcc00"
      />
      <ellipse cx="58" cy="51" rx="12" ry="9" fill="#f59e0b" opacity="0.45" />
      <circle cx="53" cy="47" r="2.2" fill="#fff" opacity="0.9" />
      <circle cx="59" cy="45" r="1.8" fill="#fff" opacity="0.85" />
      <circle cx="64" cy="48" r="2" fill="#fff" opacity="0.9" />
      <circle cx="55" cy="53" r="1.8" fill="#fff" opacity="0.85" />
      <circle cx="62" cy="54" r="2.2" fill="#fff" opacity="0.9" />
      <circle cx="50" cy="51" r="1.5" fill="#fff" opacity="0.8" />
      <path
        d="M52 46 L63 54 M58 44 L55 55 M65 47 L53 53"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

/**
 * 1. 새볕원 (SAEBYUTWON) 공식 로고
 * - 붉은 동백꽃 + 갈색 손글씨풍 '새볕원' + 'SAEBYUT'(갈색)'WON'(적색)
 */
export function SaebyeotwonLogo({ size = "md", dark = false, showSubtitle = false }) {
  const scale = size === "sm" ? 0.8 : size === "lg" ? 1.18 : 1;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: `${10 * scale}px`,
        userSelect: "none"
      }}
    >
      <CamelliaFlower size={48 * scale} petalColor="#ce1126" />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {showSubtitle && (
          <span
            style={{
              fontSize: `${11 * scale}px`,
              fontWeight: 700,
              color: dark ? "#fbd38d" : "#9c4221",
              letterSpacing: "0.5px",
              marginBottom: "1px",
              lineHeight: 1.1
            }}
          >
            사회복지법인 새볕재단 • 아동일시보호시설
          </span>
        )}
        <div style={{ display: "inline-flex", alignItems: "baseline", gap: `${8 * scale}px` }}>
          <span
            style={{
              fontSize: `${33 * scale}px`,
              fontWeight: 800,
              color: dark ? "#ffffff" : "#4a2508",
              letterSpacing: "1px",
              fontFamily: "'Nanum Brush Script', 'Gungsuh', '궁서', 'Malgun Gothic', cursive",
              lineHeight: 1,
              position: "relative",
              top: "-1px"
            }}
          >
            새볕<span style={{ position: "relative", top: "2px" }}>원</span>
          </span>
          <span
            style={{
              fontSize: `${14.5 * scale}px`,
              fontWeight: 900,
              letterSpacing: "-0.3px",
              fontFamily: "'Arial Black', 'Pretendard', sans-serif"
            }}
          >
            <span style={{ color: dark ? "#cbd5e1" : "#58351a" }}>SAEBYUT</span>
            <span style={{ color: "#e11d48" }}>WON</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 2. 사회복지법인 새볕재단 공식 로고
 */
export function SaebyeotFoundationLogo({ layout = "vertical", size = "md", dark = false }) {
  if (layout === "horizontal") {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          userSelect: "none"
        }}
      >
        <CamelliaFlower size={size === "sm" ? 42 : 52} petalColor="#ce1126" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            lineHeight: 1.2
          }}
        >
          <div
            style={{
              fontSize: size === "sm" ? "12px" : "13.5px",
              fontWeight: 700,
              color: dark ? "#9ca3af" : "#5a5a5a",
              letterSpacing: "1.5px",
              paddingLeft: "1.5px"
            }}
          >
            사회복지법인
          </div>
          <div
            style={{
              fontSize: size === "sm" ? "19px" : "22px",
              fontWeight: 800,
              color: dark ? "#e5e7eb" : "#4a4a4a",
              letterSpacing: "4px",
              paddingLeft: "4px",
              marginTop: "2px"
            }}
          >
            새볕재단
          </div>
        </div>
      </div>
    );
  }

  const flowerSize = size === "sm" ? 44 : size === "lg" ? 66 : 54;
  const subFontSize = size === "sm" ? "11.5px" : size === "lg" ? "15.5px" : "13px";
  const mainFontSize = size === "sm" ? "14.5px" : size === "lg" ? "20px" : "16px";
  const mainLetterSpacing = size === "sm" ? "4px" : "5px";

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        userSelect: "none",
        lineHeight: 1.25
      }}
    >
      <CamelliaFlower size={flowerSize} petalColor="#ce1126" />
      <div
        style={{
          marginTop: size === "sm" ? "4px" : "6px",
          fontSize: subFontSize,
          fontWeight: 700,
          color: dark ? "#cbd5e1" : "#5a5a5a",
          letterSpacing: "0.5px"
        }}
      >
        사회복지법인
      </div>
      <div
        style={{
          marginTop: "2px",
          fontSize: mainFontSize,
          fontWeight: 800,
          color: dark ? "#ffffff" : "#4d4d4d",
          letterSpacing: mainLetterSpacing,
          paddingLeft: mainLetterSpacing
        }}
      >
        새볕재단
      </div>
    </div>
  );
}


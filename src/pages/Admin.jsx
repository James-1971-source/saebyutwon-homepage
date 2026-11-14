import React, { useState, useEffect } from "react";
import SmartEditor from "../components/SmartEditor";
import {
  fetchPosts, createPost, updatePost, deletePost,
  fetchBanners, createBanner, updateBanner, deleteBanner, uploadFile,
  fetchDonations, updateDonationStatus, deleteDonation,
  fetchVolunteers, updateVolunteerStatus, deleteVolunteer,
  fetchInquiries, answerInquiry, deleteInquiry,
  fetchSubAdmins, createSubAdmin, updateSubAdminPermissions, deleteSubAdmin,
  checkFirebaseStatus, saveFirebaseConfig,
  loginWithFirebase, logoutFirebase, resolveAdminProfile, subscribeAuth
} from "../services/firebase";
import {
  Lock, Plus, Edit, Trash2, ShieldCheck, UserCheck,
  FileText, Heart, Users, MessageSquare, Database, Pin, UserPlus, Check, Image as ImageIcon
} from "lucide-react";

const PERMISSION_OPTIONS = [
  { key: "notices", label: "공지사항 관리", desc: "공지·회의록·입찰공고 작성/수정/삭제" },
  { key: "gallery", label: "새볕 갤러리 관리", desc: "활동 사진 및 소식 등록/수정/삭제" },
  { key: "data", label: "자료실 관리", desc: "입소 의뢰서 등 서식 파일 등록/관리" },
  { key: "finance", label: "재정공시 관리", desc: "결산보고서 및 후원금 명세서 공시" },
  { key: "banners", label: "메인 배너 관리", desc: "메인 페이지 히어로 배너 이미지·문구 변경" },
  { key: "donations", label: "후원 신청 관리", desc: "온라인 후원 신청자 확인 및 상태 변경" },
  { key: "volunteers", label: "자원봉사 신청 관리", desc: "자원봉사 신청자 확인 및 일정 관리" },
  { key: "inquiries", label: "1:1 상담 문의", desc: "비공개 상담 문의 열람 및 답변 등록" }
];

export default function Admin() {
  const [adminUser, setAdminUser] = useState(null); // { email, name, role: 'super_admin'|'sub_admin', permissions: [] }
  const [loginEmail, setLoginEmail] = useState("admin@saebyutwon.or.kr");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("posts");

  // 데이터 상태
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [postForm, setPostForm] = useState({
    title: "",
    category: "notice",
    author: "인사행정팀",
    summary: "",
    content: "",
    isPinned: false,
    image: "",
    files: []
  });

  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [answerText, setAnswerText] = useState({});

  // 메인 배너 관리 상태
  const [banners, setBanners] = useState([]);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    subtitle: "아동일시보호시설 새볕원",
    title: "",
    description: "",
    image: "/images/hero_banner.jpg",
    linkText: "입소대상 및 절차 안내",
    linkPage: "services",
    linkTab: "srv-admission",
    order: 1,
    isActive: true
  });

  // 부관리자 관리 상태 (주관리자 전용)
  const [subAdmins, setSubAdmins] = useState([]);
  const [editingSubId, setEditingSubId] = useState(null);
  const [subForm, setSubForm] = useState({
    email: "",
    name: "",
    password: "",
    permissions: ["notices", "gallery"]
  });

  // Firebase 설정 상태 (주관리자 전용)
  const [firebaseStatus, setFirebaseStatus] = useState({ connected: false, config: null });
  const [configForm, setConfigForm] = useState({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  });

  useEffect(() => {
    const unsub = subscribeAuth(async (fbUser) => {
      if (fbUser) {
        const profile = await resolveAdminProfile(fbUser.email, fbUser.uid);
        if (profile) {
          setAdminUser(profile);
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (adminUser) {
      loadAllData();
      // 부관리자가 접근 가능한 첫 탭으로 자동 이동
      if (adminUser.role !== "super_admin") {
        const p = adminUser.permissions || [];
        if (p.some((k) => ["notices", "gallery", "data", "finance"].includes(k))) {
          setActiveTab("posts");
        } else if (p.includes("donations")) {
          setActiveTab("donations");
        } else if (p.includes("volunteers")) {
          setActiveTab("volunteers");
        } else if (p.includes("inquiries")) {
          setActiveTab("inquiries");
        }
      }
    }
  }, [adminUser]);

  const loadAllData = async () => {
    const [p, b, d, v, inq, subs] = await Promise.all([
      fetchPosts(),
      fetchBanners(false),
      fetchDonations(),
      fetchVolunteers(),
      fetchInquiries(),
      fetchSubAdmins()
    ]);
    setPosts(p);
    setBanners(b);
    setDonations(d);
    setVolunteers(v);
    setInquiries(inq);
    setSubAdmins(subs);

    const fb = checkFirebaseStatus();
    setFirebaseStatus(fb);
    if (fb.config) setConfigForm(fb.config);
  };

  const hasPerm = (perm) => {
    if (!adminUser) return false;
    if (adminUser.role === "super_admin") return true;
    return (adminUser.permissions || []).includes(perm);
  };

  const canAccessPostsTab = () => {
    return hasPerm("notices") || hasPerm("gallery") || hasPerm("data") || hasPerm("finance");
  };

  const allowedPostCategories = () => {
    const cats = [];
    if (hasPerm("notices")) cats.push({ id: "notice", label: "공지사항 (회의록·공고)" });
    if (hasPerm("gallery")) cats.push({ id: "gallery", label: "새볕 갤러리 (활동소식)" });
    if (hasPerm("data")) cats.push({ id: "data", label: "자료실 (서식 다운로드)" });
    if (hasPerm("finance")) cats.push({ id: "finance", label: "재정공시 (결산·후원금)" });
    return cats;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    const email = loginEmail.trim().toLowerCase();

    // 1) Firebase 연결 시 Firebase Auth 우선 시도
    if (firebaseStatus.connected) {
      try {
        const fbUser = await loginWithFirebase(email, loginPassword);
        const profile = await resolveAdminProfile(fbUser.email, fbUser.uid);
        if (!profile) {
          await logoutFirebase();
          setLoginError("관리자 권한이 등록되지 않은 계정입니다.");
          return;
        }
        setAdminUser(profile);
        return;
      } catch (err) {
        // Firebase Auth 미설정 또는 테스트 계정 폴백 허용 여부 체크
        const fallbackCodes = [
          "auth/operation-not-allowed",
          "auth/configuration-not-found",
          "auth/user-not-found",
          "auth/invalid-credential"
        ];
        if (err.message !== "FIREBASE_NOT_CONNECTED" && !fallbackCodes.includes(err.code)) {
          setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
          return;
        }
      }
    }

    // 2) 로컬/데모 하이브리드 인증 (초기 테스트 및 프로토타입 시연용)
    if (
      (email === "admin@saebyutwon.or.kr" || email === "dsyun@sj-hs.or.kr" || email === "saebyutwon@hanmail.net") &&
      (loginPassword === "admin1234" || loginPassword === "saebyut1234" || loginPassword === "yds10102@@")
    ) {
      const profile = await resolveAdminProfile(email);
      setAdminUser(profile);
      return;
    }

    const subMatch = (await fetchSubAdmins()).find((s) => s.email.toLowerCase() === email);
    if (subMatch && (loginPassword === "staff1234" || loginPassword === "admin1234" || loginPassword === subMatch.tempPassword)) {
      setAdminUser(subMatch);
      return;
    }

    setLoginError("계정 정보 또는 비밀번호가 일치하지 않습니다.");
  };

  const handleLogout = async () => {
    await logoutFirebase();
    setAdminUser(null);
    setLoginPassword("");
  };

  const handleStartWrite = (postToEdit = null) => {
    const cats = allowedPostCategories();
    if (postToEdit) {
      setEditingPostId(postToEdit.id);
      setPostForm({
        title: postToEdit.title,
        category: postToEdit.category,
        author: postToEdit.author,
        summary: postToEdit.summary || "",
        content: postToEdit.content,
        isPinned: postToEdit.isPinned || false,
        image: postToEdit.image || "",
        files: postToEdit.files || []
      });
    } else {
      setEditingPostId(null);
      setPostForm({
        title: "",
        category: cats[0]?.id || "notice",
        author: adminUser?.name || "새볕원 관리자",
        summary: "",
        content: "",
        isPinned: false,
        image: "",
        files: []
      });
    }
    setActiveTab("write");
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!postForm.title || !postForm.content) {
      alert("제목과 본문을 작성해주세요.");
      return;
    }
    if (editingPostId) {
      await updatePost(editingPostId, postForm);
      alert("게시글이 수정되었습니다.");
    } else {
      await createPost(postForm);
      alert("새 게시글이 등록되었습니다.");
    }
    setActiveTab("posts");
    loadAllData();
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      await deletePost(id);
      loadAllData();
    }
  };

  const handleTogglePerm = (key) => {
    setSubForm((prev) => {
      const exists = prev.permissions.includes(key);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== key)
          : [...prev.permissions, key]
      };
    });
  };

  const handleSaveSubAdmin = async (e) => {
    e.preventDefault();
    if (subForm.permissions.length === 0) {
      alert("최소 1개 이상의 접근 허용 메뉴를 선택해주세요.");
      return;
    }
    try {
      if (editingSubId) {
        await updateSubAdminPermissions(editingSubId, {
          name: subForm.name,
          permissions: subForm.permissions
        });
        alert("부관리자 메뉴 권한이 수정되었습니다.");
      } else {
        if (!subForm.password || subForm.password.length < 6) {
          alert("초기 비밀번호는 6자리 이상이어야 합니다.");
          return;
        }
        await createSubAdmin(subForm);
        alert(`부관리자 계정(${subForm.email})이 등록되었습니다.`);
      }
      setEditingSubId(null);
      setSubForm({ email: "", name: "", password: "", permissions: ["notices", "gallery"] });
      loadAllData();
    } catch (err) {
      alert("부관리자 저장 중 오류: " + err.message);
    }
  };

  const handleEditSubAdmin = (sub) => {
    setEditingSubId(sub.id);
    setSubForm({
      email: sub.email,
      name: sub.name,
      password: "",
      permissions: sub.permissions || []
    });
  };

  const handleDeleteSubAdmin = async (id, email) => {
    if (window.confirm(`부관리자(${email})의 관리자 권한을 회수하시겠습니까?`)) {
      await deleteSubAdmin(id);
      loadAllData();
    }
  };

  // 메인 배너 관리 핸들러
  const handleBannerImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadFile(file);
      setBannerForm((prev) => ({ ...prev, image: res.url }));
    } catch (err) {
      alert("배너 이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!bannerForm.title.trim()) {
      alert("배너 메인 문구를 입력해주세요.");
      return;
    }
    try {
      if (editingBannerId) {
        await updateBanner(editingBannerId, bannerForm);
        alert("메인 배너가 수정되었습니다.");
      } else {
        await createBanner(bannerForm);
        alert("새 메인 배너가 등록되었습니다.");
      }
      setEditingBannerId(null);
      setBannerForm({
        subtitle: "아동일시보호시설 새볕원",
        title: "",
        description: "",
        image: "/images/hero_banner.jpg",
        linkText: "입소대상 및 절차 안내",
        linkPage: "services",
        linkTab: "srv-admission",
        order: banners.length + 1,
        isActive: true
      });
      loadAllData();
    } catch (err) {
      alert("배너 저장 중 오류가 발생했습니다.");
    }
  };

  const handleEditBanner = (b) => {
    setEditingBannerId(b.id);
    setBannerForm({
      subtitle: b.subtitle || "",
      title: b.title || "",
      description: b.description || "",
      image: b.image || "/images/hero_banner.jpg",
      linkText: b.linkText || "",
      linkPage: b.linkPage || "services",
      linkTab: b.linkTab || "srv-admission",
      order: b.order || 1,
      isActive: b.isActive !== false
    });
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm("이 메인 배너를 삭제하시겠습니까?")) {
      await deleteBanner(id);
      loadAllData();
    }
  };

  // 로그인 화면
  if (!adminUser) {
    return (
      <div className="py-20 bg-stone-100 min-h-[640px] flex items-center justify-center px-4">
        <div className="card-box p-8 max-w-md w-full shadow-xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock size={28} />
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900">새볕원 통합 관리자 센터</h2>
            <p className="text-stone-500 text-xs mt-1">
              주관리자(전체 통제) 및 부관리자(부여된 메뉴) 권한으로 로그인합니다.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-group">
              <label className="form-label">관리자 이메일 (ID)</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@saebyutwon.or.kr"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">비밀번호</label>
              <input
                type="password"
                required
                autoFocus
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="form-input"
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3.5">
              <span>관리자 로그인</span>
            </button>
          </form>

          {/* 프로토타입 테스트용 빠른 로그인 안내 */}
          <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-stone-700 space-y-1.5">
            <div className="font-bold text-orange-800">테스트 계정 안내 (주관리자 / 부관리자 권한 분리 확인용)</div>
            <div>• <strong>주관리자:</strong> <code>admin@saebyutwon.or.kr</code> / <code>admin1234</code></div>
            <div>• <strong>부관리자1 (아동보호팀):</strong> <code>staff@saebyutwon.or.kr</code> / <code>staff1234</code></div>
            <div>• <strong>부관리자2 (사업지원팀):</strong> <code>support@saebyutwon.or.kr</code> / <code>staff1234</code></div>
          </div>
        </div>
      </div>
    );
  }

  const isSuperAdmin = adminUser.role === "super_admin";

  // 부관리자의 경우 허용된 카테고리의 게시물만 필터링
  const visiblePosts = posts.filter((p) => {
    if (isSuperAdmin) return true;
    if (p.category === "notice" && hasPerm("notices")) return true;
    if (p.category === "gallery" && hasPerm("gallery")) return true;
    if (p.category === "data" && hasPerm("data")) return true;
    if (p.category === "finance" && hasPerm("finance")) return true;
    return false;
  });

  return (
    <div className="admin-dashboard-page bg-stone-50 min-h-screen py-10">
      <div className="container">
        {/* 관리자 헤더 */}
        <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-8 gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black text-stone-900">새볕원 CMS 관리자 센터</h1>
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1 bg-purple-700 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                  <ShieldCheck size={12} /> 주관리자 (Super Admin)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                  <UserCheck size={12} /> 부관리자 ({adminUser.name})
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              접속 계정: <strong>{adminUser.email}</strong> | DB 상태:{" "}
              {firebaseStatus.connected ? (
                <span className="text-emerald-600 font-bold">Firebase Cloud Firestore 실시간 연동</span>
              ) : (
                <span className="text-amber-600 font-bold">하이브리드 로컬 모드 (Firebase 연동설정 가능)</span>
              )}
            </p>
          </div>

          <div className="flex gap-2">
            {canAccessPostsTab() && (
              <button onClick={() => handleStartWrite()} className="btn-primary text-xs py-2.5 px-4">
                <Plus size={15} />
                <span>새 게시물 작성</span>
              </button>
            )}
            <button onClick={handleLogout} className="btn-secondary text-xs py-2.5 px-4">
              로그아웃
            </button>
          </div>
        </div>

        {/* 권한 기반 동적 탭 내비게이션 */}
        <div className="flex gap-2 border-b border-stone-200 mb-6 overflow-x-auto pb-1">
          {canAccessPostsTab() && (
            <button
              onClick={() => setActiveTab("posts")}
              className={`tab-btn flex items-center gap-1.5 whitespace-nowrap ${activeTab === "posts" ? "active" : ""}`}
            >
              <FileText size={16} />
              <span>게시물 관리 ({visiblePosts.length})</span>
            </button>
          )}

          {canAccessPostsTab() && (
            <button
              onClick={() => setActiveTab("write")}
              className={`tab-btn flex items-center gap-1.5 whitespace-nowrap ${activeTab === "write" ? "active" : ""}`}
            >
              <Edit size={16} />
              <span>{editingPostId ? "게시글 수정" : "스마트 에디터 글쓰기"}</span>
            </button>
          )}

          {hasPerm("donations") && (
            <button
              onClick={() => setActiveTab("donations")}
              className={`tab-btn flex items-center gap-1.5 whitespace-nowrap ${activeTab === "donations" ? "active" : ""}`}
            >
              <Heart size={16} />
              <span>후원 신청 ({donations.length})</span>
            </button>
          )}

          {hasPerm("volunteers") && (
            <button
              onClick={() => setActiveTab("volunteers")}
              className={`tab-btn flex items-center gap-1.5 whitespace-nowrap ${activeTab === "volunteers" ? "active" : ""}`}
            >
              <Users size={16} />
              <span>자원봉사 신청 ({volunteers.length})</span>
            </button>
          )}

          {hasPerm("inquiries") && (
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`tab-btn flex items-center gap-1.5 whitespace-nowrap ${activeTab === "inquiries" ? "active" : ""}`}
            >
              <MessageSquare size={16} />
              <span>1:1 상담 문의 ({inquiries.length})</span>
            </button>
          )}

          {hasPerm("banners") && (
            <button
              onClick={() => setActiveTab("banners")}
              className={`tab-btn flex items-center gap-1.5 whitespace-nowrap ${activeTab === "banners" ? "active" : ""}`}
            >
              <ImageIcon size={16} />
              <span>메인 배너 관리 ({banners.length})</span>
            </button>
          )}

          {/* 주관리자(Super Admin) 전용 탭 */}
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab("subadmins")}
              className={`tab-btn flex items-center gap-1.5 whitespace-nowrap ${activeTab === "subadmins" ? "active" : ""}`}
            >
              <UserPlus size={16} />
              <span>부관리자 권한 관리</span>
            </button>
          )}

          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab("firebase")}
              className={`tab-btn flex items-center gap-1.5 whitespace-nowrap ${activeTab === "firebase" ? "active" : ""}`}
            >
              <Database size={16} />
              <span>Firebase 연동설정</span>
            </button>
          )}
        </div>

        {/* 1. 게시물 관리 */}
        {activeTab === "posts" && canAccessPostsTab() && (
          <div className="card-box p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-stone-800 text-lg">허용된 게시판 목록</h3>
              <button onClick={() => handleStartWrite()} className="btn-primary text-xs py-2 px-3">
                <Plus size={14} /> 새 글 작성
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 text-xs font-bold border-b border-stone-200">
                    <th className="p-3 w-14 text-center">번호</th>
                    <th className="p-3 w-24">분류</th>
                    <th className="p-3">제목</th>
                    <th className="p-3 w-28 text-center">작성자</th>
                    <th className="p-3 w-28 text-center">등록일</th>
                    <th className="p-3 w-24 text-center">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {visiblePosts.map((post, idx) => (
                    <tr key={post.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="p-3 text-center text-xs text-stone-400">
                        {post.isPinned ? <Pin size={13} className="text-orange-600 mx-auto" /> : idx + 1}
                      </td>
                      <td className="p-3">
                        <span className={`post-badge badge-${post.category}`}>
                          {post.category === "notice" && "공지"}
                          {post.category === "gallery" && "갤러리"}
                          {post.category === "data" && "자료"}
                          {post.category === "finance" && "공시"}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-stone-800">{post.title}</td>
                      <td className="p-3 text-center text-xs text-stone-600">{post.author}</td>
                      <td className="p-3 text-center text-xs text-stone-400">{post.createdAt}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleStartWrite(post)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit size={15} />
                          </button>
                          <button onClick={() => handleDeletePost(post.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. 스마트 에디터 글쓰기 */}
        {activeTab === "write" && canAccessPostsTab() && (
          <div className="card-box p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-stone-900 mb-6">
              {editingPostId ? "게시물 수정" : "스마트 에디터로 새 소식 작성"}
            </h3>
            <form onSubmit={handleSavePost} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">게시판 분류 *</label>
                  <select
                    value={postForm.category}
                    onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                    className="form-select"
                  >
                    {allowedPostCategories().map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">작성자 명 *</label>
                  <input
                    type="text"
                    required
                    value={postForm.author}
                    onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-stone-700">
                    <input
                      type="checkbox"
                      checked={postForm.isPinned}
                      onChange={(e) => setPostForm({ ...postForm, isPinned: e.target.checked })}
                    />
                    <Pin size={15} className="text-orange-600" />
                    <span>상단 고정 (중요 공지)</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">제목 *</label>
                <input
                  type="text"
                  required
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  className="form-input font-bold"
                />
              </div>

              <div className="form-group">
                <label className="form-label">한 줄 요약 (선택)</label>
                <input
                  type="text"
                  value={postForm.summary}
                  onChange={(e) => setPostForm({ ...postForm, summary: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">본문 및 사진/서류 첨부 *</label>
                <SmartEditor
                  value={postForm.content}
                  onChange={(html) => setPostForm({ ...postForm, content: html })}
                  attachedFiles={postForm.files}
                  onFilesChange={(files) => setPostForm({ ...postForm, files })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button type="button" onClick={() => setActiveTab("posts")} className="btn-secondary px-6">
                  취소
                </button>
                <button type="submit" className="btn-primary px-8">
                  {editingPostId ? "수정 완료" : "게시물 발행하기"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. 후원 신청 관리 */}
        {activeTab === "donations" && hasPerm("donations") && (
          <div className="card-box p-6">
            <h3 className="font-bold text-stone-800 text-lg mb-4">온라인 후원 신청자 내역</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 text-xs font-bold border-b border-stone-200">
                    <th className="p-3">신청일</th>
                    <th className="p-3">후원자(구분)</th>
                    <th className="p-3">연락처</th>
                    <th className="p-3">방식</th>
                    <th className="p-3">내용/금액</th>
                    <th className="p-3 text-center">상태</th>
                    <th className="p-3 text-center">처리</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="p-3 text-xs text-stone-400">{d.date}</td>
                      <td className="p-3 font-semibold text-stone-800">{d.name} ({d.donorType || "개인"})</td>
                      <td className="p-3 text-xs text-stone-600">{d.phone}</td>
                      <td className="p-3 text-xs text-stone-600">{d.category || d.type}</td>
                      <td className="p-3 font-bold text-orange-600">{d.amount}</td>
                      <td className="p-3 text-center">
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                          {d.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={async () => {
                              await updateDonationStatus(d.id, "확인완료");
                              loadAllData();
                            }}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="확인완료 처리"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm("삭제하시겠습니까?")) {
                                await deleteDonation(d.id);
                                loadAllData();
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="삭제"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. 자원봉사 신청 관리 */}
        {activeTab === "volunteers" && hasPerm("volunteers") && (
          <div className="card-box p-6">
            <h3 className="font-bold text-stone-800 text-lg mb-4">자원봉사 신청자 내역</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 text-xs font-bold border-b border-stone-200">
                    <th className="p-3">신청일</th>
                    <th className="p-3">성함/단체</th>
                    <th className="p-3">연락처</th>
                    <th className="p-3">희망분야</th>
                    <th className="p-3">희망요일</th>
                    <th className="p-3">VMS ID</th>
                    <th className="p-3 text-center">상태</th>
                    <th className="p-3 text-center">처리</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((v) => (
                    <tr key={v.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="p-3 text-xs text-stone-400">{v.date}</td>
                      <td className="p-3 font-semibold text-stone-800">{v.name}</td>
                      <td className="p-3 text-xs text-stone-600">{v.phone}</td>
                      <td className="p-3 text-xs font-medium text-stone-700">{v.field}</td>
                      <td className="p-3 text-xs text-stone-600">{v.day || v.schedule}</td>
                      <td className="p-3 text-xs text-stone-500">{v.vmsId || "-"}</td>
                      <td className="p-3 text-center">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                          {v.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={async () => {
                              await updateVolunteerStatus(v.id, "확인완료");
                              loadAllData();
                            }}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="확인완료"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm("삭제하시겠습니까?")) {
                                await deleteVolunteer(v.id);
                                loadAllData();
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="삭제"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. 1:1 상담 문의 */}
        {activeTab === "inquiries" && hasPerm("inquiries") && (
          <div className="card-box p-6 space-y-5">
            <h3 className="font-bold text-stone-800 text-lg">1:1 상담 문의 내역 및 답변 등록</h3>
            {inquiries.map((inq) => (
              <div key={inq.id} className="p-5 border border-stone-200 rounded-xl bg-white space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-orange-600 font-bold mr-2">[{inq.status}]</span>
                    <strong className="text-stone-900 text-base">{inq.title}</strong>
                    <div className="text-xs text-stone-400 mt-1">
                      작성자: {inq.author} | 연락처: {inq.phone} | 등록일: {inq.date}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (window.confirm("문의를 삭제하시겠습니까?")) {
                        await deleteInquiry(inq.id);
                        loadAllData();
                      }
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-700">{inq.content}</div>

                {inq.answer && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                    <strong>관리자 공식 답변 ({inq.answerBy || "관리자"}):</strong> {inq.answer}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="답변 내용을 입력하세요..."
                    value={answerText[inq.id] || ""}
                    onChange={(e) => setAnswerText({ ...answerText, [inq.id]: e.target.value })}
                    className="form-input text-xs py-2 flex-1"
                  />
                  <button
                    onClick={async () => {
                      if (!answerText[inq.id]) return alert("답변 내용을 입력해주세요.");
                      await answerInquiry(inq.id, answerText[inq.id], adminUser.name);
                      alert("답변이 등록되었습니다.");
                      loadAllData();
                    }}
                    className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
                  >
                    답변 저장
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5-1. 메인 배너 관리 (새론 스타일 히어로 슬라이더 편집) */}
        {activeTab === "banners" && hasPerm("banners") && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 card-box p-6">
              <h3 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center gap-2">
                <ImageIcon size={20} className="text-emerald-600" />
                <span>{editingBannerId ? "메인 배너 수정" : "새 메인 배너 등록"}</span>
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                메인 페이지 상단 풀-와이드 배너 슬라이드의 이미지와 문구를 언제든 변경할 수 있습니다.
              </p>

              <form onSubmit={handleSaveBanner} className="space-y-4">
                <div className="form-group mb-0">
                  <label className="form-label">상단 소제목 (Eyebrow)</label>
                  <input
                    type="text"
                    value={bannerForm.subtitle}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    placeholder="예: 아동일시보호시설 새볕원"
                    className="form-input text-sm"
                  />
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">메인 슬로건 문구 * (줄바꿈은 Enter)</label>
                  <textarea
                    rows="3"
                    required
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    placeholder={"아이들이 꿈꾸는 세상과\n새볕원이 꿈꾸는 세상은 같습니다."}
                    className="form-textarea text-sm"
                  />
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">보조 설명 (선택)</label>
                  <input
                    type="text"
                    value={bannerForm.description}
                    onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                    placeholder="배너 하단 설명 문구"
                    className="form-input text-sm"
                  />
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">배너 배경 이미지 (업로드 또는 경로 입력)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={bannerForm.image}
                      onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                      placeholder="/images/hero_banner.jpg 또는 https://..."
                      className="form-input text-xs flex-1"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerImageUpload}
                    className="text-xs text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="form-group mb-0">
                    <label className="form-label">버튼 문구 (비우면 숨김)</label>
                    <input
                      type="text"
                      value={bannerForm.linkText}
                      onChange={(e) => setBannerForm({ ...bannerForm, linkText: e.target.value })}
                      placeholder="예: 입소절차 안내"
                      className="form-input text-xs"
                    />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">노출 순서</label>
                    <input
                      type="number"
                      min="1"
                      value={bannerForm.order}
                      onChange={(e) => setBannerForm({ ...bannerForm, order: Number(e.target.value) })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerForm.isActive}
                    onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                  />
                  <span>메인 페이지에 배너 노출하기</span>
                </label>

                <div className="flex gap-2 pt-2">
                  {editingBannerId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBannerId(null);
                        setBannerForm({
                          subtitle: "아동일시보호시설 새볕원",
                          title: "",
                          description: "",
                          image: "/images/hero_banner.jpg",
                          linkText: "입소대상 및 절차 안내",
                          linkPage: "services",
                          linkTab: "srv-admission",
                          order: banners.length + 1,
                          isActive: true
                        });
                      }}
                      className="btn-secondary text-xs py-2.5 px-4"
                    >
                      취소
                    </button>
                  )}
                  <button type="submit" className="btn-primary flex-1 text-xs py-2.5">
                    {editingBannerId ? "배너 수정 저장" : "새 배너 등록하기"}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-7 card-box p-6">
              <h3 className="text-lg font-extrabold text-slate-900 mb-4">
                등록된 메인 배너 목록 ({banners.length}건)
              </h3>
              <div className="space-y-4">
                {banners.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={b.image || "/images/hero_banner.jpg"}
                        alt={b.title}
                        className="w-28 h-16 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                            순서 {b.order || 1}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                              b.isActive !== false ? "bg-sky-100 text-sky-700" : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {b.isActive !== false ? "노출 중" : "숨김"}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">{b.subtitle}</div>
                        <div className="text-sm font-bold text-slate-900 whitespace-pre-line leading-snug">
                          {b.title}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEditBanner(b)}
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(b.id)}
                        className="text-xs text-red-600 font-bold px-2.5 py-1.5 rounded hover:bg-red-50"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. 부관리자 권한 관리 (주관리자 전용) */}
        {activeTab === "subadmins" && isSuperAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 card-box p-6">
              <h3 className="text-lg font-extrabold text-stone-900 mb-1 flex items-center gap-2">
                <UserPlus size={20} className="text-orange-600" />
                <span>{editingSubId ? "부관리자 권한 수정" : "새 부관리자 계정 등록"}</span>
              </h3>
              <p className="text-xs text-stone-500 mb-5">
                부관리자별로 접근 가능한 관리자 메뉴를 개별 지정할 수 있습니다.
              </p>

              <form onSubmit={handleSaveSubAdmin} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">이메일 (로그인 ID) *</label>
                  <input
                    type="email"
                    required
                    readOnly={!!editingSubId}
                    placeholder="staff@saebyutwon.or.kr"
                    value={subForm.email}
                    onChange={(e) => setSubForm({ ...subForm, email: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">담당자 / 부서명 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 아동보호팀 김담당"
                    value={subForm.name}
                    onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                {!editingSubId && (
                  <div className="form-group">
                    <label className="form-label">초기 비밀번호 (6자리 이상) *</label>
                    <input
                      type="password"
                      required
                      placeholder="초기 비밀번호 입력"
                      value={subForm.password}
                      onChange={(e) => setSubForm({ ...subForm, password: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">접근 허용 메뉴 선택 *</label>
                  <div className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    {PERMISSION_OPTIONS.map((opt) => (
                      <label key={opt.key} className="flex items-start gap-2.5 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={subForm.permissions.includes(opt.key)}
                          onChange={() => handleTogglePerm(opt.key)}
                          className="mt-0.5"
                        />
                        <div>
                          <div className="font-bold text-stone-800">{opt.label}</div>
                          <div className="text-[11px] text-stone-500">{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {editingSubId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSubId(null);
                        setSubForm({ email: "", name: "", password: "", permissions: ["notices", "gallery"] });
                      }}
                      className="btn-secondary text-xs py-2.5 px-4"
                    >
                      취소
                    </button>
                  )}
                  <button type="submit" className="btn-primary flex-1 text-xs py-2.5">
                    {editingSubId ? "권한 수정 저장" : "부관리자 계정 발급"}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-7 card-box p-6">
              <h3 className="text-lg font-extrabold text-stone-900 mb-4">
                등록된 부관리자 목록 ({subAdmins.length}명)
              </h3>
              <div className="space-y-3">
                {subAdmins.map((sub) => (
                  <div key={sub.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-stone-900 text-sm">{sub.name}</strong>
                        <span className="text-xs text-stone-500">({sub.email})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(sub.permissions || []).map((pk) => {
                          const found = PERMISSION_OPTIONS.find((o) => o.key === pk);
                          return (
                            <span key={pk} className="text-[11px] bg-white border border-stone-200 text-stone-700 px-2 py-0.5 rounded-md font-semibold">
                              {found ? found.label : pk}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSubAdmin(sub)}
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        권한수정
                      </button>
                      <button
                        onClick={() => handleDeleteSubAdmin(sub.id, sub.email)}
                        className="text-xs text-red-600 font-bold px-2.5 py-1.5 rounded hover:bg-red-50"
                      >
                        권한회수
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. Firebase 연동설정 (주관리자 전용) */}
        {activeTab === "firebase" && isSuperAdmin && (
          <div className="card-box p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-stone-900 mb-2 flex items-center gap-2">
              <Database size={24} className="text-orange-600" />
              <span>Firebase 클라우드 DB 연동설정 (주관리자 전용)</span>
            </h3>
            <p className="text-stone-600 text-xs mb-6">
              Firebase 콘솔에서 발급받은 웹 앱 설정 키를 입력하면 Firestore 및 Storage와 실시간 연동됩니다.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveFirebaseConfig(configForm);
                alert("Firebase 설정이 저장되었습니다.");
                setFirebaseStatus(checkFirebaseStatus());
              }}
              className="space-y-4"
            >
              <div className="form-group">
                <label className="form-label">Project ID *</label>
                <input
                  type="text"
                  required
                  value={configForm.projectId}
                  onChange={(e) => setConfigForm({ ...configForm, projectId: e.target.value })}
                  className="form-input text-xs"
                />
              </div>
              <div className="form-group">
                <label className="form-label">API Key *</label>
                <input
                  type="text"
                  required
                  value={configForm.apiKey}
                  onChange={(e) => setConfigForm({ ...configForm, apiKey: e.target.value })}
                  className="form-input text-xs"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Storage Bucket</label>
                  <input
                    type="text"
                    value={configForm.storageBucket}
                    onChange={(e) => setConfigForm({ ...configForm, storageBucket: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Auth Domain</label>
                  <input
                    type="text"
                    value={configForm.authDomain}
                    onChange={(e) => setConfigForm({ ...configForm, authDomain: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3 text-sm">
                Firebase 설정 저장 및 연결
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}


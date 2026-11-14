// Firebase & LocalStorage Hybrid Data Service + 2-Tier RBAC (주관리자 / 부관리자)

import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  serverTimestamp
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { INITIAL_POSTS, INITIAL_BANNERS, INITIAL_SCHEDULES } from "../data/initialData";

const STORAGE_KEY_POSTS = "sbw_posts";
const STORAGE_KEY_BANNERS = "sbw_banners";
const STORAGE_KEY_SCHEDULES = "sbw_schedules";
const STORAGE_KEY_DONATIONS = "sbw_donations";
const STORAGE_KEY_VOLUNTEERS = "sbw_volunteers";
const STORAGE_KEY_INQUIRIES = "sbw_inquiries";
const STORAGE_KEY_SUBADMINS = "sbw_subadmins";
const STORAGE_KEY_FIREBASE_CONFIG = "sbw_firebase_config";

// 주관리자 지정 이메일 목록
export const SUPER_ADMIN_EMAILS = [
  "dsyun@sj-hs.or.kr",
  "saebyutwon@hanmail.net",
  "admin@saebyutwon.or.kr"
];

// 기본 연동된 아동일시보호시설 새볕원 공식 Firebase 설정 (saebyut-official)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCZInd3y-AecCyU97RE8UTnLe_1lTvnnes",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "saebyut-official.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "saebyut-official",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "saebyut-official.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "681787785522",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:681787785522:web:fbf69286c44cab8d4b172b"
};

// 로컬 스토리지 초기 데이터 세팅
function initLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEY_POSTS)) {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_POSTS));
  }
  if (!localStorage.getItem(STORAGE_KEY_SCHEDULES)) {
    localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(INITIAL_SCHEDULES));
  }
  if (!localStorage.getItem(STORAGE_KEY_BANNERS)) {
    localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(INITIAL_BANNERS));
  } else {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_BANNERS) || "[]");
      const isOldDefaults =
        existing.length === 2 &&
        existing.every((b) => b.id === "sbw-banner-1" || b.id === "sbw-banner-2");
      if (isOldDefaults) {
        localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(INITIAL_BANNERS));
      }
    } catch (e) {
      localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(INITIAL_BANNERS));
    }
  }
  if (!localStorage.getItem(STORAGE_KEY_DONATIONS)) {
    localStorage.setItem(
      STORAGE_KEY_DONATIONS,
      JSON.stringify([
        {
          id: "sbw-don-1",
          donorType: "개인",
          name: "김*연",
          phone: "010-****-2341",
          email: "kim@example.com",
          type: "정기후원",
          category: "정기후원",
          amount: "매월 30,000원",
          isDesignated: true,
          designatedPurpose: "새볕원 보호아동 심리치료 및 학습지원",
          receiptNeeded: true,
          date: "2026-11-10",
          status: "접수완료"
        },
        {
          id: "sbw-don-2",
          donorType: "단체/기업",
          name: "(주)따뜻한동행 대구지사",
          phone: "053-***-8890",
          email: "donghaeng@example.com",
          type: "물품후원",
          category: "물품후원",
          amount: "신생아 분유 및 기저귀 20박스",
          isDesignated: false,
          designatedPurpose: "",
          receiptNeeded: true,
          date: "2026-11-05",
          status: "확인완료"
        }
      ])
    );
  }
  if (!localStorage.getItem(STORAGE_KEY_VOLUNTEERS)) {
    localStorage.setItem(
      STORAGE_KEY_VOLUNTEERS,
      JSON.stringify([
        {
          id: "sbw-vol-1",
          type: "개인",
          name: "이*준",
          phone: "010-****-7712",
          field: "아동 학습지원 / 멘토링",
          day: "주말(토/일)",
          schedule: "주말(토/일)",
          vmsId: "leejun99",
          headcount: 1,
          date: "2026-11-08",
          status: "신청접수"
        }
      ])
    );
  }
  if (!localStorage.getItem(STORAGE_KEY_INQUIRIES)) {
    localStorage.setItem(
      STORAGE_KEY_INQUIRIES,
      JSON.stringify([
        {
          id: "sbw-inq-1",
          title: "영유아 물품(새 의류 및 기저귀) 직접 방문 기탁 문의",
          author: "박*희",
          phone: "010-****-5520",
          date: "2026-11-09",
          isPrivate: true,
          status: "답변완료",
          content: "미개봉 신생아 기저귀와 영유아 내의를 직접 방문하여 전달드리고 싶습니다. 방문 가능한 시간대가 궁금합니다.",
          answer: "따뜻한 관심에 깊이 감사드립니다. 평일 09:00~18:00 사이 새볕원 1층 사무실로 방문해 주시면 감사히 접수하겠습니다. 방문 전 053-323-0127로 연락 부탁드립니다."
        }
      ])
    );
  }
  if (!localStorage.getItem(STORAGE_KEY_SUBADMINS)) {
    localStorage.setItem(
      STORAGE_KEY_SUBADMINS,
      JSON.stringify([
        {
          id: "sub-demo-1",
          email: "staff@saebyutwon.or.kr",
          name: "아동보호팀 김담당",
          role: "sub_admin",
          permissions: ["notices", "gallery", "data", "volunteers"],
          createdAt: "2026-11-01"
        },
        {
          id: "sub-demo-2",
          email: "support@saebyutwon.or.kr",
          name: "사업지원팀 박담당",
          role: "sub_admin",
          permissions: ["gallery", "donations", "inquiries"],
          createdAt: "2026-11-05"
        }
      ])
    );
  }
}

initLocalStorage();

let firebaseApp = null;
let db = null;
let auth = null;
let storage = null;
let isFirebaseConnected = false;

export function getSavedFirebaseConfig() {
  try {
    const custom = localStorage.getItem(STORAGE_KEY_FIREBASE_CONFIG);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed && parsed.apiKey && parsed.projectId) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveFirebaseConfig(config) {
  localStorage.setItem(STORAGE_KEY_FIREBASE_CONFIG, JSON.stringify(config));
  return initFirebase();
}

export function initFirebase() {
  const config = getSavedFirebaseConfig();
  if (config && config.apiKey && config.projectId) {
    try {
      const existing = getApps().find((a) => a.name === "[DEFAULT]");
      firebaseApp = existing || initializeApp(config);
      db = getFirestore(firebaseApp);
      auth = getAuth(firebaseApp);
      storage = getStorage(firebaseApp);
      isFirebaseConnected = true;
      return true;
    } catch (e) {
      console.warn("Firebase connection failed, using hybrid local mode:", e);
      isFirebaseConnected = false;
      return false;
    }
  }
  isFirebaseConnected = false;
  return false;
}

initFirebase();

export function checkFirebaseStatus() {
  return {
    connected: isFirebaseConnected,
    config: getSavedFirebaseConfig()
  };
}

// 초기 게시글 시딩
let isSeedingPosts = false;
async function ensureInitialPostsSeeded() {
  if (!isFirebaseConnected || !db || isSeedingPosts) return;
  isSeedingPosts = true;
  try {
    for (const post of INITIAL_POSTS) {
      await setDoc(doc(db, "posts", post.id), post, { merge: true });
    }
  } catch (e) {
    console.warn("Initial posts seed skipped:", e);
  } finally {
    isSeedingPosts = false;
  }
}

// ================= 게시글 CRUD =================
export async function fetchPosts(category = null) {
  let posts = [];
  if (isFirebaseConnected && db) {
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      snapshot.forEach((d) => posts.push({ ...d.data(), id: d.id }));

      if (posts.length === 0) {
        await ensureInitialPostsSeeded();
        posts = [...INITIAL_POSTS];
      } else {
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      }
    } catch (err) {
      console.warn("Fallback to LocalStorage posts:", err);
    }
  }

  if (posts.length === 0) {
    try {
      posts = JSON.parse(localStorage.getItem(STORAGE_KEY_POSTS) || "[]");
    } catch (e) {
      posts = INITIAL_POSTS;
    }
  }

  if (category && category !== "all") {
    return posts.filter((p) => p.category === category);
  }
  return posts;
}

export async function createPost(postData) {
  const newPost = {
    ...postData,
    id: "sbw-post-" + Date.now(),
    createdAt: new Date().toISOString().split("T")[0],
    views: 0
  };

  const posts = JSON.parse(localStorage.getItem(STORAGE_KEY_POSTS) || "[]");
  posts.unshift(newPost);
  localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));

  if (isFirebaseConnected && db) {
    try {
      await setDoc(doc(db, "posts", newPost.id), newPost);
    } catch (e) {
      console.warn("Failed saving post to Firestore:", e);
    }
  }
  return newPost;
}

export async function updatePost(id, updatedFields) {
  const posts = JSON.parse(localStorage.getItem(STORAGE_KEY_POSTS) || "[]");
  const index = posts.findIndex((p) => p.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updatedFields };
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  }

  if (isFirebaseConnected && db) {
    try {
      await updateDoc(doc(db, "posts", id), updatedFields);
    } catch (e) {
      console.warn("Firebase update failed:", e);
    }
  }
  return posts[index];
}

export async function deletePost(id) {
  let posts = JSON.parse(localStorage.getItem(STORAGE_KEY_POSTS) || "[]");
  posts = posts.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));

  if (isFirebaseConnected && db) {
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (e) {
      console.warn("Firebase delete failed:", e);
    }
  }
  return true;
}

// ================= 후원 / 자원봉사 / 1:1 문의 CRUD =================
export async function submitDonation(donationData) {
  const item = {
    id: "sbw-don-" + Date.now(),
    ...donationData,
    date: new Date().toISOString().split("T")[0],
    status: "신규접수"
  };
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_DONATIONS) || "[]");
  list.unshift(item);
  localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(list));

  if (isFirebaseConnected && db) {
    try {
      await setDoc(doc(db, "donations", item.id), item);
    } catch (e) {
      console.warn(e);
    }
  }
  return item;
}

export async function fetchDonations() {
  if (isFirebaseConnected && db) {
    try {
      const q = query(collection(db, "donations"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const items = [];
      snapshot.forEach((d) => items.push({ ...d.data(), id: d.id }));
      if (items.length > 0) {
        localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(items));
        return items;
      }
    } catch (e) {
      console.warn("Fallback to localStorage donations:", e);
    }
  }
  return JSON.parse(localStorage.getItem(STORAGE_KEY_DONATIONS) || "[]");
}

export async function updateDonationStatus(id, status) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_DONATIONS) || "[]");
  const idx = list.findIndex((d) => d.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(list));
  }
  if (isFirebaseConnected && db) {
    try {
      await updateDoc(doc(db, "donations", id), { status });
    } catch (e) {
      console.warn(e);
    }
  }
}

export async function deleteDonation(id) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_DONATIONS) || "[]").filter(
    (d) => d.id !== id
  );
  localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(list));
  if (isFirebaseConnected && db) {
    try {
      await deleteDoc(doc(db, "donations", id));
    } catch (e) {
      console.warn(e);
    }
  }
}

export async function submitVolunteer(volunteerData) {
  const item = {
    id: "sbw-vol-" + Date.now(),
    ...volunteerData,
    date: new Date().toISOString().split("T")[0],
    status: "신규접수"
  };
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_VOLUNTEERS) || "[]");
  list.unshift(item);
  localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(list));

  if (isFirebaseConnected && db) {
    try {
      await setDoc(doc(db, "volunteers", item.id), item);
    } catch (e) {
      console.warn(e);
    }
  }
  return item;
}

export async function fetchVolunteers() {
  if (isFirebaseConnected && db) {
    try {
      const q = query(collection(db, "volunteers"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const items = [];
      snapshot.forEach((d) => items.push({ ...d.data(), id: d.id }));
      if (items.length > 0) {
        localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(items));
        return items;
      }
    } catch (e) {
      console.warn("Fallback to localStorage volunteers:", e);
    }
  }
  return JSON.parse(localStorage.getItem(STORAGE_KEY_VOLUNTEERS) || "[]");
}

export async function updateVolunteerStatus(id, status) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_VOLUNTEERS) || "[]");
  const idx = list.findIndex((v) => v.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(list));
  }
  if (isFirebaseConnected && db) {
    try {
      await updateDoc(doc(db, "volunteers", id), { status });
    } catch (e) {
      console.warn(e);
    }
  }
}

export async function deleteVolunteer(id) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_VOLUNTEERS) || "[]").filter(
    (v) => v.id !== id
  );
  localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(list));
  if (isFirebaseConnected && db) {
    try {
      await deleteDoc(doc(db, "volunteers", id));
    } catch (e) {
      console.warn(e);
    }
  }
}

export async function submitInquiry(inquiryData) {
  const item = {
    id: "sbw-inq-" + Date.now(),
    ...inquiryData,
    date: new Date().toISOString().split("T")[0],
    status: "답변대기",
    answer: ""
  };
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_INQUIRIES) || "[]");
  list.unshift(item);
  localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(list));

  if (isFirebaseConnected && db) {
    try {
      await setDoc(doc(db, "inquiries", item.id), item);
    } catch (e) {
      console.warn(e);
    }
  }
  return item;
}

export async function fetchInquiries() {
  if (isFirebaseConnected && db) {
    try {
      const q = query(collection(db, "inquiries"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const items = [];
      snapshot.forEach((d) => items.push({ ...d.data(), id: d.id }));
      if (items.length > 0) {
        localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(items));
        return items;
      }
    } catch (e) {
      console.warn("Fallback to localStorage inquiries:", e);
    }
  }
  return JSON.parse(localStorage.getItem(STORAGE_KEY_INQUIRIES) || "[]");
}

export async function answerInquiry(id, answerText, answerBy = "새볕원 관리자") {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_INQUIRIES) || "[]");
  const idx = list.findIndex((i) => i.id === id);
  if (idx !== -1) {
    list[idx].answer = answerText;
    list[idx].answerBy = answerBy;
    list[idx].answeredAt = new Date().toISOString().split("T")[0];
    list[idx].status = "답변완료";
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(list));
  }

  if (isFirebaseConnected && db) {
    try {
      await updateDoc(doc(db, "inquiries", id), {
        answer: answerText,
        answerBy,
        answeredAt: new Date().toISOString().split("T")[0],
        status: "답변완료"
      });
    } catch (e) {
      console.warn("Failed updating inquiry in Firestore:", e);
    }
  }
  return list[idx];
}

export async function deleteInquiry(id) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_INQUIRIES) || "[]").filter(
    (i) => i.id !== id
  );
  localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(list));
  if (isFirebaseConnected && db) {
    try {
      await deleteDoc(doc(db, "inquiries", id));
    } catch (e) {
      console.warn(e);
    }
  }
}

// ================= 관리자 인증 및 주관리자/부관리자 RBAC 권한 관리 =================

export function subscribeAuth(callback) {
  if (isFirebaseConnected && auth) {
    return onAuthStateChanged(auth, callback);
  }
  return () => {};
}

export async function loginWithFirebase(email, password) {
  if (!isFirebaseConnected || !auth) {
    throw new Error("FIREBASE_NOT_CONNECTED");
  }
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logoutFirebase() {
  if (isFirebaseConnected && auth) {
    await signOut(auth);
  }
}

export async function resolveAdminProfile(email, uid = null) {
  const normalized = (email || "").trim().toLowerCase();
  if (SUPER_ADMIN_EMAILS.includes(normalized)) {
    return {
      email: normalized,
      name: "새볕원 주관리자",
      role: "super_admin",
      permissions: ["notices", "gallery", "data", "finance", "banners", "schedules", "donations", "volunteers", "inquiries", "sub_admins", "firebase"]
    };
  }

  if (isFirebaseConnected && db) {
    try {
      if (uid) {
        const byUid = await getDoc(doc(db, "admin_users", uid));
        if (byUid.exists()) {
          const data = byUid.data();
          return {
            id: byUid.id,
            email: data.email,
            name: data.name || "부관리자",
            role: data.role || "sub_admin",
            permissions: data.permissions || []
          };
        }
      }
      const q = query(collection(db, "admin_users"), where("email", "==", normalized));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        return {
          id: snap.docs[0].id,
          email: data.email,
          name: data.name || "부관리자",
          role: data.role || "sub_admin",
          permissions: data.permissions || []
        };
      }
    } catch (e) {
      console.warn("Firestore admin_users lookup failed:", e);
    }
  }

  const localList = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBADMINS) || "[]");
  const found = localList.find((u) => u.email.toLowerCase() === normalized);
  if (found) return found;
  return null;
}

export async function fetchSubAdmins() {
  if (isFirebaseConnected && db) {
    try {
      const snapshot = await getDocs(collection(db, "admin_users"));
      const items = [];
      snapshot.forEach((d) => items.push({ ...d.data(), id: d.id }));
      if (items.length > 0) {
        localStorage.setItem(STORAGE_KEY_SUBADMINS, JSON.stringify(items));
        return items;
      }
    } catch (e) {
      console.warn("Fallback to local subadmins:", e);
    }
  }
  return JSON.parse(localStorage.getItem(STORAGE_KEY_SUBADMINS) || "[]");
}

export async function createSubAdmin({ email, name, password, permissions }) {
  const normalizedEmail = email.trim().toLowerCase();
  const today = new Date().toISOString().split("T")[0];
  let uid = "sub-" + Date.now();

  if (isFirebaseConnected && db) {
    const config = getSavedFirebaseConfig();
    if (config && config.apiKey) {
      // 보조 앱을 생성하여 주관리자 세션을 유지한 채 부관리자 계정 생성
      const secAppName = "SecondaryAuthApp_" + Date.now();
      const secondaryApp = initializeApp(config, secAppName);
      const secAuth = getAuth(secondaryApp);
      try {
        const userCred = await createUserWithEmailAndPassword(secAuth, normalizedEmail, password);
        uid = userCred.user.uid;
      } finally {
        await signOut(secAuth).catch(() => {});
      }
    }
    const payload = {
      id: uid,
      email: normalizedEmail,
      name: name.trim(),
      role: "sub_admin",
      permissions,
      createdAt: today,
      updatedAt: serverTimestamp()
    };
    await setDoc(doc(db, "admin_users", uid), payload);
  }

  const newSub = {
    id: uid,
    email: normalizedEmail,
    name: name.trim(),
    role: "sub_admin",
    permissions,
    createdAt: today
  };
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBADMINS) || "[]");
  list.unshift(newSub);
  localStorage.setItem(STORAGE_KEY_SUBADMINS, JSON.stringify(list));
  return newSub;
}

export async function updateSubAdminPermissions(id, { name, permissions }) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBADMINS) || "[]");
  const idx = list.findIndex((u) => u.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], name, permissions };
    localStorage.setItem(STORAGE_KEY_SUBADMINS, JSON.stringify(list));
  }

  if (isFirebaseConnected && db) {
    try {
      await updateDoc(doc(db, "admin_users", id), {
        name,
        permissions,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.warn(e);
    }
  }
}

export async function deleteSubAdmin(id) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBADMINS) || "[]").filter(
    (u) => u.id !== id
  );
  localStorage.setItem(STORAGE_KEY_SUBADMINS, JSON.stringify(list));

  if (isFirebaseConnected && db) {
    try {
      await deleteDoc(doc(db, "admin_users", id));
    } catch (e) {
      console.warn(e);
    }
  }
}

// 파일 업로드 (Firebase Storage or Base64)
export async function uploadFile(file) {
  if (isFirebaseConnected && storage) {
    try {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + "KB",
        url: downloadURL
      };
    } catch (e) {
      console.warn("Storage upload failed, falling back to local:", e);
    }
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + "KB",
        url: e.target.result
      });
    };
    reader.readAsDataURL(file);
  });
}

// ================= 메인 히어로 배너 CRUD =================
export async function fetchBanners(onlyActive = false) {
  let banners = [];
  if (isFirebaseConnected && db) {
    try {
      const q = query(collection(db, "banners"), orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      snapshot.forEach((d) => banners.push({ ...d.data(), id: d.id }));
      if (banners.length > 0) {
        localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(banners));
      }
    } catch (err) {
      console.warn("Fallback to LocalStorage banners:", err);
    }
  }

  if (banners.length === 0) {
    try {
      banners = JSON.parse(localStorage.getItem(STORAGE_KEY_BANNERS) || "[]");
    } catch (e) {
      banners = INITIAL_BANNERS;
    }
    if (banners.length === 0) banners = INITIAL_BANNERS;
  }

  banners.sort((a, b) => (a.order || 99) - (b.order || 99));
  return onlyActive ? banners.filter((b) => b.isActive !== false) : banners;
}

export async function createBanner(bannerData) {
  const newBanner = {
    ...bannerData,
    id: "sbw-banner-" + Date.now(),
    order: Number(bannerData.order) || 1,
    isActive: bannerData.isActive !== false,
    updatedAt: new Date().toISOString().split("T")[0]
  };

  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_BANNERS) || "[]");
  list.push(newBanner);
  list.sort((a, b) => (a.order || 99) - (b.order || 99));
  localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(list));

  if (isFirebaseConnected && db) {
    try {
      await setDoc(doc(db, "banners", newBanner.id), newBanner);
    } catch (e) {
      console.warn("Failed saving banner to Firestore:", e);
    }
  }
  return newBanner;
}

export async function updateBanner(id, updatedFields) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_BANNERS) || "[]");
  const idx = list.findIndex((b) => b.id === id);
  const payload = {
    ...updatedFields,
    order: Number(updatedFields.order) || 1,
    updatedAt: new Date().toISOString().split("T")[0]
  };
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...payload };
    list.sort((a, b) => (a.order || 99) - (b.order || 99));
    localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(list));
  }

  if (isFirebaseConnected && db) {
    try {
      await setDoc(doc(db, "banners", id), { ...list[idx], ...payload, id }, { merge: true });
    } catch (e) {
      console.warn("Firebase banner update failed:", e);
    }
  }
  return list[idx];
}

export async function deleteBanner(id) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_BANNERS) || "[]").filter(
    (b) => b.id !== id
  );
  localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(list));

  if (isFirebaseConnected && db) {
    try {
      await deleteDoc(doc(db, "banners", id));
    } catch (e) {
      console.warn("Firebase banner delete failed:", e);
    }
  }
}

// ================= 일정 안내 CRUD =================
export async function fetchSchedules() {
  let list = [];
  if (isFirebaseConnected && db) {
    try {
      const snapshot = await getDocs(collection(db, "schedules"));
      snapshot.forEach((d) => list.push({ ...d.data(), id: d.id }));
      if (list.length > 0) {
        localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(list));
      }
    } catch (err) {
      console.warn("Fallback to LocalStorage schedules:", err);
    }
  }

  if (list.length === 0) {
    try {
      list = JSON.parse(localStorage.getItem(STORAGE_KEY_SCHEDULES) || "[]");
    } catch (e) {
      list = INITIAL_SCHEDULES;
    }
    if (list.length === 0) list = INITIAL_SCHEDULES;
  }

  return list;
}

export async function createSchedule(data) {
  const newItem = {
    ...data,
    id: "sbw-sch-" + Date.now(),
    updatedAt: new Date().toISOString().split("T")[0]
  };
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_SCHEDULES) || "[]");
  list.unshift(newItem);
  localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(list));

  if (isFirebaseConnected && db) {
    try {
      await setDoc(doc(db, "schedules", newItem.id), newItem);
    } catch (e) {
      console.warn("Failed saving schedule to Firestore:", e);
    }
  }
  return newItem;
}

export async function updateSchedule(id, updatedFields) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_SCHEDULES) || "[]");
  const idx = list.findIndex((s) => s.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updatedFields };
    localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(list));
  }
  if (isFirebaseConnected && db) {
    try {
      await setDoc(doc(db, "schedules", id), { ...list[idx], ...updatedFields, id }, { merge: true });
    } catch (e) {
      console.warn("Firebase schedule update failed:", e);
    }
  }
  return list[idx];
}

export async function deleteSchedule(id) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY_SCHEDULES) || "[]").filter(
    (s) => s.id !== id
  );
  localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(list));
  if (isFirebaseConnected && db) {
    try {
      await deleteDoc(doc(db, "schedules", id));
    } catch (e) {
      console.warn("Firebase schedule delete failed:", e);
    }
  }
}


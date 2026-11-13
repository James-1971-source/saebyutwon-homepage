import React, { useState, useEffect } from "react";
import { fetchPosts } from "../services/firebase";
import { INITIAL_SCHEDULES } from "../data/initialData";
import {
  Search, Pin, Download, Calendar, Eye, User, FileText,
  ArrowLeft, Paperclip, ChevronRight, Clock
} from "lucide-react";

export default function Board({
  defaultTab = "board-notice",
  selectedPost,
  openPostDetail,
  closePostDetail
}) {
  const [activeCategory, setActiveCategory] = useState("notice");
  const [searchField, setSearchField] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (defaultTab && defaultTab.startsWith("board-")) {
      setActiveCategory(defaultTab.replace("board-", ""));
    }
  }, [defaultTab]);

  useEffect(() => {
    if (activeCategory !== "schedule") {
      fetchPosts(activeCategory).then(setPosts);
    }
  }, [activeCategory]);

  const filteredPosts = posts.filter((p) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    if (searchField === "title") return (p.title || "").toLowerCase().includes(q);
    if (searchField === "content") return (p.content || "").toLowerCase().includes(q);
    if (searchField === "author") return (p.author || "").toLowerCase().includes(q);
    return (
      (p.title || "").toLowerCase().includes(q) ||
      (p.content || "").toLowerCase().includes(q) ||
      (p.author || "").toLowerCase().includes(q)
    );
  });

  const tabs = [
    { id: "notice", label: "공지사항 (회의록·공고)" },
    { id: "gallery", label: "새볕 갤러리" },
    { id: "schedule", label: "일정 안내" },
    { id: "data", label: "자료실 (서식)" },
    { id: "finance", label: "재정공시" }
  ];

  return (
    <div className="board-page">
      <div className="sub-hero">
        <div className="container">
          <h1>새볕 소식</h1>
          <p>새볕원의 공지사항, 활동 갤러리, 월간 일정, 각종 서식 및 투명한 재정보고를 확인하세요.</p>
        </div>
      </div>

      <div className="sub-nav-tabs">
        <div className="container sub-nav-tabs-inner flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                closePostDetail && closePostDetail();
                setActiveCategory(t.id);
              }}
              className={`sub-nav-tab ${activeCategory === t.id ? "active" : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-12">
        {selectedPost ? (
          <div className="card-box p-8 max-w-4xl mx-auto">
            <button
              onClick={closePostDetail}
              className="text-xs font-bold text-stone-500 hover:text-orange-600 mb-6 flex items-center gap-1.5"
            >
              <ArrowLeft size={16} />
              <span>목록으로 돌아가기</span>
            </button>

            <div className="border-b border-stone-200 pb-5 mb-6">
              <span className={`post-badge badge-${selectedPost.category} mb-2 inline-block`}>
                {selectedPost.category === "notice" && "공지사항"}
                {selectedPost.category === "gallery" && "새볕 갤러리"}
                {selectedPost.category === "data" && "자료실"}
                {selectedPost.category === "finance" && "재정공시"}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mb-3">
                {selectedPost.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400">
                <span className="flex items-center gap-1"><User size={13} /> {selectedPost.author}</span>
                <span className="flex items-center gap-1"><Calendar size={13} /> {selectedPost.createdAt}</span>
                <span className="flex items-center gap-1"><Eye size={13} /> 조회수 {selectedPost.views || 0}</span>
              </div>
            </div>

            {selectedPost.files && selectedPost.files.length > 0 && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-6">
                <div className="text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
                  <Paperclip size={14} className="text-orange-600" />
                  <span>첨부파일 ({selectedPost.files.length}개)</span>
                </div>
                <div className="space-y-1.5">
                  {selectedPost.files.map((file, idx) => (
                    <a
                      key={idx}
                      href={file.url || "#"}
                      download={file.name}
                      onClick={(e) => {
                        if (file.url === "#") {
                          e.preventDefault();
                          alert(`'${file.name}' 파일은 관리자센터에서 실제 서류를 업로드하면 즉시 다운로드됩니다.`);
                        }
                      }}
                      className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded-lg text-xs hover:border-orange-500 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-stone-400" />
                        <span className="font-semibold text-stone-800">{file.name}</span>
                        <span className="text-stone-400">({file.size})</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600 font-bold">
                        <Download size={13} />
                        <span>다운로드</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div
              className="prose prose-stone max-w-none text-stone-800 leading-relaxed py-4"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />

            {selectedPost.image && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-stone-200">
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full" />
              </div>
            )}

            <div className="border-t border-stone-200 pt-6 mt-8 flex justify-center">
              <button onClick={closePostDetail} className="btn-secondary px-8 py-2.5 text-sm">
                목록 보기
              </button>
            </div>
          </div>
        ) : activeCategory === "schedule" ? (
          /* 일정 안내 (새론 스타일) */
          <div className="card-box p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-extrabold text-orange-600 uppercase">MONTHLY SCHEDULE</span>
                <h2 className="text-2xl font-extrabold text-stone-900 mt-1">새볕원 이달의 주요 일정 안내</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full">
                <Clock size={13} /> 2026년 11월 일정
              </span>
            </div>

            <div className="space-y-3">
              {INITIAL_SCHEDULES.map((sch) => (
                <div
                  key={sch.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="px-3 py-2 rounded-lg bg-orange-600 text-white text-xs font-extrabold min-w-[100px] text-center">
                      {sch.date}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-orange-600">[{sch.category}]</span>
                      <h4 className="font-bold text-stone-900 text-base">{sch.title}</h4>
                    </div>
                  </div>
                  <span className="text-xs bg-white border border-stone-200 text-stone-600 px-3 py-1 rounded-full font-semibold">
                    대상: {sch.target}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* 구분별 검색 바 */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div className="text-sm font-semibold text-stone-600">
                총 <strong className="text-orange-600">{filteredPosts.length}</strong>건의 게시물이 있습니다.
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="form-select text-xs py-2 w-28"
                >
                  <option value="all">전체</option>
                  <option value="title">제목</option>
                  <option value="content">내용</option>
                  <option value="author">작성자</option>
                </select>
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input text-xs py-2 pr-8"
                  />
                  <Search size={14} className="absolute right-2.5 top-2.5 text-stone-400" />
                </div>
              </div>
            </div>

            {activeCategory === "gallery" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
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
                    </div>
                    <div className="facility-card-body p-5">
                      <div className="text-xs text-orange-600 font-semibold mb-1">{post.createdAt}</div>
                      <h3 className="font-bold text-stone-900 text-base mb-2 line-clamp-1">{post.title}</h3>
                      <p className="text-xs text-stone-500 line-clamp-2 mb-4">
                        {post.summary || "새볕원 활동 현장 모습입니다."}
                      </p>
                      <span className="text-xs font-bold text-stone-700 flex items-center gap-1 hover:text-orange-600">
                        <span>자세히 보기</span>
                        <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-box p-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-stone-700 text-xs font-bold border-b border-stone-200">
                      <th className="py-3 px-4 w-16 text-center">번호</th>
                      <th className="py-3 px-4">제목</th>
                      <th className="py-3 px-4 w-28 text-center hidden md:table-cell">작성자</th>
                      <th className="py-3 px-4 w-28 text-center">작성일</th>
                      <th className="py-3 px-4 w-20 text-center hidden md:table-cell">조회</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post, idx) => (
                      <tr
                        key={post.id}
                        onClick={() => openPostDetail(post)}
                        className="border-b border-stone-100 hover:bg-amber-50/40 cursor-pointer transition-colors text-sm"
                      >
                        <td className="py-3.5 px-4 text-center text-xs text-stone-400">
                          {post.isPinned ? (
                            <Pin size={14} className="text-orange-600 mx-auto" />
                          ) : (
                            filteredPosts.length - idx
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-stone-800">
                          <div className="flex items-center gap-2">
                            {post.isPinned && (
                              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                공지
                              </span>
                            )}
                            <span className="hover:text-orange-600 transition-colors">{post.title}</span>
                            {post.files && post.files.length > 0 && (
                              <Paperclip size={13} className="text-stone-400" />
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs text-stone-500 hidden md:table-cell">
                          {post.author}
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs text-stone-400">{post.createdAt}</td>
                        <td className="py-3.5 px-4 text-center text-xs text-stone-400 hidden md:table-cell">
                          {post.views || 0}
                        </td>
                      </tr>
                    ))}

                    {filteredPosts.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-stone-400 text-sm">
                          게시물이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


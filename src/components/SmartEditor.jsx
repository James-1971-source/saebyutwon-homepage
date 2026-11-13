import React, { useRef, useState } from "react";
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Paperclip,
  Undo, Redo
} from "lucide-react";
import { uploadFile } from "../services/firebase";

export default function SmartEditor({ value, onChange, onFilesChange, attachedFiles = [] }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const execCmd = (command, val = null) => {
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploaded = await uploadFile(file);
      document.execCommand("insertImage", false, uploaded.url);
      handleInput();
    } catch (err) {
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploaded = await uploadFile(file);
      if (onFilesChange) {
        onFilesChange([...attachedFiles, uploaded]);
      }
    } catch (err) {
      alert("파일 첨부 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
      if (docInputRef.current) docInputRef.current.value = "";
    }
  };

  const removeAttachedFile = (index) => {
    if (onFilesChange) {
      const updated = [...attachedFiles];
      updated.splice(index, 1);
      onFilesChange(updated);
    }
  };

  return (
    <div className="smart-editor-container border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="editor-toolbar bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 text-slate-700">
        <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
          <button
            type="button"
            onClick={() => execCmd("undo")}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors"
            title="실행 취소"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("redo")}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors"
            title="다시 실행"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
          <button
            type="button"
            onClick={() => execCmd("formatBlock", "<h1>")}
            className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-200 transition-colors"
            title="큰 제목 (H1)"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => execCmd("formatBlock", "<h2>")}
            className="px-2 py-1 text-xs font-semibold rounded hover:bg-slate-200 transition-colors"
            title="중간 제목 (H2)"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => execCmd("formatBlock", "<p>")}
            className="px-2 py-1 text-xs rounded hover:bg-slate-200 transition-colors"
            title="본문 일반 텍스트"
          >
            본문
          </button>
        </div>

        <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
          <button
            type="button"
            onClick={() => execCmd("bold")}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors font-bold"
            title="굵게"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("italic")}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors"
            title="기울임"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("underline")}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors"
            title="밑줄"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("strikeThrough")}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors"
            title="취소선"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
          <button
            type="button"
            onClick={() => execCmd("justifyLeft")}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors"
            title="왼쪽 정렬"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("justifyCenter")}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors"
            title="가운데 정렬"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("justifyRight")}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors"
            title="오른쪽 정렬"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
          <button
            type="button"
            onClick={() => execCmd("insertUnorderedList")}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors"
            title="글머리 기호 목록"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd("insertOrderedList")}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors"
            title="번호 매기기 목록"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
          <input
            type="color"
            onChange={(e) => execCmd("foreColor", e.target.value)}
            className="w-6 h-6 border-0 p-0 cursor-pointer rounded overflow-hidden"
            title="글자 색상"
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              const url = prompt("연결할 웹사이트 링크(URL)를 입력하세요:", "https://");
              if (url) execCmd("createLink", url);
            }}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors"
            title="링크 삽입"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
            title="본문에 사진 삽입"
            disabled={isUploading}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>사진 삽입</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => docInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded border border-orange-200 transition-colors"
            title="서류 파일(HWP, PDF, DOCX 등) 첨부"
            disabled={isUploading}
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>파일 첨부</span>
          </button>
          <input
            type="file"
            ref={docInputRef}
            onChange={handleDocUpload}
            className="hidden"
          />
        </div>

        {isUploading && (
          <span className="text-xs text-orange-600 animate-pulse ml-auto font-medium">
            파일 최적화 업로드 중...
          </span>
        )}
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="editor-content-area p-5 min-h-[300px] max-h-[500px] overflow-y-auto focus:outline-none prose prose-slate max-w-none text-slate-800 leading-relaxed"
        placeholder="내용을 작성해주세요. 사진을 삽입하거나 텍스트 서식을 자유롭게 적용할 수 있습니다."
      />

      {attachedFiles.length > 0 && (
        <div className="attached-files-list bg-slate-50 border-t border-slate-200 p-3">
          <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
            <Paperclip className="w-3.5 h-3.5 text-orange-600" />
            <span>첨부된 서류 ({attachedFiles.length}개)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-white border border-slate-300 px-2.5 py-1 rounded-lg text-xs text-slate-700 shadow-sm"
              >
                <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                <span className="text-slate-400">({file.size})</span>
                <button
                  type="button"
                  onClick={() => removeAttachedFile(idx)}
                  className="text-red-500 hover:text-red-700 font-bold ml-1 text-sm leading-none"
                  title="첨부 취소"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


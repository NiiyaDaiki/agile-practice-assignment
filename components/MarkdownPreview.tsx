"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownPreview({ value }: { value: string }) {
  return (
    <div className="prose border p-4 rounded bg-gray-50 overflow-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {value || "_(プレビューはここに表示されます)_"}
      </ReactMarkdown>
    </div>
  );
}

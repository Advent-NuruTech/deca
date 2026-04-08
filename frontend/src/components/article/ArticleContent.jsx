// src/components/article/ArticleContent.jsx
import { Tag } from "lucide-react";

const ArticleContent = ({ content, tags }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
      <div
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-li:text-gray-700"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-200">
          <Tag size={16} className="text-gray-400 mt-0.5" />
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleContent;

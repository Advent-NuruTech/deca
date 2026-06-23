import { Tag } from "lucide-react";

const ArticleContent = ({ content, tags }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
      <div
        className="prose prose-lg max-w-none
          prose-headings:text-gray-900
          prose-h1:text-4xl prose-h1:font-bold
          prose-h2:text-3xl prose-h2:font-semibold
          prose-h3:text-2xl prose-h3:font-semibold
          prose-h4:text-xl prose-h4:font-medium
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 prose-strong:font-bold
          prose-em:text-gray-800
          prose-ul:text-gray-700 prose-ul:list-disc prose-ul:pl-5
          prose-ol:text-gray-700 prose-ol:list-decimal prose-ol:pl-5
          prose-li:text-gray-700
          prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
          prose-img:rounded-lg prose-img:shadow-md
          prose-pre:bg-gray-100 prose-pre:text-gray-800
          prose-code:text-emerald-700 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
        "
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

// src/components/articles/CategoryStats.jsx
const CategoryStats = ({ articles }) => {
  const counts = articles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {});

  const categoryLabels = {
    faith: "Faith Blogs",
    recipe: "Recipes",
    agriculture: "Agriculture",
    homeschooling: "Homeschooling",
    study: "Study Materials",
  };

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {Object.entries(counts).map(([cat, count]) => (
        <span
          key={cat}
          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
        >
          {categoryLabels[cat] || cat}: {count}
        </span>
      ))}
    </div>
  );
};

export default CategoryStats;

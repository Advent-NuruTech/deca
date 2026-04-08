// src/components/SEO.jsx
import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
}) => {
  const siteName = "RemSam Homestead";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullDescription =
    description ||
    "RemSam Homestead – Faith, Family, Farming. Inspiring content on faith, organic recipes, agriculture, homeschooling, free study materials, and farm‑fresh products in Kenya.";
  const fullKeywords = [
    "RemSam Homestead",
    "Faith",
    "Family",
    "Farming",
    "Organic Seeds",
    "Homeschooling",
    "Study Materials",
    "Kenya",
    "Kakamega",
    "Butere",
    ...keywords,
  ].join(", ");

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url || window.location.href} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || window.location.href} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      {image && <meta property="twitter:image" content={image} />}

      {/* Canonical URL */}
      <link rel="canonical" href={url || window.location.href} />
    </Helmet>
  );
};

export default SEO;

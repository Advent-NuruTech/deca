import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
}) => {
  const siteName = "Fancy Tech Integration South Sudan";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullDescription =
    description ||
    "Fancy Tech Integration South Sudan - Leading provider of Starlink Kits, Networking Equipment, Laptops, Phones, and Software Solutions in South Sudan";
  const fullKeywords = [
    "Fancy Tech Integration South Sudan",
    "F.T.I. South Sudan",
    "Starlink South Sudan",
    "Networking Equipment",
    "Laptops South Sudan",
    "Phones South Sudan",
    "Software Solutions",
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

// pages/HomePage.jsx (updated with new sections)
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SEO from "../components/SEO";
import HomeHero from "../components/HomeHero";
import OurFeatures from "../components/OurFeatures";
import CategoriesSection from "../components/CategoriesSection";
import Products from "../components/Products";
import CTASection from "../components/CTASection";
import RecentArticles from "../components/RecentArticles";
import { fetchProducts } from "../store/slices/productSlice";
import { fetchArticles } from "../store/slices/articleSlice";
import category1 from "../assets/pngwing.com (15).png";
import category2 from "../assets/pngwing.com (16).png";
import category3 from "../assets/pngwing.com (17).png";
import category4 from "../assets/pngwing.com (18).png";
import SoftwareServices from "../components/SoftwareServices";
import FloatingActions from "../components/FloatingActions";

const HomePage = () => {
  const dispatch = useDispatch();

  const { products, loading: productsLoading } = useSelector(
    (state) => state.products,
  );
  const { articles, loading: articlesLoading } = useSelector(
    (state) => state.articles,
  );

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchArticles());
  }, [dispatch]);

  // Category information
  const categoryInfo = {
    starlink: {
      title: "Starlink Kits",
      description: "High-speed satellite internet solutions for remote areas",
      image: category1,
      icon: "🛰️",
    },
    networking: {
      title: "Networking",
      description: "Professional networking equipment and accessories",
      image: category2,
      icon: "🌐",
    },
    laptops: {
      title: "Laptops",
      description: "Quality laptops from leading manufacturers",
      image: category3,
      icon: "💻",
    },
    phones: {
      title: "Phones",
      description: "Latest smartphones and mobile devices",
      image: category4,
      icon: "📱",
    },
    software: {
      title: "Software",
      description: "Custom software solutions for your business",
      image: category1,
      icon: "⚙️",
    },
    cctv: {
      title: "CCTV Equipment",
      description: "Professional surveillance and monitoring systems",
      image: category2,
      icon: "📹",
    },
  };

  // Group products by category
  const productsByCategory = {};
  if (products?.length) {
    products.forEach((product) => {
      if (!productsByCategory[product.category]) {
        productsByCategory[product.category] = [];
      }
      productsByCategory[product.category].push(product);
    });
  }

  const recentArticles = articles?.slice(0, 3) || [];

  return (
    <>
      <SEO
        title="Home - Fancy Tech Integration South Sudan"
        description="Leading technology company in South Sudan providing Starlink Kits, Networking Equipment, Laptops, Phones, and Software Solutions."
        keywords={[
          "Fancy Tech Integration",
          "F.T.I. South Sudan",
          "Technology Solutions",
          "Starlink South Sudan",
          "Networking Equipment",
        ]}
      />

      <HomeHero />
      <OurFeatures />
      <SoftwareServices />
      <CategoriesSection categoryInfo={categoryInfo} />
      <Products products={products} />
      <CTASection />
      <FloatingActions />
      <RecentArticles
        recentArticles={recentArticles}
        articlesLoading={articlesLoading}
      />
    </>
  );
};

export default HomePage;

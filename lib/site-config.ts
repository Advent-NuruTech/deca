export const siteConfig = {
  name: "Deca Bookstore",
  shortName: "Deca Bookstore",
  tagline: "Revision materials for learners.",
  email: "denniskamau025@gmail.com",
  description:
    "Deca Bookstore supplies KJSEA revision materials for learners, schools, and bulk buyers, with free delivery available.",
} as const;

/** Public contact channels approved for use across the website. */
export const officialPhoneContacts = [
  { label: "Safaricom", number: "0742445600" },
  { label: "Airtel", number: "0100967771" },
] as const;

export const customerServiceContacts = [
  { label: "Gents", number: "0183153489" },
  { label: "Ladies", number: "0183175447" },
] as const;

export const serviceAreas = [
  { title: "Health & wellness consultancy", summary: "Education, assessments, prevention and workplace wellness programmes.", items: ["Health education", "Preventive-health education", "Wellness assessments", "Corporate wellness education"] },
  { title: "Nutrition & healthy food", summary: "Practical nutrition education, healthy cooking and hygienic food services.", items: ["Healthy meal planning", "Cooking demonstrations", "Healthy-food catering", "Plant-based nutrition education"] },
  { title: "Wellness coaching", summary: "Personal, family, group and online coaching for sustainable healthy habits.", items: ["Lifestyle coaching", "Weight-management education", "Stress-management education", "Wellness membership programmes"] },
  { title: "Natural & herbal wellness", summary: "Traditional knowledge and herbal education within a recognized and lawful scope.", items: ["Medicinal-plant education", "Herb cultivation education", "Herbal product information", "Licensed-professional referrals"] },
  { title: "Medical-missionary & community health", summary: "Outreach, talks, campaigns and navigation that support community wellbeing.", items: ["Community health outreach", "First-aid education", "Health publications", "Health-service navigation"] },
  { title: "Training, media & hospitality", summary: "Short courses, digital education, healthy-food hospitality and wellness-centre consultancy.", items: ["Health & wellness courses", "Online courses and webinars", "Health-food café activities", "Wellness programme development"] },
] as const;

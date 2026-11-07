import { faqs } from "../data/faq.data.js";

// Get all available FAQs.
export const getAllFAQs = () => {
  return faqs;
};

// Get all unique FAQ categories.
export const getFAQCategories = () => {
  return [...new Set(faqs.map((faq) => faq.category))];
};

// Get FAQ by ID.
export const getFAQById = (id) => {
  return faqs.find((faq) => faq.id.toLowerCase() === id.toLowerCase());
};

// Search FAQs by keyword.
export const searchFAQs = (keyword, category) => {
  const normalizedKeyword = keyword?.trim().toLowerCase();
  const normalizedCategory = category?.trim().toLowerCase();

  return faqs.filter((faq) => {
    const matchesCategory =
      !normalizedCategory || faq.category.toLowerCase() === normalizedCategory;

    const searchableContent = [faq.question, faq.answer, ...faq.keywords]
      .join(" ")
      .toLowerCase();

    const matchesKeyword =
      !normalizedKeyword || searchableContent.includes(normalizedKeyword);

    return matchesCategory && matchesKeyword;
  });
};

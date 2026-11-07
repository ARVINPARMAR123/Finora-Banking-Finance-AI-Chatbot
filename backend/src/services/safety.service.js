import { safetyData } from "../data/safety.data.js";

// Get all financial safety information.
export const getAllSafetyInfo = () => {
  return safetyData;
};

// Get all unique safety categories.
export const getSafetyCategories = () => {
  return [...new Set(safetyData.map((item) => item.category))];
};

// Search safety information using keyword and category.
export const searchSafetyInfo = (keyword, category) => {
  const normalizedKeyword = keyword?.trim().toLowerCase();
  const normalizedCategory = category?.trim().toLowerCase();

  return safetyData.filter((item) => {
    const matchesCategory =
      !normalizedCategory || item.category.toLowerCase() === normalizedCategory;

    if (!matchesCategory) {
      return false;
    }

    if (!normalizedKeyword) {
      return true;
    }

    const searchableText = [
      item.title,
      item.description,
      item.category,
      ...item.warningSigns,
      ...item.whatToDo,
      ...item.prevention,
      ...item.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedKeyword);
  });
};

// Get safety information by ID.
export const getSafetyInfoById = (id) => {
  return safetyData.find((item) => item.id.toLowerCase() === id.toLowerCase());
};

// Get emergency financial fraud guidance.
export const getEmergencyGuidance = () => {
  return {
    title: "Financial Cyber Fraud – Emergency Guidance",
    country: "India",
    steps: [
      "Call 1930, the National Cyber Crime Helpline, as soon as possible.",
      "Report the incident at https://cybercrime.gov.in.",
      "Contact your bank immediately using its official customer support channel.",
      "Ask your bank to secure your account and block affected cards or payment methods if necessary.",
      "Keep transaction IDs, messages and other relevant evidence for reporting.",
    ],
    importantNote:
      "Never share your OTP, UPI PIN, ATM PIN, CVV or banking password with anyone, including someone claiming to help you report fraud.",
  };
};

// Identify whether a chatbot message is related to financial safety.
export const getSafetyResponseForMessage = (message) => {
  const normalizedMessage = message.trim().toLowerCase();

  // Give emergency reporting guidance priority.
  const emergencyKeywords = [
    "1930",
    "report cyber fraud",
    "report financial fraud",
    "money debited",
    "money deducted without permission",
    "unauthorised transaction",
    "unauthorized transaction",
    "someone stole my money",
    "i was scammed",
    "i have been scammed",
    "i got scammed",
  ];

  const isEmergency = emergencyKeywords.some((keyword) =>
    normalizedMessage.includes(keyword),
  );

  if (isEmergency) {
    const emergency = getEmergencyGuidance();

    return {
      type: "emergency",
      title: emergency.title,
      response: [
        emergency.title,
        "",
        ...emergency.steps.map((step, index) => `${index + 1}. ${step}`),
        "",
        `Important: ${emergency.importantNote}`,
      ].join("\n"),
    };
  }

  // Find the most relevant safety topic using matching keywords.
  const matches = safetyData
    .flatMap((item) =>
      item.keywords.map((keyword) => ({
        item,
        keyword: keyword.toLowerCase(),
      })),
    )
    .filter(({ keyword }) => normalizedMessage.includes(keyword))
    .sort((a, b) => b.keyword.length - a.keyword.length);

  if (matches.length === 0) {
    return null;
  }

  const safetyInfo = matches[0].item;

  const response = [
    safetyInfo.title,
    "",
    safetyInfo.description,
    "",
    "Warning signs:",
    ...safetyInfo.warningSigns.map((item) => `- ${item}`),
    "",
    "What you should do:",
    ...safetyInfo.whatToDo.map((item) => `- ${item}`),
    "",
    "Prevention:",
    ...safetyInfo.prevention.map((item) => `- ${item}`),
  ].join("\n");

  return {
    type: "safety",
    title: safetyInfo.title,
    safetyId: safetyInfo.id,
    response,
  };
};

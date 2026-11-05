/**
 * Banking & Finance Domain Service
 *
 * Purpose:
 * Identify whether a user's message belongs to
 * banking and finance.
 *
 * This service uses local keyword and context-based
 * detection. No external AI API is required.
 */

// Banking-related topics
const bankingPatterns = [
  /\bbank(?:ing)?\b/i,
  /\bsavings account\b/i,
  /\bcurrent account\b/i,
  /\baccount opening\b/i,
  /\baccount statement\b/i,
  /\bpassbook\b/i,
  /\bcheque\b/i,
  /\bwithdrawals?\b/i,
  /\bdeposits?\b/i,
  /\bfixed deposit\b/i,
  /\brecur(?:ring)? deposit\b/i,
  /\bnet banking\b/i,
  /\binternet banking\b/i,
  /\bmobile banking\b/i,
  /\bupi\b/i,
  /\bneft\b/i,
  /\brtgs\b/i,
  /\bimps\b/i,
  /\batm\b/i,
  /\bdebit card\b/i,
  /\bcredit card\b/i,
  /\bk\s*y\s*c\b/i,
];

// Loans and interest-related topics
const loanPatterns = [
  /\bloan\b/i,
  /\bemi\b/i,
  /\bmortgage\b/i,
  /\bhome loan\b/i,
  /\bcar loan\b/i,
  /\bvehicle loan\b/i,
  /\bpersonal loan\b/i,
  /\beducation loan\b/i,
  /\bbusiness loan\b/i,
  /\binterest rate\b/i,
  /\bsimple interest\b/i,
  /\bcompound interest\b/i,
  /\bloan repayment\b/i,
  /\bcredit score\b/i,
  /\bcredit report\b/i,
  /\bdebt management\b/i,
];

// Personal finance topics
const financePatterns = [
  /\bbudget(?:ing)?\b/i,
  /\bsavings plan\b/i,
  /\bfinancial planning\b/i,
  /\bpersonal finance\b/i,
  /\bmonthly expenses?\b/i,
  /\bincome management\b/i,
  /\bexpense management\b/i,
  /\bfinancial goals?\b/i,
  /\binflation\b/i,
  /\bnet worth\b/i,
  /\bcash flow\b/i,
  /\bretirement planning\b/i,
  /\bpension\b/i,
  /\btax planning\b/i,
  /\btax saving\b/i,
];

// Investment and insurance topics
const investmentPatterns = [
  /\binvest(?:ment|ing)?\b/i,
  /\bmutual funds?\b/i,
  /\bstocks?\b/i,
  /\bshares?\b/i,
  /\bbonds?\b/i,
  /\bsecurities\b/i,
  /\bportfolio\b/i,
  /\bdividend\b/i,
  /\breturns?\b/i,
  /\brisk management\b/i,
  /\bdiversification\b/i,
  /\binsurance\b/i,
  /\blife insurance\b/i,
  /\bhealth insurance\b/i,
];

// Banking fraud and financial safety topics
const fraudPatterns = [
  /\bbanking fraud\b/i,
  /\bfinancial fraud\b/i,
  /\bpayment fraud\b/i,
  /\bupi fraud\b/i,
  /\bupi scam\b/i,
  /\bphishing\b/i,
  /\bponzi scheme\b/i,
  /\bonline banking scam\b/i,
  /\bcredit card fraud\b/i,
  /\bdebit card fraud\b/i,
  /\bidentity theft\b/i,
  /\bunauthori[sz]ed transaction\b/i,
  /\bdigital payment fraud\b/i,
  /\bcyber fraud\b/i,
  /\bcybercrime\b/i,
];

// Common financial terms that need additional context
const contextualFinancePattern =
  /\b(interest|balance|account|deposit|withdrawal|money|payment|charge|transaction|capital|tax)\b/i;

const financialActionPattern =
  /\b(calculate|earn|pay|save|borrow|repay|transfer|invest|spend|manage|deposit|withdraw|receive|send|check|compare|explain|understand)\b/i;

/**
 * Check whether a message matches any given pattern.
 */
const matchesAnyPattern = (message, patterns) => {
  return patterns.some((pattern) => pattern.test(message));
};

/**
 * Check whether a message belongs to banking and finance.
 *
 * @param {string} message
 * @returns {{ isAllowed: boolean, category: string }}
 */
export const checkFinanceDomain = (message) => {
  const normalizedMessage = message.trim();

  // Check recognised banking topics
  if (matchesAnyPattern(normalizedMessage, bankingPatterns)) {
    return {
      isAllowed: true,
      category: "banking",
    };
  }

  // Check loan and interest topics
  if (matchesAnyPattern(normalizedMessage, loanPatterns)) {
    return {
      isAllowed: true,
      category: "loans",
    };
  }

  // Check personal finance topics
  if (matchesAnyPattern(normalizedMessage, financePatterns)) {
    return {
      isAllowed: true,
      category: "personal_finance",
    };
  }

  // Check investments and insurance
  if (matchesAnyPattern(normalizedMessage, investmentPatterns)) {
    return {
      isAllowed: true,
      category: "investment_and_insurance",
    };
  }

  // Check financial fraud awareness
  if (matchesAnyPattern(normalizedMessage, fraudPatterns)) {
    return {
      isAllowed: true,
      category: "financial_safety",
    };
  }

  // Ambiguous terms require an action or financial context.
  if (
    matchesAnyPattern(normalizedMessage, [contextualFinancePattern]) &&
    matchesAnyPattern(normalizedMessage, [financialActionPattern])
  ) {
    return {
      isAllowed: true,
      category: "contextual_finance",
    };
  }

  // Unknown or unrelated topics are rejected.
  return {
    isAllowed: false,
    category: "out_of_scope",
  };
};

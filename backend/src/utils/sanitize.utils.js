/*
  Sensitive Banking Information Detection Utility

  Detects:
  1. OTP
  2. ATM PIN
  3. CVV / CVC
  4. Bank Account Number
  5. Debit / Credit Card Number
*/

// Check whether a card number passes the Luhn algorithm
const isValidLuhnNumber = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, "");

  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);

    if (shouldDouble) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

// Detect sensitive information in a message
export const detectSensitiveInformation = (message) => {
  const detectedTypes = [];

  // OTP detection
  const otpPattern =
    /\b(?:otp|one[-\s]?time password|verification code)\b\s*(?:is|:|=|-)?\s*\d{4,8}\b/i;

  if (otpPattern.test(message)) {
    detectedTypes.push("OTP");
  }

  // ATM PIN detection
  const pinPattern = /\b(?:atm\s*)?pin\b\s*(?:is|:|=|-)?\s*\d{4,6}\b/i;

  if (pinPattern.test(message)) {
    detectedTypes.push("ATM PIN");
  }

  // CVV / CVC detection
  const cvvPattern =
    /\b(?:cvv|cvc|card verification value)\b\s*(?:is|:|=|-)?\s*\d{3,4}\b/i;

  if (cvvPattern.test(message)) {
    detectedTypes.push("CVV/CVC");
  }

  // Bank account number detection
  const accountPattern =
    /\b(?:bank\s*)?(?:account|a\/c)\s*(?:number|no\.?|#)\s*(?:is|:|=|-)?\s*\d{6,18}\b/i;

  if (accountPattern.test(message)) {
    detectedTypes.push("Bank Account Number");
  }

  // Card number detection using its label
  const cardLabelPattern =
    /\b(?:(?:debit|credit)\s+)?card\s*(?:number|no\.?|#)\s*(?:is|:|=|-)?\s*(?:\d[ -]?){13,19}\b/i;

  if (cardLabelPattern.test(message)) {
    detectedTypes.push("Payment Card Number");
  }

  // Detect unlabelled card numbers using Luhn algorithm
  const cardCandidates = message.matchAll(/(?<!\d)(?:\d[ -]?){13,19}(?!\d)/g);

  for (const candidate of cardCandidates) {
    if (isValidLuhnNumber(candidate[0])) {
      if (!detectedTypes.includes("Payment Card Number")) {
        detectedTypes.push("Payment Card Number");
      }

      break;
    }
  }

  // Return only category names, never the actual values
  return detectedTypes;
};

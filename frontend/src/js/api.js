const API_BASE_URL = "http://localhost:5000/api";

// Send a message to the Banking & Finance AI backend.
export const sendChatMessage = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to process your message.");
    }

    if (!result.success || !result.data?.response) {
      throw new Error("The server returned an unexpected response.");
    }

    return result.data.response;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the server. Please check whether the backend is running.",
      );
    }

    throw error;
  }
};

// EMI CALCULATOR API
export const calculateEMI = async (emiData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emi/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emiData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const validationErrors = result.errors
        ?.map((error) => error.message)
        .join(" ");

      throw new Error(
        validationErrors || result.message || "Unable to calculate EMI.",
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the backend. Please check whether the server is running.",
      );
    }

    throw error;
  }
};

// SIMPLE INTEREST CALCULATOR API
export const calculateSimpleInterest = async (interestData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/interest/simple`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(interestData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const validationErrors = result.errors
        ?.map((error) => error.message)
        .join(" ");

      throw new Error(
        validationErrors ||
          result.message ||
          "Unable to calculate simple interest.",
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the backend. Please check whether the server is running.",
      );
    }

    throw error;
  }
};

// COMPOUND INTEREST CALCULATOR API
export const calculateCompoundInterest = async (interestData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/interest/compound`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(interestData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const validationErrors = result.errors
        ?.map((error) => error.message)
        .join(" ");

      throw new Error(
        validationErrors ||
          result.message ||
          "Unable to calculate compound interest.",
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the backend. Please check whether the server is running.",
      );
    }

    throw error;
  }
};

// BUDGET PLANNER API
export const analyzeBudget = async (budgetData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/budget/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const validationErrors = result.errors
        ?.map((error) => error.message)
        .join(" ");

      throw new Error(
        validationErrors || result.message || "Unable to analyse your budget.",
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the backend. Please check whether the server is running.",
      );
    }

    throw error;
  }
};

// LOAN ELIGIBILITY CALCULATOR API
export const calculateLoanEligibility = async (loanData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/loan-eligibility/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loanData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const validationErrors = result.errors
        ?.map((error) => error.message)
        .join(" ");

      throw new Error(
        validationErrors ||
          result.message ||
          "Unable to calculate loan eligibility.",
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the backend. Please check whether the server is running.",
      );
    }

    throw error;
  }
};

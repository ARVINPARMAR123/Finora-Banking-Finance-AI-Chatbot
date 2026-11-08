import {
  calculateEMI,
  calculateSimpleInterest,
  calculateCompoundInterest,
  analyzeBudget,
  calculateLoanEligibility,
} from "./api.js";

// ==============================
// EMI CALCULATOR
// ==============================

const financeView = document.getElementById("financeView");

// Create calculator workspace dynamically
const calculatorWorkspace = document.createElement("div");

calculatorWorkspace.id = "calculatorWorkspace";
calculatorWorkspace.className = "mt-8";

financeView.appendChild(calculatorWorkspace);

// ==============================
// EMI FIELD VALIDATION
// ==============================

const validateEMIField = (input) => {
  const errorElement = calculatorWorkspace.querySelector(
    `[data-error-for="${input.name}"]`,
  );

  let message = "";

  if (input.validity.valueMissing) {
    message = "This field is required.";
  } else if (input.validity.badInput) {
    message = "Please enter a valid number.";
  } else if (input.validity.rangeUnderflow) {
    message =
      input.name === "tenureMonths"
        ? "Loan tenure must be at least 1 month."
        : "Value must be greater than 0.";
  } else if (input.validity.rangeOverflow) {
    message =
      input.name === "tenureMonths"
        ? "Loan tenure cannot exceed 1200 months."
        : input.name === "annualInterestRate"
          ? "Interest rate cannot exceed 1000%."
          : "Loan amount exceeds the maximum allowed value.";
  } else if (input.validity.stepMismatch) {
    message =
      input.name === "tenureMonths"
        ? "Loan tenure must be a whole number."
        : "Please enter a valid value.";
  }

  input.classList.toggle("border-red-500", Boolean(message));
  input.classList.toggle("border-[#34424f]", !message);

  input.setAttribute("aria-invalid", message ? "true" : "false");

  if (errorElement) {
    errorElement.textContent = message ? `⚠ ${message}` : "";
    errorElement.classList.toggle("hidden", !message);
    errorElement.classList.toggle("flex", Boolean(message));
  }

  return !message;
};

// DISPLAY EMI FORM
const showEMIForm = () => {
  calculatorWorkspace.innerHTML = `
    <div class="rounded-2xl border border-[#34424f] bg-[#19222c] p-6">

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-white">
          EMI Calculator
        </h2>

        <p class="mt-2 text-sm text-slate-400">
          Calculate your monthly loan instalment.
        </p>
      </div>

      <form id="emiForm" class="space-y-5" novalidate>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Loan Amount (₹)
          </label>

          <input
            type="number"
            name="loanAmount"
            min="0.01"
            max="9007199254740991"
            step="0.01"
            required
            placeholder="Example: 500000"
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          />
        </div>

        <p
  data-error-for="loanAmount"
  class="mt-2 hidden items-center gap-2 text-xs text-red-400"
></p>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Annual Interest Rate (%)
          </label>

          <input
            type="number"
            name="annualInterestRate"
            min="0"
            max="1000"
            step="0.01"
            required
            placeholder="Example: 8.5"
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          />
        </div>
        <p
  data-error-for="annualInterestRate"
  class="mt-2 hidden items-center gap-2 text-xs text-red-400"
></p>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Loan Tenure (Months)
          </label>

          <input
            type="number"
            name="tenureMonths"
            min="1"
            max="1200"
            step="1"
            required
            placeholder="Example: 60"
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          />
        </div>
        <p
  data-error-for="tenureMonths"
  class="mt-2 hidden items-center gap-2 text-xs text-red-400"
></p>

        <button
          type="submit"
          class="rounded-lg bg-[#286b65] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#347e76] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Calculate EMI
        </button>

      </form>

      <div id="emiResult" class="mt-6"></div>

    </div>
  `;
  const emiForm = document.getElementById("emiForm");

  emiForm.addEventListener("input", (event) => {
    if (event.target.matches("input")) {
      validateEMIField(event.target);
    }
  });

  emiForm.addEventListener(
    "blur",
    (event) => {
      if (event.target.matches("input")) {
        validateEMIField(event.target);
      }
    },
    true,
  );

  calculatorWorkspace.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

// OPEN EMI FORM WHEN CARD IS CLICKED
financeView.addEventListener("click", (event) => {
  const emiCard = event.target.closest('[data-calculator="emi"]');

  if (!emiCard) return;

  showEMIForm();
});

// HANDLE EMI FORM SUBMISSION
calculatorWorkspace.addEventListener("submit", async (event) => {
  if (event.target.id !== "emiForm") return;

  event.preventDefault();

  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const resultContainer = document.getElementById("emiResult");

  const fields = [
    form.elements.loanAmount,
    form.elements.annualInterestRate,
    form.elements.tenureMonths,
  ];

  const invalidFields = fields.filter((input) => !validateEMIField(input));

  if (invalidFields.length > 0) {
    invalidFields[0].focus();
    return;
  }

  const emiData = {
    loanAmount: Number(form.elements.loanAmount.value),
    annualInterestRate: Number(form.elements.annualInterestRate.value),
    tenureMonths: Number(form.elements.tenureMonths.value),
  };

  submitButton.disabled = true;
  submitButton.textContent = "Calculating...";

  resultContainer.innerHTML = "";

  try {
    const result = await calculateEMI(emiData);

    const formatCurrency = (amount) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(amount);

    resultContainer.innerHTML = `
      <div class="rounded-xl border border-[#286b65] bg-[#142c2b] p-5">

        <h3 class="mb-4 text-lg font-semibold text-white">
          EMI Calculation Result
        </h3>

        <div class="grid gap-4 sm:grid-cols-3">

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">Monthly EMI</p>
            <p class="mt-2 text-xl font-bold text-[#9de0d4]">
              ${formatCurrency(result.monthlyEMI)}
            </p>
          </div>

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">Total Interest</p>
            <p class="mt-2 text-xl font-bold text-white">
              ${formatCurrency(result.totalInterest)}
            </p>
          </div>

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">Total Repayment</p>
            <p class="mt-2 text-xl font-bold text-white">
              ${formatCurrency(result.totalRepayment)}
            </p>
          </div>

        </div>

        <p class="mt-4 text-xs text-slate-400">
          This is an estimated calculation. Actual loan terms may vary
          depending on the lender.
        </p>

      </div>
    `;
  } catch (error) {
    const errorMessage = document.createElement("p");

    errorMessage.className =
      "rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400";

    errorMessage.textContent = error.message;

    resultContainer.appendChild(errorMessage);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Calculate EMI";
  }
});

// ==============================
// REUSABLE FINANCE FORM VALIDATION
// ==============================

const validateFinanceField = (field) => {
  let errorElement = field.parentElement.querySelector(
    ":scope > [data-field-error]",
  );

  if (!errorElement) {
    errorElement = document.createElement("p");
    errorElement.dataset.fieldError = "true";
    errorElement.className =
      "mt-2 flex items-center gap-2 text-xs text-red-400";

    field.insertAdjacentElement("afterend", errorElement);
  }

  let message = "";

  if (field.validity.valueMissing) {
    message = "This field is required.";
  } else if (field.validity.badInput) {
    message = "Please enter a valid number.";
  } else if (field.type === "text" && field.required && !field.value.trim()) {
    message = "Please enter a category.";
  } else if (field.validity.rangeUnderflow) {
    message = `Value must be at least ${field.min}.`;
  } else if (field.validity.rangeOverflow) {
    message = `Value cannot exceed ${field.max}.`;
  } else if (field.validity.stepMismatch) {
    message =
      field.step === "1"
        ? "Please enter a whole number."
        : "Please enter a valid value.";
  }

  field.classList.toggle("border-red-500", Boolean(message));
  field.classList.toggle("border-[#34424f]", !message);

  field.setAttribute("aria-invalid", message ? "true" : "false");

  errorElement.textContent = message ? `⚠ ${message}` : "";
  errorElement.classList.toggle("hidden", !message);

  return !message;
};

const validateFinanceForm = (form) => {
  const fields = [...form.querySelectorAll("input, select, textarea")];

  const invalidFields = fields.filter((field) => !validateFinanceField(field));

  if (invalidFields.length > 0) {
    invalidFields[0].focus();
    return false;
  }

  return true;
};

const setupFinanceValidation = (form) => {
  form.setAttribute("novalidate", "");

  // Keep expense input and its error message together.
  form.querySelectorAll(".expense-row input").forEach((input) => {
    if (input.parentElement.classList.contains("finance-field")) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "finance-field min-w-0";

    input.parentElement.insertBefore(wrapper, input);
    wrapper.appendChild(input);
  });

  form.addEventListener("input", (event) => {
    if (event.target.matches("input, select, textarea")) {
      validateFinanceField(event.target);
    }
  });

  form.addEventListener("change", (event) => {
    if (event.target.matches("input, select, textarea")) {
      validateFinanceField(event.target);
    }
  });

  form.addEventListener(
    "focusout",
    (event) => {
      if (event.target.matches("input, select, textarea")) {
        validateFinanceField(event.target);
      }
    },
    true,
  );
};

// ==============================
// SIMPLE INTEREST CALCULATOR
// ==============================

// DISPLAY SIMPLE INTEREST FORM
const showSimpleInterestForm = () => {
  calculatorWorkspace.innerHTML = `
    <div class="rounded-2xl border border-[#34424f] bg-[#19222c] p-6">

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-white">
          Simple Interest Calculator
        </h2>

        <p class="mt-2 text-sm text-slate-400">
          Calculate interest earned or payable on your principal amount.
        </p>
      </div>

      <form id="simpleInterestForm" class="space-y-5" novalidate>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Principal Amount (₹)
          </label>

          <input
            type="number"
            name="principalAmount"
            min="0.01"
            max="9007199254740991"
            step="0.01"
            required
            placeholder="Example: 50000"
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Annual Interest Rate (%)
          </label>

          <input
            type="number"
            name="annualInterestRate"
            min="0"
            max="1000"
            step="0.01"
            required
            placeholder="Example: 8"
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Time Period (Years)
          </label>

          <input
            type="number"
            name="timeYears"
            min="0.01"
            max="100"
            step="0.01"
            required
            placeholder="Example: 2"
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          />
        </div>

        <button
          type="submit"
          class="rounded-lg bg-[#286b65] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#347e76] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Calculate Interest
        </button>

      </form>

      <div id="simpleInterestResult" class="mt-6"></div>

    </div>
  `;

  setupFinanceValidation(document.getElementById("simpleInterestForm"));

  calculatorWorkspace.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

// OPEN SIMPLE INTEREST FORM WHEN CARD IS CLICKED
financeView.addEventListener("click", (event) => {
  const simpleInterestCard = event.target.closest(
    '[data-calculator="simple-interest"]',
  );

  if (!simpleInterestCard) return;

  showSimpleInterestForm();
});

// HANDLE SIMPLE INTEREST FORM SUBMISSION
calculatorWorkspace.addEventListener("submit", async (event) => {
  if (event.target.id !== "simpleInterestForm") return;

  event.preventDefault();

  const form = event.target;

  if (!validateFinanceForm(form)) {
    return;
  }
  const submitButton = form.querySelector('button[type="submit"]');
  const resultContainer = document.getElementById("simpleInterestResult");

  const interestData = {
    principalAmount: Number(form.elements.principalAmount.value),
    annualInterestRate: Number(form.elements.annualInterestRate.value),
    timeYears: Number(form.elements.timeYears.value),
  };

  submitButton.disabled = true;
  submitButton.textContent = "Calculating...";

  resultContainer.innerHTML = "";

  try {
    const result = await calculateSimpleInterest(interestData);

    const formatCurrency = (amount) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(amount);

    resultContainer.innerHTML = `
      <div class="rounded-xl border border-[#286b65] bg-[#142c2b] p-5">

        <h3 class="mb-4 text-lg font-semibold text-white">
          Simple Interest Result
        </h3>

        <div class="grid gap-4 sm:grid-cols-2">

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">
              Simple Interest
            </p>

            <p class="mt-2 text-xl font-bold text-[#9de0d4]">
              ${formatCurrency(result.simpleInterest)}
            </p>
          </div>

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">
              Total Amount
            </p>

            <p class="mt-2 text-xl font-bold text-white">
              ${formatCurrency(result.totalAmount)}
            </p>
          </div>

        </div>

        <p class="mt-4 text-xs text-slate-400">
          Simple Interest = (Principal × Rate × Time) / 100.
        </p>

      </div>
    `;
  } catch (error) {
    const errorMessage = document.createElement("p");

    errorMessage.className =
      "rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400";

    errorMessage.textContent = error.message;

    resultContainer.appendChild(errorMessage);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Calculate Interest";
  }
});

// ==============================
// COMPOUND INTEREST CALCULATOR
// ==============================

// DISPLAY COMPOUND INTEREST FORM
const showCompoundInterestForm = () => {
  calculatorWorkspace.innerHTML = `
    <div class="rounded-2xl border border-[#34424f] bg-[#19222c] p-6">

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-white">
          Compound Interest Calculator
        </h2>

        <p class="mt-2 text-sm text-slate-400">
          Calculate compound interest based on your investment
          or principal amount and compounding frequency.
        </p>
      </div>

      <form id="compoundInterestForm" class="space-y-5" novalidate>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Principal Amount (₹)
          </label>

          <input
            type="number"
            name="principalAmount"
            min="0.01"
            max="9007199254740991"
            step="0.01"
            required
            placeholder="Example: 50000"
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Annual Interest Rate (%)
          </label>

          <input
            type="number"
            name="annualInterestRate"
            min="0"
            max="1000"
            step="0.01"
            required
            placeholder="Example: 8"
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Time Period (Years)
          </label>

          <input
            type="number"
            name="timeYears"
            min="0.01"
            max="100"
            step="0.01"
            required
            placeholder="Example: 2"
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Compounding Frequency
          </label>

          <select
            name="compoundingFrequency"
            required
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          >
            <option value="annually">Annually</option>
            <option value="half-yearly">Half-yearly</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly" selected>Monthly</option>
            <option value="daily">Daily</option>
          </select>
        </div>

        <button
          type="submit"
          class="rounded-lg bg-[#286b65] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#347e76] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Calculate Compound Interest
        </button>

      </form>

      <div id="compoundInterestResult" class="mt-6"></div>

    </div>
  `;

  setupFinanceValidation(document.getElementById("compoundInterestForm"));

  calculatorWorkspace.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

// OPEN FORM WHEN COMPOUND INTEREST CARD IS CLICKED
financeView.addEventListener("click", (event) => {
  const compoundInterestCard = event.target.closest(
    '[data-calculator="compound-interest"]',
  );

  if (!compoundInterestCard) return;

  showCompoundInterestForm();
});

// HANDLE COMPOUND INTEREST FORM SUBMISSION
calculatorWorkspace.addEventListener("submit", async (event) => {
  if (event.target.id !== "compoundInterestForm") return;

  event.preventDefault();

  const form = event.target;
  if (!validateFinanceForm(form)) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const resultContainer = document.getElementById("compoundInterestResult");

  const interestData = {
    principalAmount: Number(form.elements.principalAmount.value),
    annualInterestRate: Number(form.elements.annualInterestRate.value),
    timeYears: Number(form.elements.timeYears.value),
    compoundingFrequency: form.elements.compoundingFrequency.value,
  };

  submitButton.disabled = true;
  submitButton.textContent = "Calculating...";

  resultContainer.innerHTML = "";

  try {
    const result = await calculateCompoundInterest(interestData);

    const formatCurrency = (amount) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(amount);

    resultContainer.innerHTML = `
      <div class="rounded-xl border border-[#286b65] bg-[#142c2b] p-5">

        <h3 class="mb-4 text-lg font-semibold text-white">
          Compound Interest Result
        </h3>

        <div class="grid gap-4 sm:grid-cols-2">

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">
              Compound Interest
            </p>

            <p class="mt-2 text-xl font-bold text-[#9de0d4]">
              ${formatCurrency(result.compoundInterest)}
            </p>
          </div>

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">
              Total Amount
            </p>

            <p class="mt-2 text-xl font-bold text-white">
              ${formatCurrency(result.totalAmount)}
            </p>
          </div>

        </div>

        <p class="mt-4 text-xs text-slate-400">
          Compound interest depends on the interest rate,
          time period and compounding frequency.
        </p>

      </div>
    `;
  } catch (error) {
    const errorMessage = document.createElement("p");

    errorMessage.className =
      "rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400";

    errorMessage.textContent = error.message;

    resultContainer.appendChild(errorMessage);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Calculate Compound Interest";
  }
});

// ==============================
// BUDGET PLANNER
// ==============================

// DISPLAY BUDGET PLANNER FORM
const showBudgetForm = () => {
  calculatorWorkspace.innerHTML = `
    <div class="rounded-2xl border border-[#34424f] bg-[#19222c] p-6">

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-white">
          Monthly Budget Planner
        </h2>

        <p class="mt-2 text-sm text-slate-400">
          Enter your monthly income and expenses to analyse your budget.
        </p>
      </div>

      <form id="budgetForm" class="space-y-5" novalidate>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Monthly Income (₹)
          </label>

          <input
            type="number"
            name="monthlyIncome"
            min="0.01"
            max="9007199254740991"
            step="0.01"
            required
            placeholder="Example: 50000"
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          />
        </div>

        <div>
          <div class="mb-3 flex items-center justify-between">
            <h3 class="font-semibold text-white">
              Monthly Expenses
            </h3>

            <span id="expenseCount" class="text-xs text-slate-400">
              1 / 30
            </span>
          </div>

          <div id="expenseRows" class="space-y-3">

            <div class="expense-row grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">

              <input
                type="text"
                name="category"
                maxlength="50"
                required
                placeholder="Category (e.g. Rent)"
                class="min-w-0 rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
              />

              <input
                type="number"
                name="amount"
                min="0"
                max="9007199254740991"
                step="0.01"
                required
                placeholder="Amount (₹)"
                class="min-w-0 rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
              />

              <button
                type="button"
                class="remove-expense rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                aria-label="Remove expense"
              >
                Remove
              </button>

            </div>

          </div>

          <button
            type="button"
            id="addExpenseButton"
            class="mt-4 rounded-lg border border-[#286b65] px-4 py-2 text-sm font-medium text-[#9de0d4] transition hover:bg-[#286b65]/20"
          >
            + Add Expense
          </button>

        </div>

        <button
          type="submit"
          class="rounded-lg bg-[#286b65] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#347e76] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Analyse My Budget
        </button>

      </form>

      <div id="budgetResult" class="mt-6"></div>

    </div>
  `;

  setupFinanceValidation(document.getElementById("budgetForm"));

  calculatorWorkspace.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

// OPEN BUDGET FORM WHEN CARD IS CLICKED
financeView.addEventListener("click", (event) => {
  const budgetCard = event.target.closest('[data-calculator="budget"]');

  if (!budgetCard) return;

  showBudgetForm();
});

// ADD OR REMOVE EXPENSE ROWS
calculatorWorkspace.addEventListener("click", (event) => {
  const addButton = event.target.closest("#addExpenseButton");

  if (addButton) {
    const expenseRows = document.getElementById("expenseRows");
    const expenseCount = expenseRows.querySelectorAll(".expense-row").length;

    if (expenseCount >= 30) {
      return;
    }

    const newRow = document.createElement("div");

    newRow.className =
      "expense-row grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]";

    newRow.innerHTML = `
      <input
        type="text"
        name="category"
        maxlength="50"
        required
        placeholder="Category (e.g. Transport)"
        class="min-w-0 rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
      />

      <input
        type="number"
        name="amount"
        min="0"
        max="9007199254740991"
        step="0.01"
        required
        placeholder="Amount (₹)"
        class="min-w-0 rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
      />

      <button
        type="button"
        class="remove-expense rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
        aria-label="Remove expense"
      >
        Remove
      </button>
    `;

    expenseRows.appendChild(newRow);

    newRow.querySelectorAll("input").forEach((input) => {
      const wrapper = document.createElement("div");

      wrapper.className = "finance-field min-w-0";

      newRow.insertBefore(wrapper, input);
      wrapper.appendChild(input);
    });

    document.getElementById("expenseCount").textContent =
      `${expenseCount + 1} / 30`;

    if (expenseCount + 1 >= 30) {
      addButton.disabled = true;
      addButton.classList.add("opacity-50", "cursor-not-allowed");
    }

    return;
  }

  const removeButton = event.target.closest(".remove-expense");

  if (removeButton) {
    const expenseRows = document.getElementById("expenseRows");

    removeButton.closest(".expense-row").remove();

    const remainingCount = expenseRows.querySelectorAll(".expense-row").length;

    document.getElementById("expenseCount").textContent =
      `${remainingCount} / 30`;

    const addExpenseButton = document.getElementById("addExpenseButton");

    addExpenseButton.disabled = false;

    addExpenseButton.classList.remove("opacity-50", "cursor-not-allowed");
  }
});

// HANDLE BUDGET FORM SUBMISSION
calculatorWorkspace.addEventListener("submit", async (event) => {
  if (event.target.id !== "budgetForm") return;

  event.preventDefault();

  const form = event.target;
  if (!validateFinanceForm(form)) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const resultContainer = document.getElementById("budgetResult");
  const monthlyIncome = Number(form.elements.monthlyIncome.value);
  const expenseRows = [
    ...document.querySelectorAll("#expenseRows .expense-row"),
  ];
  const expenses = [];

  for (const row of expenseRows) {
    const categoryInput = row.querySelector('[name="category"]');
    const amountInput = row.querySelector('[name="amount"]');

    const category = categoryInput.value.trim();
    const amountValue = amountInput.value;

    if (!category || amountValue === "") {
      resultContainer.textContent =
        "Please complete both category and amount for every expense.";

      return;
    }

    const amount = Number(amountValue);

    if (
      !Number.isFinite(amount) ||
      amount < 0 ||
      amount > Number.MAX_SAFE_INTEGER
    ) {
      resultContainer.textContent = "Please enter a valid expense amount.";

      return;
    }

    expenses.push({
      category,
      amount,
    });
  }

  if (expenseRows.length === 0) {
    resultContainer.textContent =
      "Please add at least one expense before analysing your budget.";

    return;
  }

  if (
    !Number.isFinite(monthlyIncome) ||
    monthlyIncome <= 0 ||
    monthlyIncome > Number.MAX_SAFE_INTEGER
  ) {
    resultContainer.textContent = "Please enter a valid monthly income.";

    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Analysing Budget...";

  resultContainer.innerHTML = "";

  try {
    const result = await analyzeBudget({
      monthlyIncome,
      expenses,
    });

    const formatCurrency = (amount) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(amount);

    const escapeHTML = (value) =>
      String(value).replace(
        /[&<>"']/g,
        (character) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[character],
      );

    const expenseBreakdown = Array.isArray(result.expenseBreakdown)
      ? result.expenseBreakdown
      : [];

    const recommendations = Array.isArray(result.recommendations)
      ? result.recommendations
      : result.recommendations
        ? [result.recommendations]
        : [];

    resultContainer.innerHTML = `
      <div class="rounded-xl border border-[#286b65] bg-[#142c2b] p-5">

        <h3 class="mb-5 text-lg font-semibold text-white">
          Your Budget Analysis
        </h3>

        <div class="grid gap-4 sm:grid-cols-2">

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">Monthly Income</p>
            <p class="mt-2 text-xl font-bold text-white">
              ${formatCurrency(result.monthlyIncome)}
            </p>
          </div>

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">Total Expenses</p>
            <p class="mt-2 text-xl font-bold text-white">
              ${formatCurrency(result.totalExpenses)}
            </p>
          </div>

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">Remaining Balance</p>
            <p class="mt-2 text-xl font-bold text-[#9de0d4]">
              ${formatCurrency(result.remainingBalance)}
            </p>
          </div>

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">Savings Percentage</p>
            <p class="mt-2 text-xl font-bold text-white">
              ${Number(result.savingsPercentage).toFixed(2)}%
            </p>
          </div>

        </div>

        <div class="mt-5 rounded-lg bg-[#1b3936] p-4">
          <p class="text-xs text-slate-300">Budget Status</p>
          <p class="mt-2 font-semibold text-[#9de0d4]">
            ${escapeHTML(result.budgetStatus)}
          </p>
        </div>

        ${
          expenseBreakdown.length
            ? `
              <div class="mt-6">
                <h4 class="mb-3 font-semibold text-white">
                  Expense Breakdown
                </h4>

                <div class="space-y-3">
                  ${expenseBreakdown
                    .map(
                      (item) => `
                    <div class="rounded-lg bg-[#1b3936] p-3">

                      <div class="flex flex-wrap justify-between gap-2">
                        <span class="text-sm text-slate-200">
                          ${escapeHTML(item.category)}
                        </span>

                        <span class="text-sm font-semibold text-white">
                          ${formatCurrency(item.amount)}
                        </span>
                      </div>

                      <p class="mt-1 text-xs text-slate-400">
                        ${Number(item.percentage).toFixed(2)}% of income
                      </p>

                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            `
            : ""
        }

        ${
          recommendations.length
            ? `
              <div class="mt-6">
                <h4 class="mb-3 font-semibold text-white">
                  Recommendations
                </h4>

                <ul class="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
                  ${recommendations
                    .map(
                      (recommendation) => `
                    <li>${escapeHTML(recommendation)}</li>
                  `,
                    )
                    .join("")}
                </ul>
              </div>
            `
            : ""
        }

      </div>
    `;
  } catch (error) {
    const errorMessage = document.createElement("p");

    errorMessage.className =
      "rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400";

    errorMessage.textContent = error.message;

    resultContainer.appendChild(errorMessage);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Analyse My Budget";
  }
});

// ==============================
// LOAN ELIGIBILITY CALCULATOR
// ==============================

// DISPLAY LOAN ELIGIBILITY FORM
const showLoanEligibilityForm = () => {
  calculatorWorkspace.innerHTML = `
    <div class="rounded-2xl border border-[#34424f] bg-[#19222c] p-6">

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-white">
          Loan Eligibility Calculator
        </h2>

        <p class="mt-2 text-sm text-slate-400">
          Estimate your loan eligibility based on your income
          and existing monthly EMI.
        </p>
      </div>

      <form id="loanEligibilityForm" class="space-y-5" novalidate>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Monthly Income (₹)
          </label>

          <input
            type="number"
            name="monthlyIncome"
            min="0.01"
            max="9007199254740991"
            step="0.01"
            required
            placeholder="Example: 50000"
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Existing Monthly EMI (₹)
          </label>

          <input
            type="number"
            name="existingEMI"
            min="0"
            max="9007199254740991"
            step="0.01"
            required
            placeholder="Example: 5000"
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Expected Annual Interest Rate (%)
          </label>

          <input
            type="number"
            name="annualInterestRate"
            min="0"
            max="1000"
            step="0.01"
            required
            placeholder="Example: 8.5"
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-slate-300">
            Loan Tenure (Years)
          </label>

          <input
            type="number"
            name="tenureYears"
            min="1"
            max="50"
            step="1"
            required
            placeholder="Example: 5"
            class="w-full rounded-lg border border-[#34424f] bg-[#111923] px-4 py-3 text-white outline-none focus:border-[#65b9aa]"
          />
        </div>

        <button
          type="submit"
          class="rounded-lg bg-[#286b65] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#347e76] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check Loan Eligibility
        </button>

      </form>

      <div id="loanEligibilityResult" class="mt-6"></div>

    </div>
  `;

  setupFinanceValidation(document.getElementById("loanEligibilityForm"));

  calculatorWorkspace.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

// OPEN FORM WHEN LOAN ELIGIBILITY CARD IS CLICKED
financeView.addEventListener("click", (event) => {
  const loanCard = event.target.closest('[data-calculator="loan-eligibility"]');
  if (!loanCard) return;
  showLoanEligibilityForm();
});

// HANDLE LOAN ELIGIBILITY FORM SUBMISSION
calculatorWorkspace.addEventListener("submit", async (event) => {
  if (event.target.id !== "loanEligibilityForm") return;
  event.preventDefault();

  const form = event.target;
  if (!validateFinanceForm(form)) {
    return;
  }
  const submitButton = form.querySelector('button[type="submit"]');
  const resultContainer = document.getElementById("loanEligibilityResult");
  const loanData = {
    monthlyIncome: Number(form.elements.monthlyIncome.value),
    existingEMI: Number(form.elements.existingEMI.value),
    annualInterestRate: Number(form.elements.annualInterestRate.value),
    tenureYears: Number(form.elements.tenureYears.value),
  };

  submitButton.disabled = true;
  submitButton.textContent = "Checking Eligibility...";
  resultContainer.innerHTML = "";

  try {
    const result = await calculateLoanEligibility(loanData);
    const formatCurrency = (amount) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(amount);

    const isEligible = result.eligibilityStatus === "eligible";

    const statusClass = isEligible
      ? "border-green-500/30 bg-green-500/10 text-green-400"
      : "border-amber-500/30 bg-amber-500/10 text-amber-400";

    const statusText = isEligible ? "Eligible" : "Not Eligible";

    resultContainer.innerHTML = `
      <div class="rounded-xl border border-[#286b65] bg-[#142c2b] p-5">

        <h3 class="mb-4 text-lg font-semibold text-white">
          Loan Eligibility Result
        </h3>

        <div class="mb-5 rounded-lg border p-4 ${statusClass}">
          <p class="text-sm font-semibold">
            Eligibility Status: ${statusText}
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">
              Eligible Loan Amount
            </p>

            <p class="mt-2 text-xl font-bold text-[#9de0d4]">
              ${formatCurrency(result.eligibleLoanAmount)}
            </p>
          </div>

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">
              Estimated New EMI
            </p>

            <p class="mt-2 text-xl font-bold text-white">
              ${formatCurrency(result.estimatedEMI)}
            </p>
          </div>

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">
              Maximum Allowed EMI
            </p>

            <p class="mt-2 text-lg font-semibold text-white">
              ${formatCurrency(result.maximumEMI)}
            </p>
          </div>

          <div class="rounded-lg bg-[#1b3936] p-4">
            <p class="text-xs text-slate-300">
              Available EMI Capacity
            </p>

            <p class="mt-2 text-lg font-semibold text-white">
              ${formatCurrency(result.availableEMI)}
            </p>
          </div>

        </div>

        <div class="mt-4 text-xs leading-6 text-slate-400">
          <p>
            FOIR assumption: ${result.foirPercentage}%
          </p>
          <p>
            Loan tenure: ${result.tenureYears} years
          </p>
        </div>

        <p id="loanDisclaimer"
           class="mt-4 text-xs leading-6 text-slate-400">
        </p>

      </div>
    `;

    document.getElementById("loanDisclaimer").textContent = result.disclaimer;
  } catch (error) {
    const errorMessage = document.createElement("p");

    errorMessage.className =
      "rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400";

    errorMessage.textContent = error.message;

    resultContainer.appendChild(errorMessage);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Check Loan Eligibility";
  }
});

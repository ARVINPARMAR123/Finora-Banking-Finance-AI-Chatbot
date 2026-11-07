import {
  sendChatMessage,
  calculateEMI,
  calculateSimpleInterest,
} from "./api.js";

// ==============================
// ELEMENTS
// ==============================

const sidebar = document.getElementById("sidebar");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");

const openSidebarButton = document.getElementById("openSidebar");
const closeSidebarButton = document.getElementById("closeSidebar");

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");
const chatFooter = document.getElementById("chatFooter");

const newChatButton = document.getElementById("newChatButton");
const sendButton = chatForm.querySelector('button[type="submit"]');

const homeView = document.getElementById("homeView");

const views = {
  home: homeView,
  chat: document.getElementById("chatView"),
  finance: document.getElementById("financeView"),
  faq: document.getElementById("faqView"),
  safety: document.getElementById("safetyView"),
};

const navItems = document.querySelectorAll(".nav-item");

let faqLoaded = false;
let safetyLoaded = false;

// ==============================
// MOBILE SIDEBAR
// ==============================

const openSidebar = () => {
  sidebar.classList.remove("-translate-x-full");
  sidebarBackdrop.classList.remove("hidden");
};

const closeSidebar = () => {
  sidebar.classList.add("-translate-x-full");
  sidebarBackdrop.classList.add("hidden");
};

openSidebarButton.addEventListener("click", openSidebar);
closeSidebarButton.addEventListener("click", closeSidebar);
sidebarBackdrop.addEventListener("click", closeSidebar);

// ==============================
// EMI CALCULATOR
// ==============================

const financeView = document.getElementById("financeView");

// Create calculator workspace dynamically
const calculatorWorkspace = document.createElement("div");

calculatorWorkspace.id = "calculatorWorkspace";
calculatorWorkspace.className = "mt-8";

financeView.appendChild(calculatorWorkspace);

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

      <form id="emiForm" class="space-y-5">

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

      <form id="simpleInterestForm" class="space-y-5">

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
// SINGLE PAGE NAVIGATION
// ==============================

const showView = (viewName) => {
  if (!views[viewName]) return;

  Object.entries(views).forEach(([name, element]) => {
    element.classList.toggle("hidden", name !== viewName);
  });

  // Show message input only on home and chat views.
  chatFooter.classList.toggle("hidden", !["home", "chat"].includes(viewName));

  // Update active sidebar item.
  navItems.forEach((item) => {
    const isActive = item.dataset.view === viewName;

    item.classList.toggle("bg-[#263a40]", isActive);
    item.classList.toggle("text-[#9de0d4]", isActive);

    item.classList.toggle("text-slate-400", !isActive);
    item.classList.toggle("hover:bg-[#202a35]", !isActive);
  });

  // Close mobile sidebar after navigation.
  closeSidebar();

  // Load data when required.
  if (viewName === "faq" && !faqLoaded) {
    loadFAQs();
  }

  if (viewName === "safety" && !safetyLoaded) {
    loadSafetyInformation();
  }
};

// Sidebar navigation.
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    showView(item.dataset.view);
  });
});

// Initial landing view.
showView("home");

// ==============================
// SUGGESTED QUESTIONS
// ==============================

document.querySelectorAll(".prompt-card").forEach((button) => {
  button.addEventListener("click", () => {
    messageInput.value = button.dataset.prompt;
    messageInput.focus();
  });
});

// ==============================
// DISPLAY CHAT MESSAGES
// ==============================

// DISPLAY CHAT MESSAGES
const addMessage = (message, sender) => {
  const messageWrapper = document.createElement("div");

  messageWrapper.className =
    sender === "user" ? "flex justify-end" : "flex justify-start";

  const messageContent = document.createElement("div");
  messageContent.className = "flex max-w-[85%] flex-col gap-2";

  const messageBubble = document.createElement("div");

  messageBubble.className =
    sender === "user"
      ? "whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-[#286b65] px-4 py-3 text-sm leading-6 text-white"
      : "whitespace-pre-wrap break-words rounded-2xl rounded-bl-sm border border-[#34424f] bg-[#19222c] px-4 py-3 text-sm leading-6 text-slate-300";

  messageBubble.textContent = message;

  messageContent.appendChild(messageBubble);

  // COPY BUTTON FOR AI RESPONSES ONLY
  if (sender === "assistant") {
    const copyButton = document.createElement("button");

    copyButton.type = "button";
    copyButton.textContent = "📋 Copy";
    copyButton.className =
      "self-start text-xs text-slate-400 hover:text-[#9de0d4] transition-colors";

    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(message);

        copyButton.textContent = "✓ Copied!";

        setTimeout(() => {
          copyButton.textContent = "📋 Copy";
        }, 2000);
      } catch (error) {
        copyButton.textContent = "Copy failed";
      }
    });

    messageContent.appendChild(copyButton);
  }

  messageWrapper.appendChild(messageContent);
  chatMessages.appendChild(messageWrapper);

  messageWrapper.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });

  return messageWrapper;
};

// ==============================
// LOADING INDICATOR
// ==============================

const showLoadingMessage = () => {
  const loadingWrapper = document.createElement("div");

  loadingWrapper.className = "flex justify-start";

  const loadingBubble = document.createElement("div");

  loadingBubble.className =
    "rounded-2xl border border-[#34424f] bg-[#19222c] px-4 py-3 text-sm text-slate-400";

  loadingBubble.textContent = "Finora is thinking...";

  loadingWrapper.appendChild(loadingBubble);
  chatMessages.appendChild(loadingWrapper);

  loadingWrapper.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });

  return loadingWrapper;
};

// ==============================
// CHAT FORM SUBMISSION
// ==============================

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();

  if (!message) {
    messageInput.focus();
    return;
  }

  if (message.length > 2000) {
    addMessage("Your message cannot exceed 2000 characters.", "assistant");
    return;
  }

  // Switch from landing page to chat view.
  showView("chat");

  addMessage(message, "user");

  messageInput.value = "";

  sendButton.disabled = true;
  messageInput.disabled = true;

  const loadingMessage = showLoadingMessage();

  try {
    const aiResponse = await sendChatMessage(message);

    loadingMessage.remove();

    addMessage(aiResponse, "assistant");
  } catch (error) {
    loadingMessage.remove();

    addMessage(
      error.message || "Something went wrong. Please try again.",
      "assistant",
    );
  } finally {
    sendButton.disabled = false;
    messageInput.disabled = false;
    messageInput.focus();
  }
});

// SEND MESSAGE USING ENTER KEY
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

// ==============================
// NEW CONVERSATION
// ==============================

newChatButton.addEventListener("click", () => {
  chatMessages.innerHTML = "";
  messageInput.value = "";

  showView("home");

  messageInput.focus();
});

// ==============================
// LOAD FINANCIAL FAQs
// ==============================

const loadFAQs = async () => {
  const container = document.getElementById("faqContainer");

  try {
    const response = await fetch("http://localhost:5000/api/faq");

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error("Unable to load FAQs.");
    }

    const items = Array.isArray(result.data)
      ? result.data
      : result.data?.faqs || [];

    if (!items.length) {
      container.textContent = "No FAQs are currently available.";
      faqLoaded = true;
      return;
    }

    container.innerHTML = "";

    items.forEach((faq) => {
      const card = document.createElement("details");

      card.className = "rounded-xl border border-[#293542] bg-[#171f29] p-5";

      const question = document.createElement("summary");

      question.className = "cursor-pointer font-medium text-slate-200";

      question.textContent = faq.question || "Frequently asked question";

      const answer = document.createElement("p");

      answer.className = "mt-4 text-sm leading-7 text-slate-400";

      answer.textContent = faq.answer || "Answer is currently unavailable.";

      card.append(question, answer);
      container.appendChild(card);
    });

    faqLoaded = true;
  } catch (error) {
    container.textContent = error.message;
  }
};

// ==============================
// LOAD FINANCIAL SAFETY DATA
// ==============================

const loadSafetyInformation = async () => {
  const container = document.getElementById("safetyContainer");

  try {
    const response = await fetch("http://localhost:5000/api/safety");

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error("Unable to load safety information.");
    }

    const items = Array.isArray(result.data)
      ? result.data
      : result.data?.items || [];

    if (!items.length) {
      container.textContent = "No safety information is currently available.";
      safetyLoaded = true;
      return;
    }

    container.innerHTML = "";

    items.forEach((item) => {
      const card = document.createElement("div");

      card.className = "rounded-xl border border-[#293542] bg-[#171f29] p-5";

      const heading = document.createElement("h3");

      heading.className = "font-semibold text-white";

      heading.textContent =
        item.title || item.name || item.category || "Safety guidance";

      const description = document.createElement("p");

      description.className =
        "mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-400";

      description.textContent =
        item.description ||
        item.content ||
        item.answer ||
        item.response ||
        "Follow recommended banking safety practices.";

      card.append(heading, description);
      container.appendChild(card);
    });

    safetyLoaded = true;
  } catch (error) {
    container.textContent = error.message;
  }
};

// ==============================
// DARK / LIGHT THEME
// ==============================

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const savedTheme = localStorage.getItem("finora-theme");

if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  themeIcon.textContent = "☾";
} else {
  document.body.classList.remove("light-mode");
  themeIcon.textContent = "☀";
}

themeToggle.addEventListener("click", () => {
  const isLightMode = document.body.classList.toggle("light-mode");

  if (isLightMode) {
    themeIcon.textContent = "☾";
    localStorage.setItem("finora-theme", "light");
  } else {
    themeIcon.textContent = "☀";
    localStorage.setItem("finora-theme", "dark");
  }
});

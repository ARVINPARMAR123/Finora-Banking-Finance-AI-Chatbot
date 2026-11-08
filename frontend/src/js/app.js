import {
  sendChatMessage,
  getFAQs,
  getSafetyInformation,
  getSafetyCategories,
  searchSafetyInformation,
  getSafetyEmergency,
} from "./api.js";
import "./financeTools.js";

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

// ==============================
// LOAD FINANCIAL FAQs
// ==============================

const loadFAQs = async () => {
  const container = document.getElementById("faqContainer");

  container.textContent = "Loading FAQs...";

  try {
    const data = await getFAQs();

    const items = Array.isArray(data) ? data : data?.faqs || [];

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

      question.className =
        "cursor-pointer font-medium text-slate-200 transition hover:text-[#9de0d4]";

      question.textContent = faq.question || "Frequently asked question";

      const answer = document.createElement("p");

      answer.className =
        "mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-400";

      answer.textContent = faq.answer || "Answer is currently unavailable.";

      card.append(question, answer);

      container.appendChild(card);
    });

    faqLoaded = true;
  } catch (error) {
    container.innerHTML = "";

    const errorMessage = document.createElement("p");

    errorMessage.className =
      "rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400";

    errorMessage.textContent = error.message;

    container.appendChild(errorMessage);

    // Keep faqLoaded false so the user can retry by revisiting the view.
  }
};

// ==============================
// LOAD FINANCIAL SAFETY DATA
// ==============================

const loadSafetyInformation = async () => {
  const container = document.getElementById("safetyContainer");

  container.innerHTML = `
    <!-- Find Safety Guidance -->
    <section class="rounded-xl border border-[#293542] bg-[#171f29] p-5">
      <h3 class="font-semibold text-white">Find Safety Guidance</h3>
      <p class="mt-2 text-sm text-slate-400">
        Search for financial scams or select a safety category.
      </p>

      <form id="safetySearchForm" class="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          id="safetySearchInput"
          type="search"
          placeholder="Search UPI fraud, OTP scams, phishing..."
          class="min-w-0 flex-1 rounded-lg border border-[#34424f] bg-[#101820] px-4 py-3 text-sm text-white outline-none focus:border-[#8dd7c9]"
        />
        <button
          type="submit"
          class="rounded-lg bg-[#286b65] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#328078]"
        >
          Search
        </button>
      </form>

      <div class="mt-3">
        <label for="safetyCategoryFilter" class="mb-2 block text-sm text-slate-400">
          Filter by category
        </label>
        <select
          id="safetyCategoryFilter"
          class="w-full rounded-lg border border-[#34424f] bg-[#101820] px-4 py-3 text-sm text-white outline-none focus:border-[#8dd7c9]"
        >
          <option value="all">All Categories</option>
        </select>
      </div>
    </section>

    <!-- Safety Information Results -->
    <section id="safetyResultsSection" class="mt-6 hidden">
  <div class="mb-4 flex items-center justify-between gap-3">
    <h3 class="font-semibold text-white">Safety Information</h3>
    <span id="safetyResultCount" class="text-xs text-slate-400"></span>
  </div>

  <div id="safetyResults" class="space-y-4"></div>
</section>

    <!-- Emergency Guidance: Always after search results -->
    <section id="safetyEmergencyCard"
      class="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 p-5">
      <h3 id="emergencyTitle" class="font-semibold text-red-300">
        Financial Cyber Fraud – Emergency Guidance
      </h3>
      <p class="mt-2 text-xs text-slate-400">India</p>

      <ol id="emergencySteps"
        class="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-300">
      </ol>

      <p id="emergencyNote"
        class="mt-4 rounded-lg bg-red-500/10 p-3 text-sm leading-6 text-red-200">
      </p>
    </section>
  `;

  const searchForm = document.getElementById("safetySearchForm");
  const searchInput = document.getElementById("safetySearchInput");
  const categoryFilter = document.getElementById("safetyCategoryFilter");
  const resultsContainer = document.getElementById("safetyResults");
  const resultCount = document.getElementById("safetyResultCount");
  const resultsSection = document.getElementById("safetyResultsSection");

  let allItems = [];
  let selectedCategory = "all";

  // Create a safe list of guidance items
  const createList = (items, heading, className) => {
    if (!Array.isArray(items) || !items.length) return null;

    const section = document.createElement("div");
    section.className = "mt-4";

    const title = document.createElement("h4");
    title.className = "mb-2 text-sm font-semibold text-slate-200";
    title.textContent = heading;

    const list = document.createElement("ul");
    list.className = `list-disc space-y-2 pl-5 text-sm leading-6 ${className}`;

    items.forEach((value) => {
      const li = document.createElement("li");
      li.textContent = value;
      list.appendChild(li);
    });

    section.append(title, list);
    return section;
  };

  // Display matching safety records
  const renderSafetyResults = (items) => {
    resultsContainer.innerHTML = "";
    resultCount.textContent = `${items.length} result(s)`;

    if (!items.length) {
      resultsContainer.textContent =
        "No matching safety information found. Try another keyword or category.";
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "rounded-xl border border-[#293542] bg-[#171f29] p-5";

      const category = document.createElement("p");
      category.className = "text-xs font-medium text-[#8dd7c9]";
      category.textContent = item.category || "Financial Safety";

      const title = document.createElement("h4");
      title.className = "mt-2 font-semibold text-white";
      title.textContent = item.title || "Safety Guidance";

      const description = document.createElement("p");
      description.className = "mt-3 text-sm leading-7 text-slate-400";
      description.textContent = item.description || "";

      card.append(category, title, description);

      const warningSigns = createList(
        item.warningSigns,
        "Warning Signs",
        "text-amber-300",
      );

      const whatToDo = createList(
        item.whatToDo,
        "What To Do",
        "text-slate-300",
      );

      const prevention = createList(
        item.prevention,
        "Prevention Tips",
        "text-[#8dd7c9]",
      );

      [warningSigns, whatToDo, prevention].forEach((section) => {
        if (section) card.appendChild(section);
      });

      resultsContainer.appendChild(card);
    });
  };

  // Apply search and category filtering together
  const updateSafetyResults = async () => {
    resultsSection.classList.remove("hidden");
    resultsContainer.textContent = "Searching safety information...";
    resultCount.textContent = "";

    try {
      const keyword = searchInput.value.trim();

      let items = keyword ? await searchSafetyInformation(keyword) : allItems;

      if (!Array.isArray(items)) items = [];

      if (selectedCategory !== "all") {
        items = items.filter((item) => item.category === selectedCategory);
      }

      renderSafetyResults(items);
    } catch (error) {
      resultsContainer.textContent = error.message;
    }
  };

  try {
    // Load all three API responses
    const [safetyData, categories, emergency] = await Promise.all([
      getSafetyInformation(),
      getSafetyCategories(),
      getSafetyEmergency(),
    ]);

    allItems = Array.isArray(safetyData) ? safetyData : [];

    // Populate category dropdown
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });

    // Search form
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      updateSafetyResults();
    });

    // Category filter
    categoryFilter.addEventListener("change", () => {
      selectedCategory = categoryFilter.value;
      updateSafetyResults();
    });

    // Render emergency guidance after results
    document.getElementById("emergencyTitle").textContent =
      emergency.title || "Financial Cyber Fraud – Emergency Guidance";

    const emergencySteps = document.getElementById("emergencySteps");

    emergency.steps.forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      emergencySteps.appendChild(li);
    });

    document.getElementById("emergencyNote").textContent =
      emergency.importantNote || "";

    safetyLoaded = true;
  } catch (error) {
    resultsContainer.textContent =
      error.message || "Unable to load Safety Centre information.";
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

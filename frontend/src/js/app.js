import { sendChatMessage } from "./api.js";
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

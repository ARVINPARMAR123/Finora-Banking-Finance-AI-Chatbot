# Finora – Banking & Finance Assistance AI Chatbot

An AI-powered banking and personal finance assistance chatbot built using HTML, CSS, JavaScript, Node.js, Express.js, Tailwind CSS, and Google Gemini API.

Finora helps users understand banking and financial concepts, perform financial calculations, manage budgets, check loan eligibility, and learn about financial fraud prevention through a modern, responsive dashboard.

---

## 1. Project Definition

**Finora – Banking & Finance Assistance AI Chatbot** is a web-based application designed to provide users with general banking and personal finance assistance using Artificial Intelligence.

The application combines an AI chatbot with financial calculators, frequently asked questions, and a financial safety centre.

It aims to make basic financial information easier to understand and help users perform common financial calculations without manually applying formulas.

The application does not require user registration or a database. Chat history is stored locally in the user's browser using LocalStorage.

## 2. Objectives

- Provide AI-based banking and financial assistance.
- Answer general banking and finance-related questions.
- Calculate EMI, simple interest, and compound interest.
- Help users analyze their monthly budgets.
- Estimate loan eligibility.
- Provide financial FAQs and fraud awareness information.
- Offer a simple, responsive, and user-friendly interface.
- Support dark and light themes.
- Maintain chat history using browser LocalStorage.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Frontend structure |
| CSS3 | Styling |
| JavaScript | Frontend functionality |
| Tailwind CSS v4 | Responsive UI styling |
| Node.js | Backend runtime |
| Express.js | REST API development |
| Google Gemini API | AI chatbot responses |
| Zod | Request validation |
| Helmet | Security headers |
| CORS | Cross-origin request handling |
| Express Rate Limit | API rate limiting |
| LocalStorage | Browser-based chat history |
| Render | Application deployment |
| Git & GitHub | Version control and source code hosting |

## 4. Project Structure

```text
Finora-Banking-Finance-AI-Chatbot/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── security.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── chat.controller.js
│   │   │   ├── safety.controller.js
│   │   │   └── loanEligibility.controller.js
│   │   │
│   │   ├── data/
│   │   │   └── safety.data.js
│   │   │
│   │   ├── middleware/
│   │   │   └── rateLimit.middleware.js
│   │   │
│   │   ├── routes/
│   │   │   ├── health.route.js
│   │   │   ├── chat.route.js
│   │   │   ├── emi.route.js
│   │   │   ├── simpleInterest.route.js
│   │   │   ├── compoundInterest.route.js
│   │   │   ├── budget.route.js
│   │   │   ├── faq.route.js
│   │   │   ├── safety.route.js
│   │   │   └── loanEligibility.route.js
│   │   │
│   │   ├── services/
│   │   │   ├── domain.service.js
│   │   │   └── safety.service.js
│   │   │
│   │   ├── utils/
│   │   │   └── loanEligibility.utils.js
│   │   │
│   │   ├── validators/
│   │   │   └── loanEligibility.validator.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── css/
│   │   │   ├── input.css
│   │   │   └── output.css
│   │   │
│   │   └── js/
│   │       ├── app.js
│   │       ├── api.js
│   │       └── financeTools.js
│   │
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
```

*Note: This is a representative project structure showing the main files and folders. Other supporting controllers, services, utilities, and validators are included in the actual source code.*

## 5. Main Features

### 5.1 AI Banking & Finance Assistant
- Provides AI-powered banking and financial assistance.
- Uses Google Gemini API to generate responses.
- Supports general banking and personal finance questions.
- Automatically responds in the user's language.
- Restricts unrelated questions outside the banking and finance domain.
- Provides loading indicators and error handling.

### 5.2 Finance Tools

The application includes five financial tools:

**1. EMI Calculator**
- Calculates monthly loan installments.
- Displays the total interest and total payment.

**2. Simple Interest Calculator**
- Calculates simple interest based on principal, rate, and time.
- Displays the total amount.

**3. Compound Interest Calculator**
- Calculates compound interest.
- Displays the interest earned and final amount.

**4. Budget Planner**
- Analyzes monthly income and expenses.
- Helps users understand their spending and savings.

**5. Loan Eligibility Calculator**
- Estimates loan eligibility using monthly income and existing EMI.
- Calculates estimated available EMI and eligible loan amount.
- Uses an illustrative 50% FOIR assumption.

### 5.3 Financial FAQs
- Displays frequently asked banking and finance questions.
- Provides answers to common financial queries.
- Helps users understand basic banking concepts.

### 5.4 Financial Safety Centre
- Provides financial fraud and scam awareness information.
- Includes fraud categories and searchable safety information.
- Offers emergency guidance.
- Provides Indian cybercrime reporting information.

### 5.5 Modern Dashboard
- Responsive user interface.
- Dark and light theme support.
- Interactive dashboard navigation.
- Mobile-friendly layout.
- Clean and simple design.

### 5.6 Chat History
- Stores conversations using browser LocalStorage.
- Restores previous messages after refreshing the page.
- Supports clearing chat history using New Conversation.
- Does not require a database.

## 6. Installation and Setup

### Prerequisites

Install the following software:

- Node.js and npm
- Git
- Visual Studio Code
- A Google Gemini API key

### Step 1: Clone the Repository

```bash
git clone https://github.com/ARVINPARMAR123/Finora-Banking-Finance-AI-Chatbot.git
```

Navigate to the project folder:

```bash
cd Finora-Banking-Finance-AI-Chatbot
```

### Step 2: Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend folder and configure the environment variables.

Start the backend in development mode:

```bash
npm run dev
```

Or start it normally:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

Check the backend health:

```text
http://localhost:5000/api/health
```

### Step 3: Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Build Tailwind CSS:

```bash
npm run build
```

For development with automatic Tailwind CSS rebuilding:

```bash
npm run dev
```

Open `frontend/index.html` using the VS Code Live Server extension.

The frontend will usually be available at:

```text
http://127.0.0.1:5500
```

Make sure the backend is running before testing frontend API features.

## 7. Environment Variables

The backend requires environment variables to configure the Gemini API and frontend origin.

Create:

```text
backend/.env
```

Add the following configuration:

```env
PORT=5000

GEMINI_API_KEY=your_gemini_api_key

GEMINI_MODEL=gemini-flash-lite-latest

FRONTEND_URL=http://127.0.0.1:5500
```

## 8. API Routes

Base URL:

```text
http://localhost:5000
```

### General and Chat APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend welcome message |
| GET | `/api/health` | Backend health check |
| POST | `/api/chat` | Send a message to the AI chatbot |

### Finance Calculator APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/emi/calculate` | Calculate EMI |
| POST | `/api/interest/simple` | Calculate simple interest |
| POST | `/api/interest/compound` | Calculate compound interest |
| POST | `/api/budget/analyze` | Analyze monthly budget |
| POST | `/api/loan-eligibility/calculate` | Estimate loan eligibility |

### Financial FAQ API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/faq` | Retrieve financial FAQs |

### Financial Safety APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/safety` | Retrieve safety information |
| GET | `/api/safety/categories` | Retrieve safety categories |
| GET | `/api/safety/search?keyword=fraud` | Search safety information |
| GET | `/api/safety/emergency` | Retrieve emergency guidance |
| GET | `/api/safety/:id` | Retrieve a specific safety item |

## 9. Deployment

The application is deployed using Render.

### Backend Deployment
- Hosting: Render Web Service
- Runtime: Node.js
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

### Frontend Deployment
- Hosting: Render Static Site
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `.`

### Live Application

**Frontend:**

https://finora-frontend-dbcn.onrender.com

**Backend:**

https://finora-banking-finance-ai-chatbot.onrender.com

## 10. Security and Privacy

- Helmet middleware provides HTTP security headers.
- CORS restricts requests to configured frontend origins.
- Express Rate Limit helps prevent excessive API requests.
- Zod validates incoming request data.
- Sensitive banking information is not required by the chatbot.
- Gemini API keys are stored in backend environment variables.
- No database or user authentication is used.
- Chat history is stored locally in the user's browser.

**Security Reminder:** Users should never enter OTPs, UPI PINs, ATM PINs, CVVs, banking passwords, or complete card details into the chatbot.

## 11. Limitations

- Requires an internet connection for AI responses.
- AI responses depend on Gemini API availability and usage limits.
- Financial calculations are intended for educational and informational purposes.
- Loan eligibility is an estimate, not a loan approval or guarantee.
- Chat history is stored only in the same browser and device.
- LocalStorage is not encrypted and should not be used to store confidential financial information.
- Free Render services may experience delays after periods of inactivity.

## 12. Future Enhancements

- Add additional financial planning tools.
- Improve AI response accuracy and financial guidance.
- Add multilingual interface support.
- Introduce downloadable financial reports.
- Improve financial analytics and visualizations.
- Explore optional user accounts and cloud-based chat history.

## 13. Author

**Developed by Arvin Parmar**

**Project Name:** Finora – Banking & Finance Assistance AI Chatbot

**GitHub Repository:**  
https://github.com/ARVINPARMAR123/Finora-Banking-Finance-AI-Chatbot

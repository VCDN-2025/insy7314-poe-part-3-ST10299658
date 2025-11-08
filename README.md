<div align="center">

# 💳 PulsePay - International Payment Portal



---

### 🎯 **Streamlined International Transactions with Enterprise-Grade Security**

*From basic payment portal to fully secured, production-ready application*

<a href="https://youtu.be/TKLIx1VxwGY">
  <img src="https://img.shields.io/badge/🎬_Watch_Demo-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch Demo">
</a>

<a href="https://payments-frontend-h173.onrender.com">
  <img src="https://img.shields.io/badge/🚀_Live_App-Frontend-00C7B7?style=for-the-badge&logo=render&logoColor=white" alt="Live Frontend">
</a>

<a href="https://insy7314-poe-part-3-st10299658.onrender.com">
  <img src="https://img.shields.io/badge/⚡_API_Server-Backend-5A29E4?style=for-the-badge&logo=render&logoColor=white" alt="Backend API">
</a>

</div>

---

## 👥 **Development Team**

<table align="center">
  <tr>
    <th>Student Number</th>
    <th>Name</th>
    <th>Role</th>
    <th>Institution</th>
  </tr>
  <tr>
    <td align="center"><strong>ST10299658</strong></td>
    <td>Okuhle Nyawo</td>
    <td>Lead Developer</td>
    <td rowspan="5">Varsity College<br/>2025</td>
  </tr>
  <tr>
    <td align="center"><strong>ST10293982</strong></td>
    <td>Cebo Nyawo</td>
    <td>Developer</td>
  </tr>
  <tr>
    <td align="center"><strong>ST10288560</strong></td>
    <td>Luke Lutchmiah</td>
    <td>Developer</td>
  </tr>
  <tr>
    <td align="center"><strong>ST10302369</strong></td>
    <td>Lethabo Penniston</td>
    <td>Developer</td>
  </tr>
  <tr>
    <td align="center"><strong>ST10358804</strong></td>
    <td>David Dingani</td>
    <td>Developer</td>
  </tr>
</table>

---

## 📊 **Table of Contents**

- [🎯 Project Evolution](#-project-evolution-part-2--part-3)
- [✨ What's New in Part 3](#-whats-new-in-part-3)
- [📺 Video Demonstration](#-video-demonstration)
- [🌐 Live Deployment](#-live-deployment)
- [📸 Application Preview](#-application-preview)
- [🔐 Security Architecture](#-security-architecture)
- [⚙️ Technical Stack](#️-technical-stack)
- [🚀 Features Overview](#-features-overview)
- [🏗️ System Architecture](#️-system-architecture)
- [💻 Installation Guide](#-installation-guide)
- [📡 API Reference](#-api-reference)
- [🧪 Testing Strategy](#-testing-strategy)
- [⚙️ CI/CD Pipeline](#️-cicd-pipeline)
- [📋 Project Requirements](#-project-requirements)
- [🙏 Acknowledgments](#-acknowledgments)

---

## 🎯 **Project Evolution: Part 2 → Part 3**

<table>
  <tr>
    <th width="50%">📦 Part 2 (Basic)</th>
    <th width="50%">🚀 Part 3 (Enterprise)</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>❌ No SSL/HTTPS encryption</li>
        <li>❌ Basic UI with minimal styling</li>
        <li>❌ Simple authentication only</li>
        <li>❌ No multi-factor authentication</li>
        <li>❌ Limited input validation</li>
        <li>❌ No automated testing</li>
        <li>❌ Manual deployment process</li>
        <li>❌ No security scanning</li>
        <li>❌ Basic error handling</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>✅ <strong>Full SSL/TLS encryption</strong></li>
        <li>✅ <strong>Modern, responsive UI design</strong></li>
        <li>✅ <strong>JWT + Refresh token system</strong></li>
        <li>✅ <strong>MFA with OTP verification</strong></li>
        <li>✅ <strong>Comprehensive validation (express-validator)</strong></li>
        <li>✅ <strong>Jest + Supertest test suites</strong></li>
        <li>✅ <strong>Automated CI/CD with CircleCI</strong></li>
        <li>✅ <strong>SonarCloud quality scanning</strong></li>
        <li>✅ <strong>Advanced security middleware</strong></li>
      </ul>
    </td>
  </tr>
</table>

---

## ✨ **What's New in Part 3**

### 🔒 **Security Enhancements**

| Feature | Description | Status |
|---------|-------------|--------|
| **HTTPS/SSL Encryption** | End-to-end TLS 1.3 encryption on all connections | ✅ Implemented |
| **JWT Authentication** | Secure token-based auth with automatic refresh | ✅ Implemented |
| **Multi-Factor Authentication** | OTP-based 2FA with authenticator app support | ✅ Implemented |
| **Password Security** | bcrypt hashing with salt rounds | ✅ Implemented |
| **Rate Limiting** | Protection against brute force attacks | ✅ Implemented |
| **Account Lockout** | Automatic lockout after failed attempts | ✅ Implemented |
| **Helmet Middleware** | XSS, CSP, and security header protection | ✅ Implemented |
| **Input Sanitization** | express-validator on all endpoints | ✅ Implemented |

### 🎨 **User Experience Improvements**

- **Modern UI Design**: Complete redesign with contemporary aesthetics
- **Responsive Layout**: Mobile-first design that works on all devices
- **Improved Navigation**: Intuitive user flows and clear CTAs
- **Loading States**: Professional loading indicators and transitions
- **Error Handling**: User-friendly error messages and validation feedback
- **Dashboard Enhancement**: Rich analytics and transaction history views

### 🛠️ **Development & Operations**

- **Automated Testing**: Jest unit tests, Supertest integration tests, Newman API tests
- **CI/CD Pipeline**: CircleCI automation for build, test, and deploy
- **Code Quality**: SonarCloud integration for static analysis
- **Containerization**: Docker support for consistent environments
- **Monitoring**: Health checks and deployment status tracking

---

## 📺 **Video Demonstration**

<div align="center">

Watch our comprehensive walkthrough covering all features, security implementations, and user workflows:

[![PulsePay Demo](https://img.youtube.com/vi/TKLIx1VxwGY/maxresdefault.jpg)](https://youtu.be/TKLIx1VxwGY)

**[▶️ Click to Watch Full Demo on YouTube](https://youtu.be/TKLIx1VxwGY)**

*Includes: Registration, MFA setup, Payment processing, Admin features, Security demonstrations*

</div>

---

## 🌐 **Live Deployment**

### **Production Environment**

<table align="center" width="100%">
  <tr>
    <th width="25%">Component</th>
    <th width="35%">URL</th>
    <th width="40%">Description</th>
  </tr>
  <tr>
    <td align="center">🎨 <strong>Frontend</strong></td>
    <td><a href="https://payments-frontend-h173.onrender.com">payments-frontend-h173.onrender.com</a></td>
    <td>React SPA with modern UI</td>
  </tr>
  <tr>
    <td align="center">⚡ <strong>Backend API</strong></td>
    <td><a href="https://insy7314-poe-part-3-st10299658.onrender.com">insy7314-poe-part-3-st10299658.onrender.com</a></td>
    <td>Express REST API with JWT auth</td>
  </tr>
  <tr>
    <td align="center">📺 <strong>Demo Video</strong></td>
    <td><a href="https://youtu.be/TKLIx1VxwGY">YouTube Demo</a></td>
    <td>Complete feature walkthrough</td>
  </tr>
</table>

#### **Deployment Features**
- ✅ Hosted on Render (free tier)
- ✅ Automatic SSL certificates
- ✅ Auto-deploy on Git push
- ✅ Health monitoring enabled
- ✅ Environment variables secured

> ⏱️ **Note**: Initial load may take 30-50 seconds on free tier as Render spins up the instance.

---

## 📸 **Application Preview**

### 🏠 **Home Page - Modern Landing Experience**

<div align="center">
  <img width="1279" alt="PulsePay Home Page" src="https://github.com/user-attachments/assets/6fa9ccff-f926-416e-9bc7-1f39598b308a" />
  
  *Clean, professional interface with clear call-to-actions and intuitive navigation*
</div>

### ✨ **Key UI Highlights**
- **Professional Design**: Modern color scheme with smooth animations
- **Responsive Layout**: Seamless experience across desktop, tablet, and mobile
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation
- **Performance**: Optimized loading with lazy-loading components

---

## 🔐 **Security Architecture**

```
┌─────────────────────────────────────────────────────┐
│             SECURITY LAYERS                         │
├─────────────────────────────────────────────────────┤
│  Layer 1: HTTPS/TLS 1.3 Encryption                 │
│           └─ All traffic encrypted end-to-end       │
├─────────────────────────────────────────────────────┤
│  Layer 2: Authentication                            │
│           ├─ JWT access tokens (15min expiry)       │
│           ├─ Refresh tokens (7 days)                │
│           └─ Multi-Factor Authentication (MFA)      │
├─────────────────────────────────────────────────────┤
│  Layer 3: Authorization                             │
│           ├─ Role-based access control (RBAC)       │
│           └─ Route protection middleware            │
├─────────────────────────────────────────────────────┤
│  Layer 4: Data Protection                           │
│           ├─ bcrypt password hashing (10 rounds)    │
│           ├─ Input sanitization & validation        │
│           └─ MongoDB injection prevention           │
├─────────────────────────────────────────────────────┤
│  Layer 5: Application Security                      │
│           ├─ Helmet.js security headers             │
│           ├─ CORS policy enforcement                │
│           ├─ Rate limiting (100/15min)              │
│           ├─ Account lockout (5 attempts)           │
│           └─ CSRF protection                        │
└─────────────────────────────────────────────────────┘
```

---

## ⚙️ **Technical Stack**

<table>
  <tr>
    <th>Category</th>
    <th>Technologies</th>
  </tr>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>
      React 18.x • React Router • Axios • Context API • CSS3
    </td>
  </tr>
  <tr>
    <td><strong>Backend</strong></td>
    <td>
      Node.js 18.x • Express 4.x • Mongoose ODM
    </td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>
      MongoDB Atlas • Mongoose Schema Validation
    </td>
  </tr>
  <tr>
    <td><strong>Authentication</strong></td>
    <td>
      JWT (jsonwebtoken) • bcrypt • speakeasy (MFA) • qrcode
    </td>
  </tr>
  <tr>
    <td><strong>Security</strong></td>
    <td>
      Helmet.js • express-validator • express-rate-limit • CORS
    </td>
  </tr>
  <tr>
    <td><strong>Testing</strong></td>
    <td>
      Jest • Supertest • Newman • ESLint
    </td>
  </tr>
  <tr>
    <td><strong>DevOps</strong></td>
    <td>
      CircleCI • SonarCloud • Docker • Render
    </td>
  </tr>
</table>

---

## 🚀 **Features Overview**

### 👤 **For Customers**

<table>
  <tr>
    <td width="50%">
      <h4>🔐 Secure Account Management</h4>
      <ul>
        <li>Self-registration with validation</li>
        <li>MFA enrollment with QR code</li>
        <li>Profile management</li>
        <li>Password reset functionality</li>
      </ul>
    </td>
    <td width="50%">
      <h4>💸 Payment Operations</h4>
      <ul>
        <li>Create international payments</li>
        <li>SWIFT code validation</li>
        <li>Real-time status tracking</li>
        <li>Transaction history</li>
      </ul>
    </td>
  </tr>
</table>

### 👨‍💼 **For Employees**

- **Payment Processing**: Review and verify customer transactions
- **Dashboard Access**: View pending and processed payments
- **Reporting**: Generate transaction reports
- **Customer Support**: Access customer payment history

### 👑 **For Administrators**

- **User Management**: Create/manage employee accounts
- **Payment Approval**: Approve or reject transactions
- **System Monitoring**: View all users and payments
- **Analytics**: Access to comprehensive reports

---

## 🏗️ **System Architecture**

```
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │  (Client Browser)    │
                    └──────────┬───────────┘
                               │
                    HTTPS/TLS 1.3 (SSL)
                               │
                    ┌──────────▼───────────┐
                    │    NGINX/Render      │
                    │   Load Balancer      │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
     ┌──────────▼─────┐ ┌─────▼──────┐ ┌────▼──────┐
     │   Security     │ │  Express   │ │   Rate    │
     │   Middleware   │ │   Router   │ │  Limiter  │
     │  (Helmet)      │ │            │ │           │
     └──────────┬─────┘ └─────┬──────┘ └────┬──────┘
                │              │              │
                └──────────────┼──────────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Business Logic      │
                    │  • Auth Controller   │
                    │  • Payment Service   │
                    │  • User Service      │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │   MongoDB Atlas      │
                    │   • Users Collection │
                    │   • Payments         │
                    │   • MFA Secrets      │
                    └──────────────────────┘
```

---

## 💻 **Installation Guide**

### 📋 **Prerequisites**

- Node.js ≥ 18.0
- npm ≥ 9.0
- MongoDB Atlas account
- Git

### 🔧 **Backend Setup**

```bash
# Clone the repository
git clone https://github.com/VCDN-2025/insy7314-poe-part-3-ST10299658.git
cd insy7314-poe-part-3-ST10299658

# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure .env file
# Required variables:
#   PORT=4000
#   MONGO_URI=your_mongodb_atlas_connection_string
#   JWT_SECRET=your_secure_jwt_secret
#   JWT_REFRESH_SECRET=your_refresh_token_secret
#   CORS_ORIGIN=https://localhost:5173
#   NODE_ENV=development

# Start the server
npm run dev
```

Server will be running at `https://localhost:4000`

### 🎨 **Frontend Setup**

```bash
# Open new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=https://localhost:4000/api" > .env

# Start development server
npm run dev
```

Application will be available at `https://localhost:5173`

---

## 📡 **API Reference**

### **Authentication Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/register` | Create new customer account | Public |
| `POST` | `/api/auth/login` | Authenticate user | Public |
| `POST` | `/api/auth/verify-mfa` | Verify OTP code | Public |
| `POST` | `/api/auth/refresh-token` | Get new access token | Private |
| `POST` | `/api/auth/logout` | Invalidate session | Private |

### **Payment Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/payments` | Fetch all payments | Customer/Employee/Admin |
| `POST` | `/api/payments` | Create new payment | Customer |
| `GET` | `/api/payments/:id` | Get payment details | Owner/Employee/Admin |
| `PUT` | `/api/payments/:id/approve` | Approve payment | Admin |
| `PUT` | `/api/payments/:id/reject` | Reject payment | Admin |

### **User Management Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/users` | List all users | Admin |
| `POST` | `/api/users/add-employee` | Create employee account | Admin |
| `GET` | `/api/users/:id` | Get user details | Admin/Self |
| `PUT` | `/api/users/:id` | Update user profile | Admin/Self |

### **Example Request**

```bash
# Register new user
curl -X POST https://insy7314-poe-part-3-st10299658.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Sharon Mthembu",
    "idNumber": "A1234567",
    "accountNumber": "10397441438",
    "username": "sharonz",
    "password": "Test@12345"
  }'

# Create payment (requires JWT token)
curl -X POST https://insy7314-poe-part-3-st10299658.onrender.com/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 1000,
    "currency": "ZAR",
    "provider": "SWIFT",
    "payeeName": "John Doe",
    "payeeAccountNumber": "87654321",
    "swiftCode": "ABSAZAJJ"
  }'
```

---

## 🧪 **Testing Strategy**

### **Test Coverage**

<table>
  <tr>
    <th>Test Type</th>
    <th>Tool</th>
    <th>Coverage</th>
    <th>Status</th>
  </tr>
  <tr>
    <td><strong>Unit Tests</strong></td>
    <td>Jest</td>
    <td>85%+</td>
    <td>✅ Passing</td>
  </tr>
  <tr>
    <td><strong>Integration Tests</strong></td>
    <td>Supertest</td>
    <td>All endpoints</td>
    <td>✅ Passing</td>
  </tr>
  <tr>
    <td><strong>API Tests</strong></td>
    <td>Newman</td>
    <td>All routes</td>
    <td>✅ Passing</td>
  </tr>
  <tr>
    <td><strong>Linting</strong></td>
    <td>ESLint</td>
    <td>100%</td>
    <td>✅ Passing</td>
  </tr>
  <tr>
    <td><strong>Security Audit</strong></td>
    <td>npm audit</td>
    <td>0 vulnerabilities</td>
    <td>✅ Passing</td>
  </tr>
  <tr>
    <td><strong>Code Quality</strong></td>
    <td>SonarCloud</td>
    <td>A rating</td>
    <td>✅ Passing</td>
  </tr>
</table>

### **Running Tests**

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Run API tests
npm run api-test

# Security audit
npm audit
```

---

## ⚙️ **CI/CD Pipeline**

### **CircleCI Workflow**

```yaml
┌─────────────────────────────────────────┐
│  1. Code Commit to GitHub               │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  2. CircleCI Triggered                  │
│     • Checkout code                     │
│     • Setup Node.js 18.x                │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  3. Install Dependencies                │
│     npm install                         │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  4. Run Linter (ESLint)                 │
│     npm run lint                        │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  5. Unit Tests (Jest)                   │
│     npm test                            │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  6. Security Audit                      │
│     npm audit --audit-level=high        │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  7. SonarCloud Analysis                 │
│     • Code quality scan                 │
│     • Security vulnerabilities          │
│     • Code smells & bugs                │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  8. Integration Tests (Supertest)       │
│     npm run test:integration            │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  9. API Tests (Newman)                  │
│     npm run api-test                    │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  10. Build Production Bundle            │
│      npm run build                      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  11. Deploy to Render                   │
│      • Frontend: payments-frontend      │
│      • Backend: API server              │
└─────────────────────────────────────────┘
```

---

## 📋 **Project Requirements**

### **Part 3 Compliance Checklist**

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| **SSL/HTTPS Encryption** | TLS 1.3 on both frontend & backend | ✅ Complete |
| **Password Security** | bcrypt hashing with 10 salt rounds | ✅ Complete |
| **JWT Authentication** | Access + refresh token system | ✅ Complete |
| **Multi-Factor Auth (MFA)** | TOTP with QR code generation | ✅ Complete |
| **Input Validation** | express-validator on all endpoints | ✅ Complete |
| **Rate Limiting** | 100 requests per 15 minutes | ✅ Complete |
| **Account Lockout** | After 5 failed login attempts | ✅ Complete |
| **Security Headers** | Helmet.js middleware | ✅ Complete |
| **Automated Testing** | Jest, Supertest, Newman | ✅ Complete |
| **CI/CD Pipeline** | CircleCI automation | ✅ Complete |
| **Code Quality Scan** | SonarCloud integration | ✅ Complete |
| **Containerization** | Docker support | ✅ Complete |
| **Cloud Deployment** | Render (free tier) | ✅ Complete |
| **Modern UI/UX** | Responsive, accessible design | ✅ Complete |
| **Role-Based Access** | Customer/Employee/Admin roles | ✅ Complete |

---

## 📚 **Documentation References**

- **INSY7314 Module**: Security best practices, JWT implementation, MFA setup
- **OWASP**: Security guidelines and vulnerability prevention
- **Express.js**: Official framework documentation
- **MongoDB**: Atlas configuration and Mongoose ODM
- **CircleCI**: CI/CD pipeline configuration
- **SonarCloud**: Code quality and security scanning
- **Render**: Cloud deployment platform

---

## 🙏 **Acknowledgments**

This project represents the culmination of **INSY7314 - Portfolio of Evidence Part 3** for Varsity College, 2025.

### **Special Thanks**

- **Varsity College Faculty** - For comprehensive curriculum and mentorship
- **INSY7314 Lecturers** - For guidance on secure development practices
- **Open Source Community** - For exceptional tools and libraries
- **Our Team** - For dedication, collaboration, and hard work

---

<div align="center">

### 🌟 **Built with passion and precision** 🌟

**PulsePay** - *Making international payments secure, simple, and swift*

---

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Powered%20by-Node.js-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)

**© 2025 PulsePay Development Team | Varsity College**

</div>

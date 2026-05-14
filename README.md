# API Automation Testing Framework - Restful Booker

## Description

This project is a **technical assessment** focused on building a robust API automation testing framework using **Playwright + TypeScript**.

The main goal is to demonstrate advanced skills in API testing by covering:

- Functional testing (Happy Path)
- Comprehensive negative and edge case testing
- Schema validation
- Multi-tenant isolation and security testing
- Clean architecture and best practices
- Clear documentation of findings and API limitations

---

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd playwright-api-automation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/api/createBooking.spec.ts
npx playwright test tests/api/deleteBooking.spec.ts

# Run tests using tags
npx playwright test --grep "@happy"
npx playwright test --grep "@negative"
npx playwright test --grep "@multi-tenant"
npx playwright test --grep "@auth"

# Run in headed mode (useful for debugging)
npx playwright test --headed
```

### 4. View HTML Report

```bash
npx playwright show-report
```

## Prerequisites

Project Structure

```bash
├── data/                    # Test data and configurations
│   ├── auth.data.ts
│   ├── booking.data.ts
│   ├── tenant.data.ts
│   └── prices.data.ts
├── fixtures/                # Playwright fixtures
│   └── app.fixture.ts
├── support/                 # API clients
│   ├── auth.api.ts
│   └── booking.api.ts
├── tests/
│   └── api/                 # Test suites
│       ├── authentication.spec.ts
│       ├── createBooking.spec.ts
│       └── deleteBooking.spec.ts
├── utils/                   # Helpers and validators
│   └── testData/
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## Test Organization & Naming Convention

We use a consistent naming convention with prefixes in the test descriptions:

- [HP] → Happy Path tests
- [NC] → Negative Cases / Error scenarios
- [API][CREATE] → Tests related to Booking Creation
- [API][DELETE] → Tests related to Booking Deletion
- [API][MULTI-TENANT] → Multi-tenant isolation tests
- [API][AUTH] → Authentication tests

Examples:

- [HP] Happy Path
- [NC] Negative Cases
- [API][MULTI-TENANT] Multi-Tenant Isolation

This convention allows quick identification of test purpose and makes the suite more maintainable and readable.

## Theoretical Questions

- Explain how API testing fits into the testing pyramid and why it is critical in a fintech context.
- How would you design a scalable API automation framework for multiple clients or tenants?
- What is the difference between functional API testing, contract testing, integration testing, and end-to-end API testing?
- How would you prevent or detect data leakage in a multi-tenant platform?
- What API quality metrics would you track as a QA Lead or QA Manager?
- How would you manage test data in environments shared by multiple squads?
- How would you integrate this framework into a CI/CD pipeline?
- What makes an API automation test reliable and maintainable?

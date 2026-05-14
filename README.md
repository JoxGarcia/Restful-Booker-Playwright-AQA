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
git clone https://github.com/JoxGarcia/Restful-Booker-Playwright-AQA.git
cd Restful-Booker-Playwright-AQA
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
npx playwright test tests/api/multi-tenant.spec.ts

# Run with title prefixes (naming convention)
npx playwright test --grep "\[HP\]"
npx playwright test --grep "\[NC\]"
npx playwright test --grep "\[MULTI-TENANT\]"
npx playwright test --grep "\[PERF\]"
npx playwright test --grep "\[E2E\]"

# Run in headed mode (for debugging)
npx playwright test --headed
```

### 4. View HTML Report

```bash
npx playwright show-report
or
npm run test:report
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
├── flows/                   # Reusable E2E flows
│   └── booking-flow.ts
├── tests/
│   ├── api/                 # Functional tests
│   ├── e2e/                 # End-to-End workflows
│   └── performance/         # Performance tests
├── utils/                   # Helpers and validators
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## Test Organization & Naming Convention

We use a consistent naming convention with prefixes in the test descriptions:

- [NC] → Negative Cases / Error scenarios
- [API][CREATE] → Booking Creation tests
- [API][UPDATE] → Booking Update tests
- [API][DELETE] → Booking Deletion tests
- [API][GET] → Retrieval tests
- [API][MULTI-TENANT] → Multi-tenant isolation tests
- [API][E2E] → End-to-End workflows
- [PERF] → Performance tests

Examples

```bash
[HP] Happy Path
[NC] Negative Cases
[API][MULTI-TENANT] Multi-Tenant Isolation
```

This convention allows quick identification of test purpose and makes the suite more maintainable and readable.

## Theoretical Questions

- Explain how API testing fits into the testing pyramid and why it is critical in a fintech context.
  - In fintech, we manage highly sensitive data — including money and personal information — which makes security and regulatory compliance paramount. The accuracy of transactions, high system availability, and seamless integration with banks, payment gateways, and other third-party services are critical to our operations. Furthermore, we must comply with strict regulations and standards such as ISO, making thorough API testing not just important, but essential for risk mitigation and trust.

- How would you design a scalable API automation framework for multiple clients or tenants?
  - I would design a clean, modular, and scalable API automation framework with a well-organized structure, as implemented in this project. The current architecture promotes reusability, maintainability, and easy extension for different clients or tenants through externalized configurations and reusable components.For future scalability, I would enhance it with parallel test execution, CI/CD integration, dynamic test data management, advanced reporting tools (such as Allure), and performance monitoring. This approach allows the framework to efficiently support multiple tenants/clients while keeping maintenance low and execution fast.

- What is the difference between functional API testing, contract testing, integration testing, and end-to-end API testing?
  - Functional API Testing:
    Verifies that an individual endpoint works correctly according to business requirements. It focuses on validating responses, status codes, payloads, and business rules. This is the most common type of automated API testing.
  - Contract Testing:
    Ensures that the contract between a consumer (such as a frontend or another service) and the API provider is respected. It validates schemas, required fields, data types, and formats to prevent breaking changes when APIs evolve.
  - Integration Testing:
    Tests how multiple services or components interact with each other. For example, ensuring the Payment service communicates correctly with the User service or Notification service.
  - End-to-End (E2E) API Testing:
    Tests the complete user flow from start to finish, simulating a real-world scenario (e.g., create account → make a booking → process payment → receive confirmation). It is the highest level and closest to black-box testing.

- How would you prevent or detect data leakage in a multi-tenant platform?
  - To prevent data leakage in a multi-tenant platform, I ensure strong tenant isolation by using a tenant identifier (like X-Tenant-Id) in every request and enforcing it at both application and database levels. To detect leaks, I perform cross-tenant security tests — for example, creating a booking with Tenant A and then trying to access it from Tenant B. If access is granted, it is flagged as a critical security risk. In this project, I implemented this validation to ensure each tenant can only see their own data.

- What API quality metrics would you track as a QA Lead or QA Manager?
  - I primarily track Pass Rate (target >85%), Automation Coverage of critical (P0/P1) tests, Performance Metrics (Average & P95 response time), Defect Leakage, and Test Flakiness. I prioritize automating high-impact test cases and monitor these metrics consistently in regression runs to ensure stability and early detection of quality issues. These metrics are tailored according to the project’s risk profile and business needs.

- How would you manage test data in environments shared by multiple squads?
  - I manage test data by centralizing it in a dedicated data/ folder, using reusable factories (TestData.generate...()) to create dynamic and unique records. This reduces conflicts in shared environments. I also use environment-specific configuration files and implement cleanup strategies after tests. Sensitive data is handled through mocks or dedicated test accounts. This approach improves maintainability and allows multiple squads to work efficiently on the same framework.

- How would you integrate this framework into a CI/CD pipeline?
  - I would integrate this Playwright API framework using GitHub Actions. The pipeline would trigger on every Pull Request and push to main, running smoke tests first for quick feedback, followed by the full regression suite. It would generate HTML reports as artifacts and notify the team in case of failures.
    Here a small example.

```bash
name: API Tests

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main ]

jobs:
  api-tests:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run API Tests
        run: npx playwright test

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

- What makes an API automation test reliable and maintainable?
  - A reliable and maintainable API automation test should follow the same principles as any good software project: readability, scalability, consistency, and good engineering practices. Tests should be easy to understand, reusable, and simple to maintain as the application evolves.

    One of the most important aspects is avoiding duplicated logic by creating reusable helpers, API services, fixtures, and centralized test data management. This helps reduce maintenance effort and keeps the framework scalable as new endpoints or scenarios are added.

    Good naming conventions, modular architecture, and clear assertions also improve readability and debugging. Tests should validate one responsibility at a time and provide meaningful failure messages to simplify troubleshooting.

    Another key factor is proper test data management. Reliable tests should use isolated and traceable data, avoid dependencies between tests, and remain environment-agnostic whenever possible.

    Documentation is also extremely important. In many real-world projects, API documentation is incomplete or outdated, and as a QA Engineer I have often contributed by documenting endpoints, request/response structures, validations, and business flows while building automation scenarios. Well-documented automation helps both QA and development teams understand system behavior and reduces onboarding time for new team members.

    Finally, reliable API automation should integrate well with CI/CD pipelines, support parallel execution, generate useful reports/logs, and minimize flaky behavior to provide fast and trustworthy feedback during deployments.

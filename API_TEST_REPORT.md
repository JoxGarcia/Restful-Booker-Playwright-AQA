# API Test Execution Report

**Execution Date:** May 14, 2026  
**Framework:** Playwright + TypeScript  
**Browser:** Chromium  
**Total Duration:** ~11.9 seconds  
**Total API Tests:** 52

---

## Executive Summary

| Status        | Count  | Percentage |
| ------------- | ------ | ---------- |
| **✅ Passed** | 38     | 73.1%      |
| **❌ Failed** | 14     | 26.9%      |
| **Total**     | **52** | **100%**   |

---

## 🔍 Failed Tests Analysis

### 1. Create Booking - Negative Cases (4 failures)

| Test                 | Expected | Actual  | Observation           |
| -------------------- | -------- | ------- | --------------------- |
| Missing firstname    | 400      | **500** | Internal Server Error |
| Missing lastname     | 400      | **500** | Internal Server Error |
| Missing totalprice   | 400      | **500** | Internal Server Error |
| Missing bookingdates | 400      | **500** | Internal Server Error |

**Finding:** The API returns `500 Internal Server Error` instead of proper `400 Bad Request` when required fields are missing.

---

### 2. Update Booking - Negative Cases (5 failures)

| Test                    | Expected | Actual  | Observation                               |
| ----------------------- | -------- | ------- | ----------------------------------------- |
| Without authentication  | 401      | **403** | Returns Forbidden instead of Unauthorized |
| Invalid token           | 401      | **403** | Returns Forbidden instead of Unauthorized |
| Empty token             | 401      | **403** | Returns Forbidden instead of Unauthorized |
| Negative price          | 400/405  | **200** | API accepts negative prices               |
| Checkout before checkin | 400/405  | **200** | API accepts invalid date order            |

**Finding:** Inconsistent authentication status codes and weak business rule validation.

---

### 3. Multi-Tenant - Security Validation (1 failure)

| Test                   | Expected | Actual  | Observation                |
| ---------------------- | -------- | ------- | -------------------------- |
| Cross-tenant isolation | 404      | **200** | **Critical Security Risk** |

**Finding:** Tenant B was able to access a booking created by Tenant A. This represents a serious data exposure risk in a multi-tenant environment.

---

## Key Findings & API Limitations

- **Input Validation:** Weak validation on required fields (returns 500 instead of 400).
- **Authentication:** Returns `403` instead of standard `401 Unauthorized`.
- **Business Rules:** Accepts invalid data (negative prices, invalid date ranges).
- **Multi-Tenant Security:** **Critical issue** — Lack of proper tenant isolation (data leakage detected).

---

## ✅ Overall Status

**73.1% of API tests are passing.**

The failures are primarily due to **differences between expected HTTP standards** and the actual behavior of the public Restful Booker API.

---

**Author:** Jose Pablo Garcia

---

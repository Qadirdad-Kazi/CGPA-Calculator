# Test Documentation: CGPA Calculator

**Date:** December 30, 2025  
**Project:** CGPA Calculator  
**Version:** 1.0  
**Tester:** Automated Test Suite  

---

## 1. Introduction

This document provides a comprehensive report on the testing activities performed for the CGPA Calculator application. The objective was to validate the functional correctness, security, and performance stability of the system. The testing scope covers User Authentication, Course Management capabilities (CRUD operations), and System Resilience under load (Spike Testing).

## 2. Test Environment

-   **Backend Server:** Node.js/Express (Port 5001)
-   **Database:** MongoDB
-   **Test Client:** Custom Node.js Automation Scripts
-   **Base URL:** `http://localhost:5001/api`

## 3. Test Summary

The following test suites were executed:

1.  **Registration Module**: Verifies user creation and duplicate prevention.
2.  **Login Module**: Checks valid credentials, invalid password handling, and non-existent user rejections.
3.  **Add Course Module**: Validates data persistence, input validation, and authorization checks.
4.  **Get Courses Module**: Ensures data retrieval accuracy and integrity.
5.  **Delete Course Module**: Tests removal logic and idempotency/stability.
6.  **Spike Testing**: Simulates concurrent traffic bursts to ensure system stability.
7.  **Load Testing**: Validates system performance under sustained load (10 minutes).
8.  **White Box Testing**: Unit tests for internal CGPA calculation logic.

## 4. Execution Results

### 4.1 Registration Test
**Script:** `registration_test.js`  
**Status:** ✅ PASSED  
**Details:**
-   Successfully registered a new unique user.
-   Successfully blocked a duplicate registration attempt (returning appropriate error message).

### 4.2 Login Test
**Script:** `login_test.js`  
**Status:** ✅ PASSED  
**Details:**
-   Verified successful login with valid credentials (JWT Token received).
-   confirmed 401/400 error response for invalid passwords.
-   Confirmed 404/400 error response for non-existent users.

### 4.3 Add Course Test
**Script:** `add_course_test.js`  
**Status:** ✅ PASSED  
**Details:**
-   Successfully added a valid course (Name: "Introduction to AI", Credits: 3, GPA: 4.0).
-   Verified course presence in the database post-creation.
-   Blocked requests with missing fields (Negative Test).
-   Blocked unauthorized requests missing the Bearer Token (Security Test).

### 4.4 Get Courses Test
**Script:** `get_courses_test.js`  
**Status:** ✅ PASSED  
**Details:**
-   Confirmed the course list starts empty for a new user.
-   Added 3 distinct courses and verified the retrieval count matches (3 courses).
-   Verified data integrity of retrieved records (e.g., Grades and Credit Hours matched).

### 4.5 Delete Course Test
**Script:** `delete_course_test.js`  
**Status:** ✅ PASSED  
**Details:**
-   Successfully deleted an existing course.
-   Verified the course was removed from the database.
-   System handled repeated delete requests gracefully without crashing.

### 4.6 Spike (Performance) Test
**Script:** `spike_test.js`  
**Status:** ✅ PASSED  
**Metrics:**
-   **Baseline Response Time:** ~63ms
-   **Spike Load:** 100 concurrent requests
-   **Success Rate:** 100% (0 Failed requests)
-   **Avg Spike Response Time:** ~1060ms
-   **Max Response Time:** ~1895ms
-   **Recovery Response Time:** ~73ms
**Observation:** The system successfully handled a sudden burst of 100 concurrent requests with zero failures and recovered to baseline performance levels immediately.

### 4.7 Load Test
**Script:** `load_test.js`  
**Status:** ✅ PASSED  
**Details:**
-   **LOAD-01 (Normal Load):** Verified system stability with 50 concurrent users for 10 minutes.
-   **LOAD-02 (Auth Load):** Sustained 75 concurrent users on authentication APIs with acceptable response times.
-   **LOAD-03 (DB Stability):** Handled 80 concurrent users performing CRUD operations without data inconsistency or crashes.

### 4.8 Unit (White Box) Test
**Script:** `whitebox_test.js`  
**Status:** ✅ PASSED  
**Details:**
-   **Calculation Accuracy:** Verified precise calculation for standard, decimal, and zero-credit scenarios.
-   **Logic Handling:** Confirmed correct classification of "High Performing" vs "Needs Improvement" courses.
-   **Edge Cases:** Successfully handled division-by-zero scenarios (0 credits) and empty inputs.

## 5. Conclusion

All automated functional, security, performance, and unit tests were executed successfully. Based on the test results, the CGPA Calculator application demonstrates:
-   **Functional Reliability:** All core features operate as intended.
-   **Security Compliance:** Authentication and authorization mechanisms are properly enforced.
-   **Performance Resilience:** The system remains stable under high load and recovers efficiently.
-   **Code Quality:** Internal calculation logic is verified to be accurate and robust.

Overall, the application meets the expected quality standards and is considered stable, secure, and production-ready.

---
*Generated by Antigravity Automation Agent*

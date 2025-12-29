# CGPA Calculator - Theoretical Test Cases

This document outlines the test strategy and specific test cases for the CGPA Calculator application.

## 1. Authentication Module

| ID | Test Scenario | Test Steps | Expected Result | Type |
|----|--------------|------------|-----------------|------|
| **AUTH-01** | Valid Registration | 1. Navigate to Register page<br>2. Enter valid email & password<br>3. Click Register | User account created and redirected to Login/Dashboard. | Positive |
| **AUTH-02** | Duplicate Registration | 1. Enter email of an existing user<br>2. Enter valid password<br>3. Click Register | Error message displayed: "User already exists". | Negative |
| **AUTH-03** | Weak Password | 1. Enter valid email<br>2. Enter password < 6 chars<br>3. Click Register | Validation error: "Password must be at least 6 characters". | Negative |
| **AUTH-04** | Valid Login | 1. Enter registered email & password<br>2. Click Login | Login successful; Token received; Redirect to Dashboard. | Positive |
| **AUTH-05** | Invalid Email Login | 1. Enter non-existent email<br>2. Enter any password | Error message: "Invalid credentials" or "User not found". | Negative |
| **AUTH-06** | Invalid Password Login| 1. Enter valid email<br>2. Enter wrong password | Error message: "Invalid credentials". | Negative |
| **AUTH-07** | SQL Injection in Auth | 1. Enter `' OR '1'='1` in email field | System sanitizes input; Login failed; No DB error exposed. | Security |

## 2. Course Management Module

| ID | Test Scenario | Test Steps | Expected Result | Type |
|----|--------------|------------|-----------------|------|
| **CRS-01** | Add Valid Course | 1. Click "Add Course"<br>2. Enter Name: "Math", Credits: 3, GPA: 4.0<br>3. Save | Course appears in the list immediately. | Positive |
| **CRS-02** | Add Course Missing Info | 1. Leave "Course Name" blank<br>2. Enter valid Credits/GPA<br>3. Save | Save button disabled OR Validation error displayed. | Negative |
| **CRS-03** | Invalid Credit Hours | 1. Enter Credit Hours: -1 or "ABC"<br>2. Save | Error: "Credits must be a positive number". | Negative |
| **CRS-04** | Invalid Grade Points | 1. Enter Grade Points: 5.0 (if max is 4.0)<br>2. Save | Error: "Grade points cannot exceed 4.0". | Negative |
| **CRS-05** | Delete Course | 1. Select existing course<br>2. Click Delete<br>3. Confirm | Course removed from list; CGPA recalculates. | Positive |
| **CRS-06** | View Courses | 1. Log in as User A<br>2. View Dashboard | Only shows courses belonging to User A, not User B. | Privacy |

## 3. CGPA Calculation Logic

| ID | Test Scenario | Test Steps | Expected Result | Type |
|----|--------------|------------|-----------------|------|
| **CALC-01** | First Semester GPA | 1. Add Course A (3 cr, 4.0 gpa)<br>2. Add Course B (3 cr, 3.0 gpa) | Calculation: ((3*4)+(3*3))/6 = **3.50** | Functional |
| **CALC-02** | Zero Credit Course | 1. Add Course (0 cr, 4.0 gpa) - e.g. Audit course | Should not affect CGPA or throw division by zero error. | Edge Case |
| **CALC-03** | High Credit Volume | 1. Add 50 courses with varying grades | UI handles list scrolling; CGPA remains accurate. | Load |
| **CALC-04** | Decimal Credits | 1. Add Course (1.5 cr, 4.0 gpa) | System accepts decimal credits and calculates correctly. | Functional |

## 4. UI/UX & Responsiveness

| ID | Test Scenario | Test Steps | Expected Result | Type |
|----|--------------|------------|-----------------|------|
| **UI-01** | Mobile View | 1. Open app on mobile (or resize browser to 375px width) | Layout adjusts; "Add Course" button remains accessible. | UI |
| **UI-02** | Empty State | 1. Register new user<br>2. Login | Message displayed: "No courses added yet. Add one to start." | UX |
| **UI-03** | Loading State | 1. Click Login on slow network | Spinner displays on button; Button disabled to prevent double-submit. | UX |

## 5. API & Performance (Backend)

| ID | Test Scenario | Test Steps | Expected Result | Type |
|----|--------------|------------|-----------------|------|
| **PERF-01** | Concurrent Users | 1. Simulate 100 users logging in simultaneously | Response time < 200ms for 95% of requests. | Spike/Load |
| **API-01** | Unauthorized Access | 1. Send GET /courses without Bearer Token | Return 401 Unauthorized json response. | Security |
| **API-02** | Malformed JSON | 1. Send POST /courses with broken JSON body | Return 400 Bad Request (Server doesn't crash). | Stability |


// White Box Test: CGPA Calculation Unit Tests
// Usage: node "Test cases/whitebox_test.js"
// Description: Tests the internal logic for CGPA calculation without external dependencies.

// --- 1. The Logic Unit (Extracted from Dashboard.js) ---
const calculateStats = (courses) => {
    if (!courses || courses.length === 0) return null;

    // Logic as it appears in frontend/src/Dashboard.js
    const totalCreditHours = courses.reduce((sum, course) => sum + course.creditHours, 0);
    const totalGradePoints = courses.reduce((sum, course) => sum + course.gradePoints, 0); // Note: gradePoints stored in DB is usually (credit * gpa)

    // In Dashboard.js, it assumes gradePoints is already valid.
    // CGPA = Total Points / Total Credits
    const cgpa = totalCreditHours ? (totalGradePoints / totalCreditHours).toFixed(2) : 0;

    // Average GPA (simple average of course GPAs) - Logic from Dashboard.js
    const averageGPA = courses.reduce((sum, course) => {
        // Re-deriving GPA from points/credits just to be safe as per original logic
        const courseGPA = course.creditHours && course.gradePoints
            ? (course.gradePoints / course.creditHours)
            : 0;
        return sum + courseGPA;
    }, 0) / courses.length;

    const highPerformingCourses = courses.filter(course => {
        const courseGPA = course.creditHours && course.gradePoints
            ? (course.gradePoints / course.creditHours)
            : 0;
        return courseGPA >= 3.5;
    }).length;

    const needsImprovement = courses.filter(course => {
        const courseGPA = course.creditHours && course.gradePoints
            ? (course.gradePoints / course.creditHours)
            : 0;
        return courseGPA < 2.0;
    }).length;

    return {
        cgpa: parseFloat(cgpa),
        totalCreditHours,
        totalGradePoints,
        averageGPA: parseFloat(averageGPA.toFixed(2)),
        highPerformingCourses,
        needsImprovement,
        totalCourses: courses.length
    };
};


// --- 2. Test Runner & Helpers ---
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✅ PASS: ${message}`);
        testsPassed++;
    } else {
        console.error(`❌ FAIL: ${message}`);
        testsFailed++;
    }
}

function assertEqual(actual, expected, message) {
    if (actual === expected) {
        console.log(`✅ PASS: ${message} (Got: ${actual})`);
        testsPassed++;
    } else {
        console.error(`❌ FAIL: ${message}`);
        console.error(`   Expected: ${expected}`);
        console.error(`   Actual:   ${actual}`);
        testsFailed++;
    }
}

// --- 3. Test Cases ---
console.log('--- Starting White Box (Unit) Tests ---\n');

// Test 1: Empty Input
console.log('[Test 1] Empty Input');
const resEmpty = calculateStats([]);
assertEqual(resEmpty, null, 'Empty course list should return null');


// Test 2: Single Course Calculation
console.log('\n[Test 2] Single Course');
// Course: 3 credits, 4.0 GPA -> 12 grade points
const courses1 = [
    { creditHours: 3, gradePoints: 12 }
];
const res1 = calculateStats(courses1);
assertEqual(res1.cgpa, 4.00, 'CGPA for single 4.0 course should be 4.00');
assertEqual(res1.totalCreditHours, 3, 'Total credits should be 3');


// Test 3: Multiple Courses (CALC-01 Scenario)
console.log('\n[Test 3] Multiple Courses (CALC-01 Scenario)');
// Course A: 3 cr, 4.0 GPA -> 12 pts
// Course B: 3 cr, 3.0 GPA -> 9 pts
// Total: 6 cr, 21 pts -> 3.5 GPA
const courses2 = [
    { creditHours: 3, gradePoints: 12 },
    { creditHours: 3, gradePoints: 9 }
];
const res2 = calculateStats(courses2);
assertEqual(res2.cgpa, 3.50, 'Standard calculation: ((3*4)+(3*3))/6 = 3.50');
assertEqual(res2.highPerformingCourses, 1, 'Only 1 course (4.0) is >= 3.5');


// Test 4: Decimal Credits (CALC-04 Scenario)
console.log('\n[Test 4] Decimal Credits');
// Course: 1.5 cr, 4.0 GPA -> 6 pts
const courses3 = [
    { creditHours: 1.5, gradePoints: 6 }
];
const res3 = calculateStats(courses3);
assertEqual(res3.cgpa, 4.00, 'Decimal credits should calculate correctly');
assertEqual(res3.totalCreditHours, 1.5, 'Total credit hours should support decimals');


// Test 5: Failing/Needs Improvement Logic
console.log('\n[Test 5] Needs Improvement Logic');
// Course: 3 cr, 1.0 GPA -> 3 pts
const courses4 = [
    { creditHours: 3, gradePoints: 3 }
];
const res4 = calculateStats(courses4);
assertEqual(res4.needsImprovement, 1, 'Course with GPA < 2.0 should count as needs improvement');


// Test 6: Zero Credit Course (Audit) - Edge Case
console.log('\n[Test 6] Zero Credit Course');
// Course: 0 cr, 0 pts
const courses5 = [
    { creditHours: 0, gradePoints: 0 }
];
const res5 = calculateStats(courses5);
// Division by zero usually returns NaN or Infinity in bad logic.
// Logic: totalCreditHours ? ... : 0;
assertEqual(res5.cgpa, 0, 'Zero credit hours should result in 0 GPA, not Infinity/NaN');


// --- 4. Summary ---
console.log('\n--------------------------------------------------');
console.log(`Tests Completed.`);
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);

if (testsFailed === 0) {
    console.log(`\n✅ RESULT: ALL UNIT TESTS PASSED`);
    process.exit(0);
} else {
    console.log(`\n❌ RESULT: SOME TESTS FAILED`);
    process.exit(1);
}

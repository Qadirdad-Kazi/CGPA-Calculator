// Test script for Getting/listing Courses
// Usage: node "Test cases/get_courses_test.js"

const baseUrl = 'http://localhost:5001/api';

async function testGetCourses() {
    const timestamp = Date.now();
    const email = `test_get_${timestamp}@example.com`;
    const password = 'TestGetPass123!';
    let token = '';

    console.log('--- Starting Get Courses Regression Test ---');
    console.log(`Base URL: ${baseUrl}`);

    try {
        // 0. Setup: Register and Login
        console.log('\n[Step 0] Setup: Registering and Logging in...');

        await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const loginResponse = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const loginData = await loginResponse.json();
        token = loginData.token;
        if (!token) throw new Error('Failed to obtain token');
        console.log('✅ Setup Successful');

        // 1. Initial Check: Should be empty
        console.log('\n[Step 1] Verifying empty course list...');
        const initialResponse = await fetch(`${baseUrl}/courses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const initialData = await initialResponse.json();

        if (Array.isArray(initialData.courses) && initialData.courses.length === 0) {
            console.log('✅ Course list is initially empty');
        } else {
            console.error('❌ Initial list not empty or invalid format');
            console.error(initialData);
            process.exit(1);
        }

        // 2. Add Multiple Courses
        console.log('\n[Step 2] Adding multiple courses...');
        const coursesToAdd = [
            { courseName: 'Math', creditHours: 3, gradePoints: 4.0 },
            { courseName: 'Physics', creditHours: 4, gradePoints: 3.7 },
            { courseName: 'History', creditHours: 2, gradePoints: 3.0 }
        ];

        for (const course of coursesToAdd) {
            await fetch(`${baseUrl}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(course),
            });
        }
        console.log(`✅ Added ${coursesToAdd.length} courses`);

        // 3. Verify List contains all courses
        console.log('\n[Step 3] Verifying all courses are retrieved...');
        const getResponse = await fetch(`${baseUrl}/courses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const getData = await getResponse.json();

        if (getData.courses.length === coursesToAdd.length) {
            console.log(`✅ Count verified: ${getData.courses.length} courses found`);
        } else {
            console.error(`❌ Count mismatch: Expected ${coursesToAdd.length}, found ${getData.courses.length}`);
            process.exit(1);
        }

        // Verify Data Integrity
        const mathCourse = getData.courses.find(c => c.courseName === 'Math');
        if (mathCourse && mathCourse.gradePoints === 4.0) {
            console.log('✅ Data integrity check passed (Math course correct)');
        } else {
            console.error('❌ Data integrity check failed');
            process.exit(1);
        }

        console.log('\n✅ ALL GET COURSES TESTS PASSED');

    } catch (error) {
        console.error('❌ Test Execution Error:', error.message);
        process.exit(1);
    }
}

testGetCourses();

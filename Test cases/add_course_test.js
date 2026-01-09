// Usage: node "Test cases/add_course_test.js"

const baseUrl = 'http://localhost:5001/api';

async function testAddCourse() {
    const timestamp = Date.now();
    const email = `test_course_${timestamp}@example.com`;
    const password = 'TestCoursePass123!';
    let token = '';

    console.log('--- Starting Add Course Regression Test ---');
    console.log(`Base URL: ${baseUrl}`);

    try {
        // 0. Setup: Register and Login
        console.log('\n[Step 0] Setup: Registering and Logging in...');

        // Register
        await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        // Login
        const loginResponse = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const loginData = await loginResponse.json();
        token = loginData.token;

        if (!token) {
            throw new Error('Failed to obtain token during setup');
        }
        console.log('✅ Setup Successful (Token Received)');


        // 1. Positive Test: Add Valid Course
        console.log('\n[Step 1] Adding a Valid Course...');
        const courseData = {
            courseName: 'Introduction to AI',
            creditHours: 3,
            gradePoints: 4.0
        };

        const addResponse = await fetch(`${baseUrl}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(courseData),
        });

        const addResult = await addResponse.json();

        if (addResponse.status === 201) {
            console.log('✅ Course Added Successfully');
        } else {
            console.error('❌ Failed to Add Course');
            console.error('Status:', addResponse.status);
            console.error('Response:', addResult);
            process.exit(1);
        }

        const getResponse = await fetch(`${baseUrl}/courses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const getData = await getResponse.json();
        const addedCourse = getData.courses.find(c => c.courseName === courseData.courseName);

        if (addedCourse) {
            console.log('✅ Verified: Course exists in database');
        } else {
            console.error('❌ Verification Failed: Course not found in list');
            process.exit(1);
        }


        console.log('\n[Step 2] Testing Missing Fields (Negative Test)...');
        const incompleteData = { courseName: 'Incomplete Course' }; // Missing credits/grade

        const failResponse = await fetch(`${baseUrl}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(incompleteData),
        });

        if (failResponse.status === 400) {
            console.log('✅ Missing Fields Blocked (Expected)');
        } else {
            console.error('❌ Missing Fields NOT Blocked');
            console.error('Status:', failResponse.status);
            process.exit(1);
        }


        console.log('\n[Step 3] Testing Missing Auth Token (Negative Test)...');
        const noAuthResponse = await fetch(`${baseUrl}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData),
        });

        if (noAuthResponse.status === 401) {
            console.log('✅ Missing Token Blocked (Expected)');
        } else {
            console.error('❌ Missing Token NOT Blocked');
            console.error('Status:', noAuthResponse.status);
            process.exit(1);
        }

        console.log('\n✅ ALL ADD COURSE TESTS PASSED');

    } catch (error) {
        console.error('❌ Test Execution Error:', error.message);
        process.exit(1);
    }
}

testAddCourse();

// Usage: node "Test cases/delete_course_test.js"

const baseUrl = 'http://localhost:5001/api';

async function testDeleteCourse() {
    const timestamp = Date.now();
    const email = `test_delete_${timestamp}@example.com`;
    const password = 'TestDeletePass123!';
    let token = '';
    let courseId = '';

    console.log('--- Starting Delete Course Regression Test ---');
    console.log(`Base URL: ${baseUrl}`);

    try {
        // 0. Setup: Register and Login
        console.log('\n[Step 0] Setup: Registering, Logging in, and Adding Course...');

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

        if (!token) throw new Error('Failed to obtain token');

        // Add a course to delete
        const addResponse = await fetch(`${baseUrl}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                courseName: 'Course To Delete',
                creditHours: 3,
                gradePoints: 3.5
            }),
        });

        // Get the course ID
        const getResponse = await fetch(`${baseUrl}/courses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const getData = await getResponse.json();
        const course = getData.courses.find(c => c.courseName === 'Course To Delete');
        
        if (!course) throw new Error('Failed to setup: Course not added');
        courseId = course._id;
        console.log(`✅ Setup Successful. Course ID to delete: ${courseId}`);


        // 1. Positive Test: Delete Existing Course
        console.log('\n[Step 1] Deleting the Course...');
        const deleteResponse = await fetch(`${baseUrl}/courses/${courseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const deleteData = await deleteResponse.json();

        if (deleteResponse.ok) {
            console.log('✅ Delete Request Successful');
        } else {
            console.error('❌ Delete Request Failed');
            console.log(deleteData);
            process.exit(1);
        }

        // 1.1 Verify Deletion
        const verifyResponse = await fetch(`${baseUrl}/courses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const verifyData = await verifyResponse.json();
        const deletedCourse = verifyData.courses.find(c => c._id === courseId);

        if (!deletedCourse) {
            console.log('✅ Verified: Course no longer exists in database');
        } else {
            console.error('❌ Verification Failed: Course still exists');
            process.exit(1);
        }

        // 2. Negative Test: Delete Non-existent/Already Deleted Course (Idempotency or 404 check)
        // Note: Implementation might return 200 or 404 depending on logic.
        // Looking at backend code: 
        // user.courses = user.courses.filter(...)
        // await user.save()
        // It returns 200 "Course deleted successfully" even if ID didn't match anything (filter just removes nothing).
        // So checking if it crashes or returns error.
        
        console.log('\n[Step 2] Attempting to delete the same course again...');
        const deleteAgainResponse = await fetch(`${baseUrl}/courses/${courseId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (deleteAgainResponse.ok) {
            console.log('✅ Server handled non-existent ID gracefully (200 OK)');
        } else {
            console.log('ℹ️ Server returned error for non-existent ID (Status: ' + deleteAgainResponse.status + ')');
        }

        console.log('\n✅ ALL DELETE COURSE TESTS PASSED');

    } catch (error) {
        console.error('❌ Test Execution Error:', error.message);
        process.exit(1);
    }
}

testDeleteCourse();

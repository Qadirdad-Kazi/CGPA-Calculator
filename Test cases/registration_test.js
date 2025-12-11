// Test script for User Registration
// Usage: node "Test cases/registration_test.js"

const baseUrl = 'http://localhost:5000/api/auth';

async function testRegistration() {
    const timestamp = Date.now();
    const email = `test_${timestamp}@example.com`;
    const password = 'TestPassword123!';

    console.log('--- Starting Registration Regression Test ---');
    console.log(`Target: ${baseUrl}/register`);
    console.log(`Test User: ${email}`);

    // Wait for server to be ready (optional simple retry logic or just run)
    // We assume server is running.

    try {
        // 1. Attempt Registration
        const response = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
            console.log('✅ Registration Successful');
            console.log('Response:', data);
        } else {
            console.error('❌ Registration Failed');
            console.error('Status:', response.status);
            console.error('Error:', data);
            process.exit(1);
        }

        // 2. Test Duplicate Registration
        console.log('\n--- Testing Duplicate Registration (Negative Test) ---');
        const duplicateResponse = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const dupData = await duplicateResponse.json().catch(() => ({}));

        if (duplicateResponse.status === 400) {
            console.log('✅ Duplicate Registration Blocked (Expected)');
            console.log('Response:', dupData);
        } else {
            console.error('❌ Duplicate Registration Check Failed');
            console.log('Status:', duplicateResponse.status);
            console.log('Response:', dupData);
            process.exit(1);
        }

        console.log('\n✅ ALL TESTS PASSED');

    } catch (error) {
        console.error('❌ Test Execution Error:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
        console.log('Hint: Is the backend server running on port 5000? (cd backend && npm start)');
        process.exit(1);
    }
}

testRegistration();

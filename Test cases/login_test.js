// Test script for User Login
// Usage: node "Test cases/login_test.js"

const baseUrl = 'http://localhost:5001/api/auth';

async function testLogin() {
  const timestamp = Date.now();
  const email = `test_login_${timestamp}@example.com`;
  const password = 'TestLoginPass123!';
  const wrongPassword = 'WrongPassword!';

  console.log('--- Starting Login Regression Test ---');
  console.log(`Target: ${baseUrl}/login`);
  console.log(`Test User: ${email}`);

  try {
    // 0. Pre-condition: Register the user first
    console.log('\n[Step 0] Registering User...');
    const regResponse = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!regResponse.ok) {
        throw new Error(`Registration failed with status ${regResponse.status}`);
    }
    console.log('✅ User registered successfully');

    // 1. Successful Login
    console.log('\n[Step 1] Testing Successful Login...');
    const successResponse = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const successData = await successResponse.json().catch(() => ({}));

    if (successResponse.ok && successData.token) {
        console.log('✅ Login Successful');
        console.log('Token received:', successData.token ? 'YES' : 'NO');
    } else {
        console.error('❌ Login Failed (Expected Success)');
        console.error('Status:', successResponse.status);
        console.error('Response:', successData);
        process.exit(1);
    }

    // 2. Invalid Password
    console.log('\n[Step 2] Testing Invalid Password (Negative Test)...');
    const invalidPassResponse = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: wrongPassword }),
    });

    if (invalidPassResponse.status === 400 || invalidPassResponse.status === 401) {
        console.log('✅ Invalid Password Blocked (Expected)');
    } else {
        console.error('❌ Invalid Password NOT Blocked');
        console.error('Status:', invalidPassResponse.status);
        process.exit(1);
    }

    // 3. Non-existent User
    console.log('\n[Step 3] Testing Non-existent User (Negative Test)...');
    const nonExistentResponse = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `ghost_${timestamp}@example.com`, password }),
    });

    if (nonExistentResponse.status === 400 || nonExistentResponse.status === 404) {
        console.log('✅ Non-existent User Blocked (Expected)');
    } else {
        console.error('❌ Non-existent User NOT Blocked');
        console.error('Status:', nonExistentResponse.status);
        process.exit(1);
    }

    console.log('\n✅ ALL LOGIN TESTS PASSED');

  } catch (error) {
    console.error('❌ Test Execution Error:', error.message);
    if (error.cause) console.error('Cause:', error.cause);
    console.log('Hint: Is the backend server running on port 5001? (cd backend && npm start)');
    process.exit(1);
  }
}

testLogin();

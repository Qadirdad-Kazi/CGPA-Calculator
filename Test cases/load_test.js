

// Test script for Load Testing
// Usage: node "Test cases/load_test.js" [duration_in_minutes]
// Default duration is 1 minute for demonstration. Pass 10 for the full report scenario.

const baseUrl = 'http://localhost:5001/api';

// Configuration defaults
const DEFAULT_DURATION_MINUTES = 1;

// Helper to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate a random user
const generateUser = () => {
    const timestamp = Date.now();
    const rand = Math.floor(Math.random() * 100000);
    return {
        name: `LoadUser${rand}`,
        email: `load_${timestamp}_${rand}@test.com`,
        password: 'LoadTestPass123!'
    };
};

/**
 * Worker function that continuously sends requests for a given duration.
 * @param {number} workerId - ID of the worker
 * @param {number} endTime - Timestamp to stop testing
 * @param {string} type - 'general', 'auth', or 'db'
 * @param {string} [token] - Auth token for protected routes
 */
async function runWorker(workerId, endTime, type, token) {
    let requests = 0;
    let errors = 0;

    while (Date.now() < endTime) {
        try {
            let res;
            if (type === 'auth') {
                // LOAD-02: Sustained load on authentication APIs
                const user = generateUser();

                // 50% Register, 50% Login attempt (randomized)
                if (Math.random() > 0.5) {
                    res = await fetch(`${baseUrl}/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(user)
                    });
                } else {
                    // Try to login (likely fail if not registered, but stresses the API handling)
                    // Or register then login to be cleaner?
                    // To simulate high traffic checking DB, invalid logins are also valid load.
                    // But let's do a Register then Login for a valid flow sometimes.

                    // For pure load, let's just hit the endpoint.
                    res = await fetch(`${baseUrl}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(user)
                    });
                }
            } else if (type === 'db') {
                // LOAD-03: Database stability - persistent storage operations
                // Post a course then get courses
                const courseData = {
                    courseName: `DB_Test_Course_${workerId}_${requests}`,
                    creditHours: 3,
                    gpa: 3.5
                };

                // Add Course
                res = await fetch(`${baseUrl}/courses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(courseData)
                });

                // If successful, maybe fetch list to stress read?
                if (res.ok) {
                    await fetch(`${baseUrl}/courses`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
            } else {
                // LOAD-01: Normal load (General usage)
                // Mostly reads
                res = await fetch(`${baseUrl}/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            if (res && !res.ok && res.status !== 201 && res.status !== 200 && res.status !== 400 && res.status !== 401) {
                // We count 400/401 as "success" in terms of server handling load (not crashing), 
                // but for 'db' and 'general' we expect 200/201 if properly authenticated.
                // For this simple script, we track 500s or timeouts as errors.
                if (res.status >= 500) errors++;
            }
            requests++;
        } catch (e) {
            console.error(`Worker ${workerId} error:`, e.message);
            errors++;
        }

        // Slight throttle to act like a real user vs a DoS attack, 
        // though "concurrent users" implies active sessions. 
        // We'll use a small random delay 50-200ms.
        await sleep(Math.random() * 150 + 50);
    }
    return { requests, errors };
}

async function runLoadTest(scenarioName, concurrentUsers, durationMinutes, type) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Starting Scenario: ${scenarioName}`);
    console.log(`Concurrent Users: ${concurrentUsers}`);
    console.log(`Duration: ${durationMinutes} minute(s)`);
    console.log(`--------------------------------------------------`);

    // Setup Main User for Token (if needed)
    let token = '';
    if (type !== 'auth') {
        try {
            const user = generateUser();
            // Register setup user
            await fetch(`${baseUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            // Login setup user
            const res = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            const data = await res.json();
            token = data.token;
            if (!token) throw new Error('No token received');
        } catch (err) {
            console.error('Setup failed: Could not authenticate test user.', err.message);
            return;
        }
    }

    const endTime = Date.now() + (durationMinutes * 60 * 1000);
    const promises = [];

    console.log(`[${new Date().toISOString()}] Load generation started...`);

    for (let i = 0; i < concurrentUsers; i++) {
        promises.push(runWorker(i, endTime, type, token));
    }

    const results = await Promise.all(promises);

    const totalRequests = results.reduce((a, b) => a + b.requests, 0);
    const totalErrors = results.reduce((a, b) => a + b.errors, 0);
    const durationSec = durationMinutes * 60;
    const rps = (totalRequests / durationSec).toFixed(2);

    console.log(`[${new Date().toISOString()}] Test Completed.`);
    console.log(`\nSummary for ${scenarioName}:`);
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Throughput: ~${rps} req/sec`);
    console.log(`Total System Errors (500+): ${totalErrors}`);

    if (totalErrors === 0) {
        console.log(`✅ Result: PASSED`);
    } else {
        console.log(`⚠️ Result: COMPLETED WITH ERRORS`);
    }
}

async function main() {
    const args = process.argv.slice(2);
    const duration = args[0] ? parseFloat(args[0]) : DEFAULT_DURATION_MINUTES;

    console.log(`\n=== CGPA Calculator Load Test Suite ===`);
    console.log(`Target: ${baseUrl}`);
    console.log(`Global Duration: ${duration} minute(s) per scenario`);

    // LOAD-01
    await runLoadTest('LOAD-01: System performance under normal load', 50, duration, 'general');

    // LOAD-02
    await runLoadTest('LOAD-02: Sustained load on authentication APIs', 75, duration, 'auth');

    // LOAD-03
    await runLoadTest('LOAD-03: Database stability under load', 80, duration, 'db');

    console.log(`\n=== All Load Tests Finished ===`);
}

main();

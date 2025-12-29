// Test script for Spike Testing
// Usage: node "Test cases/spike_test.js"
// Description: Simulates a sudden burst of traffic to test system stability and recovery.

const baseUrl = 'http://localhost:5001/api';

// Configuration
const SPIKE_SIZE = 100; // Number of simultaneous requests during spike
const BASELINE_COUNT = 5; // Number of requests for baseline measurement

async function testSpike() {
    const timestamp = Date.now();
    const email = `test_spike_${timestamp}@example.com`;
    const password = 'TestSpikePass123!';
    let token = '';

    console.log('--- Starting Spike Test ---');
    console.log(`Target: ${baseUrl}`);
    console.log(`Spike Size: ${SPIKE_SIZE} concurrent requests`);

    try {
        // 0. Setup
        console.log('\n[Step 0] Setup: Registering Main User...');
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

        // Helper function for a single request
        const makeRequest = async (id) => {
            const start = Date.now();
            try {
                const res = await fetch(`${baseUrl}/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const duration = Date.now() - start;
                return { id, status: res.status, duration, success: res.ok };
            } catch (e) {
                return { id, status: 'error', duration: Date.now() - start, success: false, error: e.message };
            }
        };

        // 1. Establish Baseline
        console.log('\n[Step 1] Establishing Baseline Performance...');
        let baselineTotalTime = 0;
        for (let i = 0; i < BASELINE_COUNT; i++) {
            const result = await makeRequest(`base-${i}`);
            baselineTotalTime += result.duration;
        }
        const avgBaseline = baselineTotalTime / BASELINE_COUNT;
        console.log(`✅ Average Baseline Response Time: ${avgBaseline.toFixed(2)}ms`);


        // 2. The Spike
        console.log('\n[Step 2] unleashing the SPIKE! 🚀...');
        const spikePromises = [];
        const spikeStartTime = Date.now();

        for (let i = 0; i < SPIKE_SIZE; i++) {
            spikePromises.push(makeRequest(`spike-${i}`));
        }

        const spikeResults = await Promise.all(spikePromises);
        const spikeDuration = Date.now() - spikeStartTime;

        // Analyze Spike
        const successCount = spikeResults.filter(r => r.success).length;
        const failCount = spikeResults.length - successCount;
        const maxTime = Math.max(...spikeResults.map(r => r.duration));
        const minTime = Math.min(...spikeResults.map(r => r.duration));
        const avgSpikeTime = spikeResults.reduce((a, b) => a + b.duration, 0) / spikeResults.length;

        console.log(`\n--- Spike Analysis ---`);
        console.log(`Total Requests: ${SPIKE_SIZE}`);
        console.log(`Successful: ${successCount}`);
        console.log(`Failed: ${failCount}`);
        console.log(`Total Spike Duration: ${spikeDuration}ms`);
        console.log(`Avg Request Time: ${avgSpikeTime.toFixed(2)}ms`);
        console.log(`Max Request Time: ${maxTime}ms`);


        // 3. Recovery / Post-Spike Health
        console.log('\n[Step 3] Checking Recovery...');
        // Wait a small moment to let event loop clear if needed, though typically spike testing checks immediate recovery
        await new Promise(resolve => setTimeout(resolve, 1000));

        let recoveryTotalTime = 0;
        let recoveryFailures = 0;
        for (let i = 0; i < BASELINE_COUNT; i++) {
            const result = await makeRequest(`recovery-${i}`);
            recoveryTotalTime += result.duration;
            if (!result.success) recoveryFailures++;
        }
        const avgRecovery = recoveryTotalTime / BASELINE_COUNT;

        console.log(`Recovery Response Time: ${avgRecovery.toFixed(2)}ms`);

        if (recoveryFailures > 0) {
            console.error(`❌ System failed to recover fully. ${recoveryFailures} requests failed post-spike.`);
        } else if (avgRecovery > avgBaseline * 2) {
            console.warn(`⚠️ System recovered but is slower. (Baseline: ${avgBaseline.toFixed(2)}ms vs Recovery: ${avgRecovery.toFixed(2)}ms)`);
        } else {
            console.log(`✅ System recovered successfully!`);
        }

        // Final Verdict
        if (failCount === 0 && recoveryFailures === 0) {
            console.log('\n✅ TEST RESULT: PASSED (System handled spike without errors)');
        } else {
            console.log('\n⚠️ TEST RESULT: WARNING/FAILED (Errors occurred during spike or recovery)');
        }

    } catch (error) {
        console.error('❌ Test Execution Error:', error.message);
        process.exit(1);
    }
}

testSpike();


//node "Test cases/run_all_tests.js"
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const TEST_DIR = __dirname;
const NODE_CMD = 'node';

// List of test files to run
// Order matters if there are dependencies, but these seem mostly independent 
// (though some create data that others might see, but usually they use unique IDs or clean up/ignore)
const testFiles = [
    { name: 'Unit / Whitebox Test', file: 'whitebox_test.js' },
    { name: 'Registration Module', file: 'registration_test.js' },
    { name: 'Login Module', file: 'login_test.js' },
    { name: 'Add Course Module', file: 'add_course_test.js' },
    { name: 'Get Courses Module', file: 'get_courses_test.js' },
    { name: 'Delete Course Module', file: 'delete_course_test.js' },
    { name: 'Spike Performance Test', file: 'spike_test.js' },
    { name: 'Load Performance Test', file: 'load_test.js', args: ['0.2'] } // Run for 0.2 minutes (12s) to be quick
];

// Statistics
const results = [];

async function runTest(test) {
    return new Promise((resolve) => {
        console.log(`\n==================================================`);
        console.log(`Running: ${test.name} (${test.file})`);
        console.log(`==================================================`);

        const start = Date.now();
        const args = test.args || [];

        const child = spawn(NODE_CMD, [path.join(TEST_DIR, test.file), ...args], {
            cwd: path.join(TEST_DIR, '..'), // Run from root or parent dir if needed? 
            // The individual scripts usually expect to be run from root or handle their own logic. 
            // Looking at previous `node "Test cases/..."` calls, CWD was root.
            env: { ...process.env } // Pass current env
        });

        // Pipe output to console so user sees progress
        child.stdout.on('data', (data) => process.stdout.write(data));
        child.stderr.on('data', (data) => process.stderr.write(data));

        child.on('close', (code) => {
            const duration = ((Date.now() - start) / 1000).toFixed(2);
            const status = code === 0 ? 'PASSED' : 'FAILED';

            results.push({
                name: test.name,
                file: test.file,
                status: status,
                duration: duration + 's'
            });

            console.log(`\n>> Result: ${status} (Time: ${duration}s)`);
            resolve();
        });

        child.on('error', (err) => {
            console.error(`Failed to start test ${test.file}:`, err);
            results.push({
                name: test.name,
                file: test.file,
                status: 'ERROR',
                duration: '0s'
            });
            resolve();
        });
    });
}

async function runAll() {
    console.log(`\n🚀 Starting Automated Test Runner...`);
    console.log(`Found ${testFiles.length} test suites.`);

    for (const test of testFiles) {
        await runTest(test);
    }

    printSummary();
}

function printSummary() {
    console.log(`\n\n`);
    console.log(`##################################################`);
    console.log(`               TEST EXECUTION SUMMARY             `);
    console.log(`##################################################`);

    // Header
    console.log(`| %-25s | %-10s | %-10s |`, 'Test Suite', 'Status', 'Duration');
    console.log(`|${'-'.repeat(27)}|${'-'.repeat(12)}|${'-'.repeat(12)}|`);

    let passed = 0;
    let failed = 0;

    results.forEach(r => {
        const symbol = r.status === 'PASSED' ? '✅' : '❌';
        if (r.status === 'PASSED') passed++;
        else failed++;

        // Manual padding for simple table
        const padName = r.name.padEnd(25);
        const padStatus = (symbol + ' ' + r.status).padEnd(10); // slightly inaccurate visual length vs char length due to emoji
        // simpler:
        console.log(`${symbol} ${r.name.padEnd(30)} : ${r.status.padEnd(8)} (${r.duration})`);
    });

    console.log(`--------------------------------------------------`);
    console.log(`Total Tests: ${results.length}`);
    console.log(`Passed:      ${passed}`);
    console.log(`Failed:      ${failed}`);
    console.log(`##################################################`);

    if (failed > 0) {
        console.log(`\n⚠️  SOME TESTS FAILED.`);
        process.exit(1);
    } else {
        console.log(`\n✅  ALL TESTS PASSED SUCCESSFULLY.`);
        process.exit(0);
    }
}

// Start
runAll();

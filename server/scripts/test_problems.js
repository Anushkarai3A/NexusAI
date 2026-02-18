const BASE_URL = 'http://localhost:5000/api/problems';

async function testProblems() {
    try {
        console.log('Fetching Problems...');
        const res = await fetch(BASE_URL);
        const problems = await res.json();
        console.log('Problems:', problems);

        if (problems.length === 0) return;

        const problemId = problems[0]._id;
        console.log(`\nFetching Problem Detail for ${problemId}...`);
        const detailRes = await fetch(`${BASE_URL}/${problemId}`);
        const problem = await detailRes.json();
        console.log('Problem Detail:', problem.title);

        console.log('\nRunning Code...');
        const code = `
      console.log("Hello from Piston");
      console.log("Input was: " + 9); 
    `;
        // Note: The Two Sum problem expects output "[0,1]" for input "[2,7,11,15]\n9"
        // My code above won't pass, but I just want to see if it runs.

        // Actually let's try to pass the Two Sum if possible, or just check execution.
        // The Input is "[2,7,11,15]\n9".
        // Piston execution model: we need to handle stdin.
        // In JS, reading stdin is a bit verbose.
        // Let's just print something to stdout and see if we get it back.

        const runRes = await fetch(`${BASE_URL}/run`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                problemId,
                code: 'console.log("test output")',
                language: 'javascript'
            })
        });

        const runData = await runRes.json();
        console.log('Run Result:', runData);

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testProblems();

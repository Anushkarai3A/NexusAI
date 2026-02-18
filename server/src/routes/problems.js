import express from 'express';
import Problem from '../models/Problem.js';
import axios from 'axios';

const router = express.Router();

// Get all problems
router.get('/', async (req, res) => {
    try {
        const problems = await Problem.find({});
        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single problem
router.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(404).json({ error: 'Problem not found' });
        res.json(problem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Run code (Generic Execution for ALL problems)
router.post('/run', async (req, res) => {
    const { code, language = 'javascript', problemId } = req.body;

    try {
        console.log('Received code execution request:', { problemId, language, codeLength: code?.length });

        const problem = await Problem.findById(problemId);
        if (!problem) {
            console.error('Problem not found:', problemId);
            return res.status(404).json({ error: 'Problem not found' });
        }

        if (language !== 'javascript') {
            return res.status(400).json({
                error: 'Only JavaScript is supported for code execution',
                message: 'Please use JavaScript for your solution'
            });
        }

        // Extract function or class name from starter code
        const starterCode = problem.starterCode || '';
        const funcMatch = starterCode.match(/function\s+(\w+)\s*\(/);
        const classMatch = starterCode.match(/class\s+(\w+)/);

        let funcName = null;
        let className = null;
        let classMethod = null;

        if (classMatch) {
            className = classMatch[1];
            // Find the non-constructor method name
            const methodMatches = [...starterCode.matchAll(/(\w+)\s*\([^)]*\)\s*\{/g)];
            for (const m of methodMatches) {
                if (m[1] !== 'constructor' && m[1] !== className) {
                    classMethod = m[1];
                    break;
                }
            }
        } else if (funcMatch) {
            funcName = funcMatch[1];
        } else {
            return res.status(400).json({ error: 'Could not determine function name from starter code' });
        }

        // Extract parameter names from the function signature
        let paramNames = [];
        if (funcName) {
            const paramMatch = starterCode.match(/function\s+\w+\s*\(([^)]*)\)/);
            if (paramMatch && paramMatch[1].trim()) {
                paramNames = paramMatch[1].split(',').map(p => p.trim());
            }
        }

        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const fs = await import('fs');
        const path = await import('path');
        const os = await import('os');
        const execAsync = promisify(exec);
        const writeFileAsync = promisify(fs.writeFile);
        const unlinkAsync = promisify(fs.unlink);

        const results = [];
        let allPassed = true;

        for (let i = 0; i < problem.testCases.length; i++) {
            const testCase = problem.testCases[i];
            const testInput = testCase.input || '';

            // Split input by newlines - each line is a separate argument
            const inputArgs = testInput.split('\\n').map(arg => arg.trim()).filter(arg => arg !== '');

            let wrappedCode;

            if (className) {
                // Class-based problem (e.g., NumArray, KthLargest, MedianFinder, StockSpanner)
                const constructorArgs = inputArgs.length > 0 ? inputArgs.slice(0, -1).join(', ') : '';
                const methodArg = inputArgs.length > 0 ? inputArgs[inputArgs.length - 1] : '';

                if (className === 'StockSpanner') {
                    // Special handling for StockSpanner - call next() for each price
                    wrappedCode = `${code}

// Test execution
const obj = new ${className}();
const prices = ${inputArgs[0]};
const results = prices.map(p => obj.${classMethod || 'next'}(p));
console.log(JSON.stringify(results));
`;
                } else if (className === 'MedianFinder') {
                    wrappedCode = `${code}

// Test execution
const obj = new ${className}();
const nums = ${inputArgs[0]};
nums.forEach(n => obj.addNum(n));
const result = obj.findMedian();
console.log(JSON.stringify(result));
`;
                } else if (className === 'KthLargest') {
                    wrappedCode = `${code}

// Test execution
const k = ${inputArgs[0]};
const nums = ${inputArgs[1]};
const obj = new ${className}(k, nums);
const val = ${inputArgs[2] || '0'};
const result = obj.add(val);
console.log(JSON.stringify(result));
`;
                } else {
                    // Generic class: construct with first args, call method with last arg
                    wrappedCode = `${code}

// Test execution
const obj = new ${className}(${constructorArgs});
const result = obj.${classMethod}(${methodArg});
console.log(JSON.stringify(result));
`;
                }
            } else {
                // Function-based problem - store args in variables first
                // so in-place modifications are captured
                const argDeclarations = inputArgs.map((arg, idx) => `const __arg${idx}__ = ${arg};`).join('\n');
                const argRefs = inputArgs.map((_, idx) => `__arg${idx}__`).join(', ');

                wrappedCode = `${code}

// Test execution - store args in variables so in-place modifications are tracked
${argDeclarations}
const __result__ = ${funcName}(${argRefs});
// Handle void functions that modify input in place
if (__result__ === undefined) {
    console.log(JSON.stringify(__arg0__));
} else {
    console.log(JSON.stringify(__result__));
}
`;
            }

            const tempFile = path.join(os.tmpdir(), `code_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.js`);

            try {
                await writeFileAsync(tempFile, wrappedCode);

                const { stdout, stderr } = await execAsync(`node "${tempFile}"`, {
                    timeout: 10000,
                    maxBuffer: 1024 * 1024
                });

                await unlinkAsync(tempFile).catch(() => { });

                const output = stdout.trim();
                const expected = testCase.output.trim();

                // Normalize comparison: handle JSON formatting differences
                let passed = false;
                try {
                    const parsedOutput = JSON.parse(output);
                    const parsedExpected = JSON.parse(expected);
                    passed = JSON.stringify(parsedOutput) === JSON.stringify(parsedExpected);
                } catch {
                    // Fall back to string comparison
                    passed = output === expected;
                }

                if (!passed) allPassed = false;

                console.log(`=== Test Case ${i + 1} ===`);
                console.log('Function:', funcName || className);
                console.log('Input:', testInput);
                console.log('Expected:', expected);
                console.log('Actual:', output);
                console.log('Passed:', passed);

                results.push({
                    testCase: i + 1,
                    input: testInput,
                    expected,
                    actual: output,
                    passed,
                    stderr: stderr || ''
                });

            } catch (execError) {
                await unlinkAsync(tempFile).catch(() => { });
                console.error(`Test Case ${i + 1} execution error:`, execError.message);

                allPassed = false;
                results.push({
                    testCase: i + 1,
                    input: testInput,
                    expected: testCase.output,
                    actual: '',
                    passed: false,
                    stderr: execError.stderr || execError.message || 'Runtime error'
                });
            }
        }

        res.json({
            passed: allPassed,
            results,
            summary: `${results.filter(r => r.passed).length}/${results.length} test cases passed`
        });

    } catch (error) {
        console.error('Code Execution Error:', error.message);
        res.status(500).json({
            error: 'Failed to execute code',
            message: error.message,
            details: 'Internal server error'
        });
    }
});

export default router;

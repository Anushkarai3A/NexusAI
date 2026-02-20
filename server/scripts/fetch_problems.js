
import axios from 'axios';
import fs from 'fs';

const fetchProblems = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/problems');
        const problems = res.data;

        console.log(`Fetched ${problems.length} problems.`);

        const prefixSumEasy = problems.filter(p => p.category.trim() === 'Prefix Sum' && p.difficulty === 'Easy');
        console.log(`Prefix Sum + Easy count (exact match): ${prefixSumEasy.length}`);

        if (prefixSumEasy.length === 0) {
            console.log('No exact matches found. Checking variants...');
            const looseParams = problems.filter(p => p.category.includes('Prefix') && p.difficulty === 'Easy');
            console.log('Loose match (includes Prefix):', looseParams.map(p => `"${p.category}"`));
        } else {
            console.log('First match category:', `"${prefixSumEasy[0].category}"`);
            console.log('First match difficulty:', `"${prefixSumEasy[0].difficulty}"`);
        }

        fs.writeFileSync('problems_dump.json', JSON.stringify(problems, null, 2));
    } catch (error) {
        console.error('Error fetching problems:', error.message);
    }
};

fetchProblems();

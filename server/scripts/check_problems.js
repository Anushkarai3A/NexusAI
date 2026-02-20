
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../src/models/Problem.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from server root
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('Connecting to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        const problems = await Problem.find({});
        console.log(`Found ${problems.length} problems.`);

        const breakdown = problems.reduce((acc, p) => {
            const key = `${p.category} | ${p.difficulty}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        console.log('\n📊 Breakdown by Category | Difficulty:');
        Object.entries(breakdown).sort().forEach(([key, count]) => {
            console.log(`   ${key}: ${count}`);
        });

        const prefixSumEasy = problems.filter(p => p.category === 'Prefix Sum' && p.difficulty === 'Easy');
        console.log(`\n🔍 Prefix Sum + Easy count: ${prefixSumEasy.length}`);
        if (prefixSumEasy.length > 0) {
            console.log('Sample:', prefixSumEasy[0].title);
        }

        mongoose.disconnect();
    })
    .catch(err => {
        console.error('❌ Error:', err);
        process.exit(1);
    });

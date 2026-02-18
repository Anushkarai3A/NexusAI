import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true },
    isHidden: { type: Boolean, default: false }
});

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    testCases: [testCaseSchema],
    starterCode: { type: String, default: '// Write your code here' },
}, { timestamps: true });

export default mongoose.model('Problem', problemSchema);

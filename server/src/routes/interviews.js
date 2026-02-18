import express from 'express';
import InterviewSession from '../models/InterviewSession.js';
import Problem from '../models/Problem.js';

const router = express.Router();

// Get all interview sessions (for dashboard)
router.get('/', async (req, res) => {
    try {
        const sessions = await InterviewSession.find()
            .populate('candidate', 'username email avatar')
            .populate('problem', 'title');
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit interview result
router.post('/submit', async (req, res) => {
    const { candidateId, problemId, code, outputValue } = req.body;

    try {
        // AI Logic Simulation (In reality, this would call Gemini/OpenAI)
        const passed = outputValue.includes('✅');
        const totalScore = passed ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 40;

        const aiAnalysis = {
            total: totalScore,
            professionalism: Math.floor(Math.random() * 30) + 70,
            technical: passed ? 90 : 50,
            communication: Math.floor(Math.random() * 30) + 70,
            closing: Math.floor(Math.random() * 30) + 70,
            feedback: passed
                ? "Excellent problem-solving skills shown. Code is clean and tests passed."
                : "The logic needs improvement. Focus on edge cases and debugging."
        };

        const session = new InterviewSession({
            candidate: candidateId,
            problem: problemId,
            code: code,
            score: {
                total: aiAnalysis.total,
                professionalism: aiAnalysis.professionalism,
                technical: aiAnalysis.technical,
                communication: aiAnalysis.communication,
                closing: aiAnalysis.closing
            },
            aiFeedback: aiAnalysis.feedback,
            status: totalScore >= 75 ? 'Approved' : 'Pending'
        });

        await session.save();
        res.status(201).json(session);
    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ error: 'Failed to submit interview' });
    }
});

// Update interview status (Shortlist/Reject/Hire)
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        const session = await InterviewSession.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

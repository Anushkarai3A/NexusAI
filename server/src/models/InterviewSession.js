import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    code: { type: String, required: true },
    status: { type: String, enum: ['Completed', 'Pending', 'Rejected', 'Approved'], default: 'Pending' },
    score: {
        total: { type: Number, default: 0 },
        professionalism: { type: Number, default: 0 },
        technical: { type: Number, default: 0 },
        communication: { type: Number, default: 0 },
        closing: { type: Number, default: 0 }
    },
    aiFeedback: { type: String },
    videoUrl: { type: String }, // Placeholder for storage
    feedbackItems: [{
        interviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number },
        comment: { type: String }
    }]
}, { timestamps: true });

export default mongoose.model('InterviewSession', interviewSessionSchema);

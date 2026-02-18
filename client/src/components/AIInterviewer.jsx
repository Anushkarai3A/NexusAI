import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic } from 'lucide-react';

const AIInterviewer = ({ problem, onUpdateStatus, onUpdateScores }) => {
    const [questionNumber, setQuestionNumber] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([]);
    const [aiStatus, setAiStatus] = useState('Initializing...');
    const recognitionRef = useRef(null);
    const [currentTranscript, setCurrentTranscript] = useState('');
    const accumulatedTranscriptRef = useRef('');
    const messagesEndRef = useRef(null);

    // Internal state for scores
    const [scores, setScores] = useState({
        professionalism: 0,
        technical: 0,
        communication: 0,
        closing: 0
    });

    const scoresRef = useRef(scores);

    const updateScores = useCallback((newScores) => {
        const updated = { ...scoresRef.current, ...newScores };
        scoresRef.current = updated;
        setScores(updated);
        if (onUpdateScores) onUpdateScores(updated);
    }, [onUpdateScores]);

    const speak = useCallback((text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);

        setMessages(prev => [...prev, { role: 'ai', text, timestamp: Date.now() }]);
    }, []);

    const analyzeResponse = (text) => {
        const length = text.split(' ').length;
        let bonus = 0;

        if (length > 20) bonus += 15;
        if (length > 5) bonus += 10;

        const keywords = {
            professionalism: ['team', 'collaboration', 'organized', 'management', 'growth', 'interested', 'strength', 'weakness', 'background', 'opportunity'],
            technical: ['complexity', 'algorithm', 'optimization', 'efficiency', 'space', 'time', 'array', 'string', 'pointer', 'recursion', 'iteration'],
            behavioral: ['pressure', 'conflict', 'leadership', 'learned', 'resolve', 'improvement', 'deadline', 'priority', 'feedback', 'criticism']
        };

        const foundKeywords = Object.keys(keywords).filter(k =>
            keywords[k].some(word => text.toLowerCase().includes(word))
        );

        const newScores = {};
        if (foundKeywords.length > 0) bonus += 10;

        // Distribute scores based on question number
        if (questionNumber <= 2) {
            newScores.professionalism = Math.min(100, (scoresRef.current.professionalism + 15 + bonus));
        } else if (questionNumber === 3) {
            newScores.technical = Math.min(100, (scoresRef.current.technical + 20 + bonus));
            newScores.closing = Math.min(100, (scoresRef.current.closing + 10));
        } else if (questionNumber === 4) {
            newScores.communication = Math.min(100, (scoresRef.current.communication + 20 + bonus));
        }

        updateScores(newScores);
    };

    const askNextQuestion = useCallback(() => {
        const nextQ = questionNumber + 1;
        setQuestionNumber(nextQ);

        setTimeout(() => {
            switch (nextQ) {
                case 1:
                    speak("Great. Let's start with some general questions. Tell me about yourself and your background.");
                    setAiStatus('Conversation: Soft Skills');
                    break;
                case 2:
                    speak("Why are you interested in this position?");
                    break;
                case 3:
                    speak(`Now, let's look at the technical challenge. Can you explain your initial thoughts on the ${problem.title} problem?`);
                    setAiStatus('Conversation: Technical');
                    break;
                case 4:
                    speak("Tell me about a time you worked effectively under pressure.");
                    setAiStatus('Conversation: Behavioral');
                    break;
                case 5:
                    speak("Thank you for your time today. I've gathered enough information for the assessment. You can proceed to the coding challenge.");
                    setAiStatus('Interview Complete');
                    if (onUpdateStatus) onUpdateStatus('Interview Complete');
                    break;
                default:
                    break;
            }
        }, 1000);
    }, [questionNumber, problem.title, speak, onUpdateStatus]);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;

        recognition.onstart = () => {
            setIsListening(true);
            setCurrentTranscript('');
            accumulatedTranscriptRef.current = '';
            setAiStatus('Listening to you...');
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    accumulatedTranscriptRef.current += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            setCurrentTranscript(accumulatedTranscriptRef.current + interimTranscript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech' || event.error === 'aborted') {
                // Ignore these errors and keep listening
                return;
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            // Auto-restart if we're still supposed to be listening
            if (recognitionRef.current && isListening) {
                try {
                    recognitionRef.current.start();
                } catch (e) {
                    console.error('Failed to restart recognition:', e);
                }
            }
        };

        recognition.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);

        const finalText = accumulatedTranscriptRef.current.trim();
        if (finalText) {
            setMessages(prev => [...prev, { role: 'user', text: finalText, timestamp: Date.now() }]);
            analyzeResponse(finalText);
            setCurrentTranscript('');
            accumulatedTranscriptRef.current = '';

            askNextQuestion();
        }
    };

    useEffect(() => {
        const initialGreeting = `Hello! I'm your AI Interviewer. We'll go through some general questions before diving into the technical task. Are you ready to begin?`;
        speak(initialGreeting);
        setAiStatus('Greeting...');
    }, [speak]);

    // Auto-scroll chat container when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            const container = messagesEndRef.current.parentElement;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }, [messages]);

    return (
        <div className="bg-[#111827] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-full flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[80px] -mr-16 -mt-16" />

            <div className="flex items-center justify-between relative z-10 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className={`w-4 h-4 rounded-full ${isSpeaking ? 'bg-emerald-500 animate-ping' : 'bg-gray-700'}`} />
                        <div className={`absolute inset-0 w-4 h-4 rounded-full ${isSpeaking ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                    </div>
                    <div>
                        <h3 className="font-black text-white text-base tracking-tighter uppercase">AI Interviewer</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{aiStatus}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2 relative z-10 min-h-0 max-h-[500px]">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-[85%] p-4 rounded-3xl text-xs leading-relaxed shadow-sm ${m.role === 'ai'
                            ? 'bg-gray-800/50 text-gray-200 rounded-tl-sm border border-white/5'
                            : 'bg-emerald-500 text-white font-medium rounded-tr-sm shadow-emerald-500/10'
                            }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Live Transcript Preview */}
            {isListening && currentTranscript && (
                <div className="relative z-10 p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex-shrink-0">
                    <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mb-1">Live Transcript</p>
                    <p className="text-xs text-gray-300 italic">{currentTranscript}</p>
                </div>
            )}

            <div className="flex flex-col gap-4 relative z-10 flex-shrink-0">
                <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isSpeaking || questionNumber >= 5}
                    className={`w-full py-5 rounded-[1.5rem] font-black text-xs transition-all flex items-center justify-center gap-3 shadow-xl ${isListening
                        ? 'bg-rose-500 text-white hover:bg-rose-600 active:scale-95 shadow-rose-500/20'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 shadow-emerald-500/20'
                        }`}
                >
                    {isListening ? (
                        <>
                            <span className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                            </span>
                            Stop & Submit Answer
                        </>
                    ) : (
                        <>
                            <Mic size={20} />
                            Start Speaking
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AIInterviewer;

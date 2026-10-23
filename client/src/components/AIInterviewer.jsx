import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic } from 'lucide-react';

const AIInterviewer = ({ problem, onUpdateStatus, onUpdateScores }) => {
    const [questionNumber, setQuestionNumber] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([]);
    const [aiStatus, setAiStatus] = useState('Initializing...');
    const [currentTranscript, setCurrentTranscript] = useState('');

    const recognitionRef = useRef(null);
    const shouldListenRef = useRef(false);
    const accumulatedTranscriptRef = useRef('');
    const interimTranscriptRef = useRef('');
    const submittedRef = useRef(false);
    const messagesEndRef = useRef(null);
    const questionNumberRef = useRef(0);

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
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            utterance.rate = 1.05;
            window.speechSynthesis.speak(utterance);
        }

        setMessages(prev => [
            ...prev,
            { role: 'ai', text, timestamp: Date.now() }
        ]);
    }, []);

    const analyzeResponse = useCallback((text, currentQuestion) => {
        const length = text.split(/\s+/).filter(Boolean).length;
        let bonus = 0;

        if (length > 20) bonus += 15;
        if (length > 5) bonus += 10;

        const keywords = {
            professionalism: [
                'team', 'collaboration', 'organized', 'management',
                'growth', 'interested', 'strength', 'weakness',
                'background', 'opportunity'
            ],
            technical: [
                'complexity', 'algorithm', 'optimization',
                'efficiency', 'space', 'time', 'array',
                'string', 'pointer', 'recursion', 'iteration'
            ],
            behavioral: [
                'pressure', 'conflict', 'leadership', 'learned',
                'resolve', 'improvement', 'deadline', 'priority',
                'feedback', 'criticism'
            ]
        };

        const lowerText = text.toLowerCase();

        const foundKeywords = Object.keys(keywords).filter(key =>
            keywords[key].some(word => lowerText.includes(word))
        );

        if (foundKeywords.length > 0) bonus += 10;

        const newScores = {};

        if (currentQuestion <= 2) {
            newScores.professionalism = Math.min(
                100,
                scoresRef.current.professionalism + 15 + bonus
            );
        } else if (currentQuestion === 3) {
            newScores.technical = Math.min(
                100,
                scoresRef.current.technical + 20 + bonus
            );

            newScores.closing = Math.min(
                100,
                scoresRef.current.closing + 10
            );
        } else if (currentQuestion === 4) {
            newScores.communication = Math.min(
                100,
                scoresRef.current.communication + 20 + bonus
            );
        }

        updateScores(newScores);
    }, [updateScores]);

    const askNextQuestion = useCallback(() => {
        const nextQ = questionNumberRef.current + 1;

        questionNumberRef.current = nextQ;
        setQuestionNumber(nextQ);

        const questions = {
            1: {
                text: "Great. Let's start with some general questions. Tell me about yourself and your background.",
                status: 'Conversation: Soft Skills'
            },
            2: {
                text: 'Why are you interested in this position?'
            },
            3: {
                text: `Now, let's look at the technical challenge. Can you explain your initial thoughts on the ${problem.title} problem?`,
                status: 'Conversation: Technical'
            },
            4: {
                text: 'Tell me about a time you worked effectively under pressure.',
                status: 'Conversation: Behavioral'
            },
            5: {
                text: "Thank you for your time today. I've gathered enough information for the assessment. You can proceed to the coding challenge.",
                status: 'Interview Complete'
            }
        };

        const next = questions[nextQ];

        if (!next) return;

        setTimeout(() => {
            if (next.status) setAiStatus(next.status);

            if (nextQ === 5 && onUpdateStatus) {
                onUpdateStatus('Interview Complete');
            }

            speak(next.text);
        }, 500);
    }, [problem.title, speak, onUpdateStatus]);

    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert(
                'Speech recognition is not supported in this browser. Please use Google Chrome.'
            );
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }

        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognitionRef.current = recognition;
        shouldListenRef.current = true;
        submittedRef.current = false;

        accumulatedTranscriptRef.current = '';
        interimTranscriptRef.current = '';
        setCurrentTranscript('');

        recognition.onstart = () => {
            setIsListening(true);
            setAiStatus('Listening to you...');
        };

        recognition.onresult = (event) => {
            let interim = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                const transcript = result[0].transcript;

                if (result.isFinal) {
                    accumulatedTranscriptRef.current += transcript + ' ';
                } else {
                    interim += transcript;
                }
            }

            interimTranscriptRef.current = interim;

            setCurrentTranscript(
                (
                    accumulatedTranscriptRef.current +
                    interimTranscriptRef.current
                ).trim()
            );
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);

            if (
                event.error === 'not-allowed' ||
                event.error === 'service-not-allowed'
            ) {
                shouldListenRef.current = false;
                setIsListening(false);
                setAiStatus('Microphone permission denied');
                return;
            }

            if (event.error !== 'no-speech' && event.error !== 'aborted') {
                setAiStatus(`Speech recognition error: ${event.error}`);
            }
        };

        recognition.onend = () => {
            if (
                shouldListenRef.current &&
                recognitionRef.current === recognition
            ) {
                try {
                    recognition.start();
                } catch (error) {
                    console.warn('Recognition restart skipped:', error.message);
                }
            } else {
                setIsListening(false);
            }
        };

        try {
            recognition.start();
        } catch (error) {
            shouldListenRef.current = false;
            recognitionRef.current = null;
            setIsListening(false);
            setAiStatus('Could not start microphone');

            console.error('Could not start speech recognition:', error);
        }
    };

    const stopListening = () => {
        if (submittedRef.current) return;

        submittedRef.current = true;
        shouldListenRef.current = false;

        const recognition = recognitionRef.current;
        recognitionRef.current = null;

        if (recognition) {
            recognition.onend = null;

            try {
                recognition.stop();
            } catch (error) {
                console.warn('Recognition already stopped:', error.message);
            }
        }

        setIsListening(false);

        const finalText = (
            accumulatedTranscriptRef.current +
            ' ' +
            interimTranscriptRef.current
        ).trim();

        accumulatedTranscriptRef.current = '';
        interimTranscriptRef.current = '';
        setCurrentTranscript('');

        if (!finalText) {
            submittedRef.current = false;
            setAiStatus('No speech detected. Please try again.');
            return;
        }

        const answeredQuestion = questionNumberRef.current;

        setMessages(prev => [
            ...prev,
            {
                role: 'user',
                text: finalText,
                timestamp: Date.now()
            }
        ]);

        analyzeResponse(finalText, answeredQuestion);
        setAiStatus('Answer submitted');

        askNextQuestion();
    };

    useEffect(() => {
        const initialGreeting =
            "Hello! I'm your AI Interviewer. We'll go through some general questions before diving into the technical task. Are you ready to begin?";

        speak(initialGreeting);
        setAiStatus('Greeting...');

        return () => {
            shouldListenRef.current = false;

            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort();
                } catch {
                    // Recognition may already be stopped.
                }
            }

            window.speechSynthesis?.cancel();
        };
    }, [speak]);

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
                        <h3 className="font-black text-white text-base tracking-tighter uppercase">
                            AI Interviewer
                        </h3>

                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            {aiStatus}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2 relative z-10 min-h-0 max-h-[500px]">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}
                    >
                        <div
                            className={`max-w-[85%] p-4 rounded-3xl text-xs leading-relaxed shadow-sm ${
                                message.role === 'ai'
                                    ? 'bg-gray-800/50 text-gray-200 rounded-tl-sm border border-white/5'
                                    : 'bg-emerald-500 text-white font-medium rounded-tr-sm shadow-emerald-500/10'
                            }`}
                        >
                            {message.text}
                        </div>
                    </div>
                ))}

                <div ref={messagesEndRef} />
            </div>

            {isListening && currentTranscript && (
                <div className="relative z-10 p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex-shrink-0">
                    <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mb-1">
                        Live Transcript
                    </p>

                    <p className="text-xs text-gray-300 italic">
                        {currentTranscript}
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-4 relative z-10 flex-shrink-0">
                <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={questionNumber >= 5}
                    className={`w-full py-5 rounded-[1.5rem] font-black text-xs transition-all flex items-center justify-center gap-3 shadow-xl ${
                        isListening
                            ? 'bg-rose-500 text-white hover:bg-rose-600 active:scale-95 shadow-rose-500/20'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 shadow-emerald-500/20'
                    }`}
                >
                    {isListening ? (
                        <>
                            <span className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
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


import React, { useRef, useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Webcam from 'react-webcam';
import * as faceMesh from '@mediapipe/face_mesh';
import * as camUtils from '@mediapipe/camera_utils';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const ProctoringOverlay = ({ onViolation }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [model, setModel] = useState(null);
    const [isProctoring, setIsProctoring] = useState(false);
    const [violations, setViolations] = useState([]);
    const [status, setStatus] = useState('Initializing Security...');

    // Load COCO-SSD for object detection (phones, people)
    useEffect(() => {
        const loadModel = async () => {
            await tf.ready();
            const loadedModel = await cocoSsd.load();
            setModel(loadedModel);
            setStatus('Security Active');
            setIsProctoring(true);
        };
        loadModel();
    }, []);

    useEffect(() => {
        if (!isProctoring || !model) return;

        const faceMeshModel = new faceMesh.FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMeshModel.setOptions({
            maxNumFaces: 2,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        faceMeshModel.onResults((results) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Multiple Faces Detection
            if (results.multiFaceLandmarks.length > 1) {
                addViolation('Malpractice: Multiple People Detected');
            }

            // 2. Iris Tracking (Gaze Detection)
            if (results.multiFaceLandmarks.length > 0) {
                const landmarks = results.multiFaceLandmarks[0];
                const leftIris = landmarks[468];

                // Sensitivity check for looking away
                if (leftIris.x < 0.25 || leftIris.x > 0.75 || leftIris.y < 0.25 || leftIris.y > 0.75) {
                    addViolation('Malpractice: Looking Away from Screen');
                }
            } else {
                addViolation('Malpractice: Face Not Detected');
            }
        });

        const detectObjects = async () => {
            if (webcamRef.current && webcamRef.current.video.readyState === 4) {
                const video = webcamRef.current.video;
                const predictions = await model.detect(video);

                predictions.forEach(p => {
                    if (p.class === 'cell phone') {
                        addViolation('Prohibited Item (Phone) Detected');
                    }
                });
            }
            if (isProctoring) {
                requestAnimationFrame(detectObjects);
            }
        };

        if (webcamRef.current && webcamRef.current.video) {
            const camera = new camUtils.Camera(webcamRef.current.video, {
                onFrame: async () => {
                    await faceMeshModel.send({ image: webcamRef.current.video });
                },
                width: 640,
                height: 480,
            });
            camera.start();
            detectObjects();
        }

        return () => {
            faceMeshModel.close();
            setIsProctoring(false);
        };
    }, [isProctoring, model]);

    const addViolation = (type) => {
        const lastViolation = violations[violations.length - 1];
        if (lastViolation?.type === type && Date.now() - lastViolation.timestamp < 3000) return;

        const newViolation = { type, timestamp: Date.now() };
        setViolations(prev => [...prev.slice(-4), newViolation]);
        onViolation(newViolation);
    };

    return (
        <div className="fixed bottom-6 right-6 w-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-500/20 bg-black z-40 group transition-all duration-500 hover:w-80">
            <div className="relative aspect-video">
                <Webcam
                    ref={webcamRef}
                    muted
                    className="w-full h-full object-cover grayscale contrast-125"
                />
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    width={640}
                    height={480}
                />

                {/* Security Status Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${violations.length > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
                        {status}
                    </span>
                </div>

                {/* Violations Feed */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    {violations.map((v, i) => (
                        <div key={i} className="flex items-center gap-2 text-rose-400 animate-slide-up mb-1">
                            <AlertTriangle size={10} />
                            <span className="text-[10px] font-bold uppercase truncate">{v.type}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Safety Indicator */}
            <div className={`h-1 transition-all duration-300 ${violations.length > 0 ? 'bg-rose-500 w-full' : 'bg-emerald-500 w-0'}`} />
        </div>
    );
};

export default ProctoringOverlay;

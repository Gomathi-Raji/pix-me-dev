'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
            <div className="nes-container is-rounded is-dark bg-gray-800 p-8">
                <div className="flex flex-col items-center gap-4">
                    {/* Pixelated Loading Spinner */}
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full loading-spinner-outer"></div>
                        <div className="absolute inset-2 rounded-full loading-spinner-inner"></div>
                        <div className="absolute inset-4 rounded-full loading-spinner-center"></div>
                    </div>

                    {/* Loading Text */}
                    <div className="pixel-text text-yellow-400 text-lg">
                        LOADING{dots}
                    </div>

                    {/* NES Progress Bar */}
                    <progress className="nes-progress is-pattern" value="50" max="100"></progress>

                    {/* Fun Loading Messages */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <i className="nes-icon star is-small text-yellow-400"></i>
                            <p className="text-green-400 pixel-text text-xs">
                                Initializing AI Systems{dots}
                            </p>
                            <i className="nes-icon star is-small text-yellow-400"></i>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <i className="nes-icon heart is-small text-red-400"></i>
                            <p className="text-blue-400 pixel-text text-xs">
                                Loading Neural Networks{dots}
                            </p>
                            <i className="nes-icon heart is-small text-red-400"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { siteConfig } from '@/config/site';

interface PortalOverlayProps {
    day: boolean;
    onEnter: () => void;
}

export default function PortalOverlay({ day, onEnter }: PortalOverlayProps) {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(true);
    };

    // Generate ring of blocks
    const ringOffsets = Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const radius = 50;
        return {
            x: Math.round(Math.cos(angle) * radius),
            y: Math.round(Math.sin(angle) * radius),
        };
    });

    // Safely trigger onEnter after animation ends
    useEffect(() => {
        if (clicked) {
            const timeout = setTimeout(() => {
                onEnter();
            }, ringOffsets.length * 50 + 800); // 50ms per block + 800ms explosion

            return () => clearTimeout(timeout);
        }
    }, [clicked, onEnter, ringOffsets.length]);

    return (
        <AnimatePresence>
            {!clicked && (
                <motion.div
                    className="fixed inset-0 bg-gradient-to-b flex flex-col justify-center items-center z-50 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={`relative z-10 nes-container ${day ? "" : "is-dark"} is-centered is-rounded with-title bg-white w-full max-w-md p-6 shadow-lg`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="title font-pixel text-lg">👋 Welcome!</p>
                        <div className="text-center mb-4">
                            <Image
                                src="/avatar.png"
                                width={250}
                                height={250}
                                className="pixelated mx-auto"
                                alt="Avatar"
                            />
                        </div>
                        <p className="mb-4 font-pixel text-center">
                            I’m <span className="text-green-700">{siteConfig.profile.name}</span>. Explore my blocky world of code!
                        </p>
                        <div className="text-center mt-4">
                            <button
                                className="nes-btn is-success font-pixel"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleClick();
                                }}
                            >
                                EXPLORE MY WORK
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {clicked && (
                <motion.div
                    className="fixed inset-0 bg-black flex justify-center items-center z-50"
                    initial="start"
                    animate="end"
                    variants={{
                        start: { opacity: 1 },
                        end: { opacity: 1 },
                    }}
                    transition={{ duration: 0 }}
                >
                    {ringOffsets.map((off, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-green-700 border-2 border-black"
                            style={{ width: 16, height: 16, opacity: 1 }}
                            initial={{ x: 0, y: 0 }}
                            animate={{ x: off.x * 2, y: off.y * 2, opacity: 0 }}
                            transition={{
                                delay: i * 0.05,
                                duration: 0.8,
                                ease: 'easeOut',
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
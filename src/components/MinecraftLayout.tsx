'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import PortalOverlay from './PortalOverlay';
import Banner from './Banner';
import { siteConfig } from '@/config/site';

export default function MinecraftLayout({ children, setDayOrNight }: { children: React.ReactNode, setDayOrNight?: (day: boolean) => void }) {
    const [day, setDay] = useState(true);
    const [isEntered, setIsEntered] = useState(false);
    const [clouds, setClouds] = useState<any[]>([]);
    const pathname = usePathname();

    // Initialize isEntered from localStorage
    useEffect(() => {
        const entered = localStorage.getItem('portfolio-entered');
        setIsEntered(entered === 'true');
    }, []);

    // Generate clouds only on client side to avoid hydration mismatch
    useEffect(() => {
        const cloudCount = 15;
        const generatedClouds = Array.from({ length: cloudCount }, (_, index) => ({
            top: `${Math.random() * 80}%`, // Random vertical positioning
            duration: 30 + Math.random() * 50, // Random duration between 30-80s
            delay: Math.random() * 20, // Random delay 0-20s
            scale: 0.6 + Math.random() * 0.8, // Random size variation
            opacity: 0.4 + Math.random() * 0.3, // Random opacity 0.4-0.7
        }));
        setClouds(generatedClouds);
    }, []);

    useEffect(() => {
        const hour = new Date().getHours();
        setDay(hour >= 6 && hour < 18);
        document.documentElement.classList.toggle('dark', !(hour >= 6 && hour < 18));
    }, []);

    const toggleDayNight = () => {
        setDay(prev => {
            const newDay = !prev;
            document.documentElement.classList.toggle('dark', !newDay);
            return newDay;
        });
    };

    useEffect(() => {
        if (setDayOrNight) {
            setDayOrNight(day);
        }
    }, [day, setDayOrNight]);

    // Show portal overlay only on home page
    const showPortal = pathname === '/' || pathname === '/home';

    return (
        <motion.div
            className={`minecraft-world ${day ? 'day' : 'night'} relative min-h-screen flex flex-col overflow-hidden z-0`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Banner day={day} toggleDayNight={toggleDayNight} />
            <AnimatePresence>
                {showPortal && !isEntered && (
                    <PortalOverlay day={day} onEnter={() => {
                        setIsEntered(true);
                        localStorage.setItem('portfolio-entered', 'true');
                    }} />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {day ? (
                    <>
                        <div className="absolute top-0 left-0 w-full h-120 overflow-hidden pointer-events-none">
                            {clouds.map((cloud, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute bg-white rounded-full shadow-lg z-10"
                                    style={{ 
                                        top: cloud.top, 
                                        left: '-200px',
                                        width: `${100 + Math.random() * 80}px`,
                                        height: `${40 + Math.random() * 30}px`,
                                        opacity: cloud.opacity,
                                        transform: `scale(${cloud.scale})`,
                                    }}
                                    animate={{ 
                                        left: '110vw', 
                                        y: [0, 10 + Math.random() * 10, -5 - Math.random() * 5, 0] 
                                    }}
                                    transition={{
                                        left: { duration: cloud.duration, ease: 'linear', repeat: Infinity, delay: cloud.delay },
                                        y: { duration: cloud.duration * 0.6, repeat: Infinity, ease: 'easeInOut', delay: cloud.delay },
                                    }}
                                >
                                    {/* Multi-part cloud for realistic shape */}
                                    <div className="absolute inset-0 bg-white rounded-full"></div>
                                    <div className="absolute top-[-30%] left-[20%] w-[60%] h-[80%] bg-white rounded-full opacity-90"></div>
                                    <div className="absolute top-[-20%] right-[15%] w-[50%] h-[70%] bg-white rounded-full opacity-85"></div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="absolute top-4 right-4 text-6xl z-20 animate-pulse">☀️</div>
                    </>
                ) : (
                    <motion.div
                        className="absolute top-0 left-0 w-full h-120 z-10 overflow-hidden pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Static Twinkling Stars */}
                        {[...Array(150)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1.5 h-1.5 bg-white rounded-full"
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 2 + Math.random(), repeat: Infinity }}
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                }}
                            />
                        ))}
                        {/* Shooting Stars - Background */}
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(12)].map((_, i) => (
                                <span
                                    key={`shooting-star-bg-${i}`}
                                    className="shooting-star"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        right: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 20}s`,
                                        animationDuration: `${2 + Math.random() * 4}s`,
                                    }}
                                ></span>
                            ))}
                        </div>
                        {/* Falling Stars */}
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={`falling-${i}`}
                                className="absolute"
                                initial={{ 
                                    top: `${Math.random() * 30}%`, 
                                    left: `${Math.random() * 100}%`,
                                    opacity: 0 
                                }}
                                animate={{ 
                                    top: '120vh',
                                    left: `${parseFloat(`${Math.random() * 100}`) + 20}%`,
                                    opacity: [0, 1, 1, 0] 
                                }}
                                transition={{ 
                                    duration: 1.5 + Math.random() * 1,
                                    repeat: Infinity,
                                    delay: Math.random() * 15,
                                    ease: 'easeOut'
                                }}
                            >
                                <div className="w-px h-20 bg-gradient-to-b from-white via-white/80 to-transparent blur-sm shadow-lg"
                                     style={{ transform: 'rotate(45deg)' }} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            {isEntered && (
                <div className="relative z-20 pt-8">{children}</div>
            )}
            {isEntered && (
                                <footer className={`nes-container is-rounded ${day ? "bg-blue-200" : "is-dark"} text-center py-8 px-4 relative overflow-hidden`}>
                    {day && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {clouds.map((cloud, i) => (
                                <motion.div
                                    key={`footer-cloud-${i}`}
                                    className="absolute bg-white rounded-full shadow-lg"
                                    style={{ 
                                        top: cloud.top, 
                                        left: '-200px',
                                        width: `${100 + Math.random() * 80}px`,
                                        height: `${40 + Math.random() * 30}px`,
                                        opacity: cloud.opacity,
                                        transform: `scale(${cloud.scale})`,
                                    }}
                                    animate={{ 
                                        left: '110vw', 
                                        y: [0, 10 + Math.random() * 10, -5 - Math.random() * 5, 0] 
                                    }}
                                    transition={{
                                        left: { duration: cloud.duration, ease: 'linear', repeat: Infinity, delay: cloud.delay },
                                        y: { duration: cloud.duration * 0.6, repeat: Infinity, ease: 'easeInOut', delay: cloud.delay },
                                    }}
                                >
                                    {/* Multi-part cloud for realistic shape */}
                                    <div className="absolute inset-0 bg-white rounded-full"></div>
                                    <div className="absolute top-[-30%] left-[20%] w-[60%] h-[80%] bg-white rounded-full opacity-90"></div>
                                    <div className="absolute top-[-20%] right-[15%] w-[50%] h-[70%] bg-white rounded-full opacity-85"></div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                    {!day && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {/* Footer Stars */}
                            {[...Array(100)].map((_, i) => (
                                <motion.div
                                    key={`footer-star-${i}`}
                                    className="absolute w-1 h-1 bg-white rounded-full"
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 2 + Math.random(), repeat: Infinity }}
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                    }}
                                />
                            ))}
                            {/* Footer Shooting Stars - Realistic Random */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                {[...Array(8)].map((_, i) => (
                                    <span
                                        key={`footer-shooting-${i}`}
                                        className="shooting-star"
                                        style={{
                                            top: `${10 + Math.random() * 80}%`, // More realistic vertical spread
                                            right: `${Math.random() * 120}%`, // Extended horizontal range
                                            animationDelay: `${Math.random() * 25}s`, // Longer delay range
                                            animationDuration: `${3 + Math.random() * 5}s`, // More varied speeds
                                        }}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="max-w-4xl mx-auto relative z-10">
                        {/* Social Links */}
                        <div className="flex justify-center gap-4 mb-4">
                            <a href={siteConfig.contact.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                                <i className="nes-icon linkedin is-large"></i>
                            </a>
                            <a href={siteConfig.contact.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                                <i className="nes-icon github is-large"></i>
                            </a>
                            <a href={siteConfig.contact.kaggle} target="_blank" rel="noopener noreferrer" title="Kaggle">
                                <i className="nes-icon twitter is-large"></i>
                            </a>
                            <a href={siteConfig.contact.leetcode} target="_blank" rel="noopener noreferrer" title="LeetCode">
                                <i className="nes-icon google is-large"></i>
                            </a>
                            <a href={siteConfig.contact.geeksforgeeks} target="_blank" rel="noopener noreferrer" title="GeeksforGeeks">
                                <i className="nes-icon reddit is-large"></i>
                            </a>
                            <a href={siteConfig.contact.youtube} target="_blank" rel="noopener noreferrer" title="YouTube">
                                <i className="nes-icon youtube is-large"></i>
                            </a>
                            <a href={`mailto:${siteConfig.contact.email}`} title="Email">
                                <i className="nes-icon gmail is-large"></i>
                            </a>
                        </div>

                        {/* Copyright */}
                        <div className="text-center mb-2 flex justify-center">
                            <div className="nes-badge">
                                <span className="is-primary px-1 py-1 block text-center whitespace-nowrap">DINESH S</span>
                            </div>
                        </div>

                        {/* Fun Message */}
                        <div className="text-center mb-4">
                            <div className={`nes-balloon from-left ${day ? "" : "is-dark"}`}>
                                <p className="text-xs">Built with ❤️ using Next.js & NES.css</p>
                            </div>
                        </div>

                        {/* Day/Night Indicator */}
                        <div className="flex justify-center">
                            <div className={`nes-badge ${day ? 'is-success' : 'is-dark'}`}>
                                <span>{day ? '☀️ Daytime' : '🌙 Night Time'}</span>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </motion.div>
    );
}
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
        const cloudCount = 10;
        const generatedClouds = Array.from({ length: cloudCount }, (_, index) => ({
            top: `${(index * 7 + 2) % 30 + 2}vh`, // Deterministic positioning
            duration: 30 + (index * 5) % 50,
            delay: (index * 1) % 10
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
            {!showPortal && <Banner day={day} toggleDayNight={toggleDayNight} />}
            {isEntered && showPortal && <Banner day={day} toggleDayNight={toggleDayNight} />}
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
                    <div className="absolute top-0 left-0 w-full h-120 overflow-hidden pointer-events-none">
                        {clouds.map((cloud, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-40 h-18 bg-white opacity-80 rounded-full shadow-md z-10"
                                style={{ top: cloud.top, left: '-200px' }}
                                animate={{ left: '110vw' }}
                                transition={{
                                    duration: cloud.duration,
                                    ease: 'linear',
                                    repeat: Infinity,
                                    delay: cloud.delay,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="absolute top-0 left-0 w-full h-120 z-10 overflow-hidden pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {[...Array(90)].map((_, i) => (
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
                    </motion.div>
                )}
            </AnimatePresence>
            {isEntered && (
                <div className="relative z-20 pt-8">{children}</div>
            )}
            {isEntered && (
                <footer className="p-4 text-white z-20 relative bg-black bg-opacity-50">
                    <div className="max-w-4xl mx-auto">
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
                                <span className="is-primary px-4 py-1 block text-center whitespace-nowrap">&copy; 2025 DINESH S</span>
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
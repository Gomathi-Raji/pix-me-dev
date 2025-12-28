'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import ToggleDayNight from './ToggleDayNight';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdClose } from 'react-icons/io';
import { CgGitFork } from 'react-icons/cg';
import { AiFillStar } from 'react-icons/ai';
import { ImBlog } from 'react-icons/im';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';

export default function Banner({ day, toggleDayNight }: { day: boolean; toggleDayNight: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState('');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const navButtonClass = `header-nes-btn pixelated touch-manipulation hover:scale-105 active:scale-95 transition-transform duration-200 ${day ? '' : 'header-nes-btn-dark'}`;
    
    // Music tracks for different modes
    const lightModeTrack = '/Attack on Titan 8-bit.mp3';
    const darkModeTrack = '/Kamado Tanjiro 8bit.mp3';

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const toggleMusic = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                    localStorage.setItem('musicPlaying', 'true');
                }).catch(() => {
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
                setIsPlaying(false);
                localStorage.setItem('musicPlaying', 'false');
            }
        }
    };

    // Effect to handle music track switching based on day/night mode
    useEffect(() => {
        // Try to attach to the global audio element created in the root layout
        if (typeof window !== 'undefined') {
            const globalAudio = document.getElementById('global-audio') as HTMLAudioElement | null;
            if (globalAudio) audioRef.current = globalAudio;
        }

        const newTrack = day ? lightModeTrack : darkModeTrack;
        
        if (currentTrack !== newTrack && audioRef.current) {
            const wasPlaying = !audioRef.current.paused;
            const currentTime = audioRef.current.currentTime;
            
            // Update track
            setCurrentTrack(newTrack);
            audioRef.current.src = newTrack;
            audioRef.current.load();
            
            // Restore playing state after a short delay
            setTimeout(() => {
                if (audioRef.current && wasPlaying) {
                    audioRef.current.currentTime = 0; // Start new track from beginning
                    audioRef.current.play().catch(() => {
                        setIsPlaying(false);
                    });
                }
            }, 100);
        }
    }, [day, currentTrack]);

    // Effect to ensure audio stays playing if it should be
    useEffect(() => {
        const checkAudio = () => {
            if (audioRef.current) {
                const shouldBePlaying = localStorage.getItem('musicPlaying') === 'true';
                if (shouldBePlaying && audioRef.current.paused && audioRef.current.readyState >= 2) {
                    audioRef.current.play().catch(() => {
                        // Ignore autoplay errors
                    });
                }
            }
        };

        // Check immediately
        checkAudio();

        // Check periodically
        const interval = setInterval(checkAudio, 1000);

        return () => clearInterval(interval);
    }, [currentTrack]);

    useEffect(() => {
        if (audioRef.current) {
            if (audioRef.current) audioRef.current.loop = true;
            audioRef.current.volume = 0.3;
            
            // Set initial track
            const initialTrack = day ? lightModeTrack : darkModeTrack;
            setCurrentTrack(initialTrack);
            audioRef.current.src = initialTrack;
            
            // Restore music state from localStorage
            const wasMusicPlaying = localStorage.getItem('musicPlaying') === 'true';
            const savedTime = localStorage.getItem('musicCurrentTime');
            
            // Set up event listener to restore time after audio loads
            const handleLoadedMetadata = () => {
                if (savedTime && audioRef.current) {
                    audioRef.current.currentTime = parseFloat(savedTime);
                }
                
                if (wasMusicPlaying && audioRef.current) {
                    audioRef.current.play().then(() => {
                        setIsPlaying(true);
                    }).catch(() => {
                        setIsPlaying(false);
                    });
                }
            };
            
            audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
            audioRef.current.load();

            // Save current time periodically
            const saveTimeInterval = setInterval(() => {
                if (audioRef.current && !audioRef.current.paused) {
                    localStorage.setItem('musicCurrentTime', audioRef.current.currentTime.toString());
                }
            }, 1000);

            // Handle page visibility changes to resume audio
            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible' && audioRef.current) {
                    const shouldBePlaying = localStorage.getItem('musicPlaying') === 'true';
                    if (shouldBePlaying && audioRef.current.paused) {
                        audioRef.current.play().catch(() => {
                            // Ignore autoplay errors
                        });
                    }
                }
            };

            // Save time before page unload
            const handleBeforeUnload = () => {
                if (audioRef.current) {
                    localStorage.setItem('musicCurrentTime', audioRef.current.currentTime.toString());
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);
            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => {
                clearInterval(saveTimeInterval);
                window.removeEventListener('beforeunload', handleBeforeUnload);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                if (audioRef.current) {
                    audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
                }
            };
        }
    }, []); // Only run once on mount

    const links = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/projects', label: 'Projects' },
        { href: '/skills', label: 'Skills' },
        { href: '/experience', label: 'Experience' }
    ];

    const socialComponent = () => {
        return (
            <div className="flex gap-2 items-center">
                <a href={`https://www.github.com/${siteConfig.contact.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub">
                    <i className="nes-icon github"></i>
                </a>
                {siteConfig.contact.medium && (
                    <a href={siteConfig.contact.medium}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Medium">
                        <i className="nes-icon medium"></i>
                    </a>
                )}
                <a href={siteConfig.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn">
                    <i className="nes-icon linkedin"></i>
                </a>
            </div>
        );
    };

    return (
        <div
            className={`w-screen ${isOpen ? 'p-2 h-auto text-4xl' : 'p-3 h-17 text-2xl'
                } ${day ? 'pixelated-header' : 'pixelated-header-dark'} text-white flex flex-col md:flex-row justify-between items-center fixed top-0 left-0 z-50 transition-all duration-500 ease-in-out`}
        >
            <div className="flex justify-between items-center w-full md:w-auto">
                <div className="content-start flex items-center gap-3">
                    <Link href="/" className="group flex items-center gap-4 no-underline">
                        {/* Logo Symbol */}
                        <div className="relative w-12 h-12 bg-gray-900 border-4 border-white shadow-[4px_4px_0px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:translate-y-[-2px] transition-transform">
                            <span className="text-2xl font-bold text-yellow-400 pixel-text drop-shadow-[2px_2px_0px_rgba(180,83,9,1)]">DK</span>
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-1 h-1 bg-white"></div>
                            <div className="absolute top-0 right-0 w-1 h-1 bg-white"></div>
                            <div className="absolute bottom-0 left-0 w-1 h-1 bg-white"></div>
                            <div className="absolute bottom-0 right-0 w-1 h-1 bg-white"></div>
                        </div>

                        {/* Logo Text */}
                        <div className="flex flex-col justify-center">
                            <h1 className="text-2xl font-bold text-white pixel-text tracking-widest drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] group-hover:text-yellow-400 transition-colors leading-none">
                                DINESH S
                            </h1>
                            <span className="text-[10px] text-gray-400 pixel-text tracking-[0.2em] mt-1 group-hover:text-white transition-colors">
                                Ai/ML + FULLSTACK DEVELOPER
                            </span>
                        </div>
                    </Link>
                </div>
                <div className="content-end flex gap-2 md:hidden">
                    <ToggleDayNight day={day} toggle={toggleDayNight} />
                    <button
                        className={navButtonClass}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>
            <div
                className={`${isOpen ? 'translate-x-0 visible' : '-translate-x-full invisible'
                    } transition-transform duration-500 ease-in-out flex flex-col gap-4 items-center w-full md:hidden p-4 border-t-4 border-yellow-400 ${day ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-white'}`}
            >
                <div className={`nes-container is-rounded p-3 w-full max-w-xs ${day ? 'bg-gray-100' : 'is-dark bg-gray-800'}`}>
                    <div className="flex flex-col gap-3">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${navButtonClass} text-center w-full`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={toggleMusic}
                        title={isPlaying ? "Pause Music" : "Play Music"}
                        className={navButtonClass}
                    >
                        {isPlaying ? <HiVolumeUp className="inline mr-1" /> : <HiVolumeOff className="inline mr-1" />}
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    {siteConfig.contact.blog && (
                        <a
                            href={siteConfig.contact.blog}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Visit Blog"
                            className={navButtonClass}
                        >
                            <ImBlog className="inline mr-1" />
                            Blog
                        </a>
                    )}
                </div>
                <div className="flex gap-2">
                    {socialComponent()}
                </div>
            </div>
            <div className="hidden md:flex gap-2 items-center">
                <div className={`nes-container is-rounded p-2 ${day ? 'bg-gray-100' : 'is-dark bg-gray-800'}`}>
                    <div className="flex gap-2 items-center">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={navButtonClass}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className={`nes-container is-rounded p-2 ${day ? 'bg-gray-100' : 'is-dark bg-gray-800'}`}>
                    <div className="flex gap-2 items-center">
                        {socialComponent()}
                        {siteConfig.contact.blog && (
                            <a
                                href={siteConfig.contact.blog}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Visit Blog"
                                className={navButtonClass}
                            >
                                <ImBlog />
                            </a>
                        )}
                        <button
                            onClick={toggleMusic}
                            title={isPlaying ? "Pause Music" : "Play Music"}
                            className={navButtonClass}
                        >
                            {isPlaying ? <HiVolumeUp /> : <HiVolumeOff />}
                        </button>
                        <ToggleDayNight day={day} toggle={toggleDayNight} />
                    </div>
                </div>
            </div>
            <audio
                ref={audioRef}
                preload="auto"
            />
        </div>
    );
}

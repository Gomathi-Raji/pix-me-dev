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
    const audioRef = useRef<HTMLAudioElement>(null);
    const navButtonClass = `header-nes-btn pixelated ${day ? '' : 'header-nes-btn-dark'}`;

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
                localStorage.setItem('musicPlaying', 'false');
            } else {
                audioRef.current.play();
                setIsPlaying(true);
                localStorage.setItem('musicPlaying', 'true');
            }
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.loop = true;
            audioRef.current.volume = 0.3;
            
            // Restore music state from localStorage
            const wasMusicPlaying = localStorage.getItem('musicPlaying') === 'true';
            const savedTime = parseFloat(localStorage.getItem('musicCurrentTime') || '0');
            
            if (wasMusicPlaying) {
                audioRef.current.currentTime = savedTime;
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(() => {
                    // Auto-play might be blocked, user needs to interact first
                    setIsPlaying(false);
                });
            }

            // Save current time periodically
            const saveTimeInterval = setInterval(() => {
                if (audioRef.current && isPlaying) {
                    localStorage.setItem('musicCurrentTime', audioRef.current.currentTime.toString());
                }
            }, 1000);

            // Save time before page unload
            const handleBeforeUnload = () => {
                if (audioRef.current) {
                    localStorage.setItem('musicCurrentTime', audioRef.current.currentTime.toString());
                }
            };

            window.addEventListener('beforeunload', handleBeforeUnload);

            return () => {
                clearInterval(saveTimeInterval);
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }
    }, [isPlaying]);

    const links = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/projects', label: 'Projects' },
        { href: '/skills', label: 'Skills' },
        { href: '/experience', label: 'Experience' },
        { href: '/#education', label: 'Education' },
        { href: '/contact', label: 'Contact' },
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
                    <div className="pixel-logo-container p-3">
                        {/* Pixelated AI/ML Logo */}
                        <div className="flex items-center gap-2">
                            {/* Name with Trophy */}
                            <div className="flex items-center gap-1">
                                <i className="nes-icon trophy is-small text-yellow-400"></i>
                                <span className="pixel-logo-text text-yellow-400 text-sm md:text-lg font-bold">DINESH</span>
                            </div>

                            {/* AI/ML Icon Grid */}
                            <div className="logo-icon-grid ml-2">
                                {/* AI Brain/Circuit */}
                                <div className="logo-icon-box">
                                    <i className="nes-icon heart is-small text-red-400" title="AI & Neural Networks"></i>
                                </div>
                                {/* ML Algorithm */}
                                <div className="logo-icon-box">
                                    <i className="nes-icon star is-small text-blue-400" title="Machine Learning"></i>
                                </div>
                                {/* Data Analytics */}
                                <div className="logo-icon-box">
                                    <i className="nes-icon trophy is-small text-green-400" title="Data Science & Analytics"></i>
                                </div>
                            </div>
                        </div>

                        {/* Tagline with Tech Icons */}
                        <div className="flex items-center gap-2 mt-1">
                            <i className="nes-icon star is-small text-yellow-300"></i>
                            <div className="flex items-center gap-1">
                                <span className="pixel-logo-tagline text-green-400">AI • ML • DATA</span>
                                <i className="nes-icon close is-small text-purple-400"></i>
                                <span className="pixel-logo-tagline text-blue-400">INNOVATOR</span>
                            </div>
                        </div>
                    </div>
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
                    } transition-transform duration-500 ease-in-out flex flex-col gap-4 items-center bg-gray-900 w-full md:hidden p-4 border-t-4 border-yellow-400`}
            >
                <div className="nes-container is-rounded is-dark bg-gray-800 p-3 w-full max-w-xs">
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
                <div className="nes-container is-rounded is-dark bg-gray-800 p-2">
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
                <div className="nes-container is-rounded is-dark bg-gray-800 p-2">
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
                src="/Attack on Titan ED7「Akuma no Ko」8-bit.mp3"
                preload="auto"
            />
        </div>
    );
}

"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/config/site';
import type { Project } from '@/types/project';
import ProjectModal from '@/components/ProjectModal';


const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Projects({ day }: { day: boolean; }) {
    const [visibleCount, setVisibleCount] = useState(4);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showMore = () => setVisibleCount((prev) => prev + 4);

    const openProject = useCallback((project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    }, []);

    const closeProject = useCallback(() => {
        setIsModalOpen(false);
        // keep selectedProject so modal can animate out cleanly
        setTimeout(() => setSelectedProject(null), 200);
    }, []);

    return (
        <section
            id="projects"
            className={`nes-container is-rounded with-title p-4 sm:p-6 touch-manipulation ${day ? 'bg-gray-200' : 'is-dark'}`}
        >
            <p className="title mb-4 text-center sm:text-left mobile-text-lg">Projects</p>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                initial="hidden"
                animate="visible"
                variants={listVariants}
            >
                <AnimatePresence>
                    {siteConfig.projects.slice(0, visibleCount).map((p: Project) => (
                        <motion.div
                            key={p.name}
                            variants={cardVariants}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => openProject(p)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') openProject(p);
                                }}
                                className={`nes-container is-rounded with-title p-3 sm:p-4 flex flex-col justify-between h-full hover:shadow-2xl active:scale-95 transition-all duration-300 touch-manipulation cursor-pointer ${day ? 'bg-white text-gray-900' : 'is-dark text-gray-100'}`}
                            >
                                {p.image && (
                                    <img
                                        src={p.image}
                                        alt={`${p.name} Project Thumbnail`}
                                        className="w-full h-24 sm:h-32 object-cover rounded mb-3 sm:mb-4 pixelated hover:scale-105 transition-transform duration-200"
                                    />
                                )}
                                <div className="flex-grow">
                                    <p className="title mb-2 text-sm sm:text-base break-words">{p.name}</p>
                                    <p className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">{p.description}</p>
                                    {p.technologies && (
                                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                                            {p.technologies.slice(0, 4).map((tech, index) => {
                                                const colors = [
                                                    { bg: 'bg-blue-500', text: 'text-white' },
                                                    { bg: 'bg-green-500', text: 'text-white' },
                                                    { bg: 'bg-purple-500', text: 'text-white' },
                                                    { bg: 'bg-red-500', text: 'text-white' },
                                                    { bg: 'bg-yellow-500', text: 'text-black' }
                                                ];
                                                const colorClass = colors[index % colors.length];
                                                return (
                                                    <span
                                                        key={tech}
                                                        className={`home-tech-tag inline-block px-2 py-1 text-xs font-bold rounded hover:scale-110 active:scale-95 transition-transform duration-200 touch-manipulation ${colorClass.bg} ${colorClass.text} border-2 border-black`}
                                                    >
                                                        {tech}
                                                    </span>
                                                );
                                            })}
                                            {p.technologies.length > 4 && (
                                                <span className="home-tech-tag inline-block px-2 py-1 text-xs font-bold rounded bg-gray-500 text-white border-2 border-black">
                                                    +{p.technologies.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    {p.liveUrl && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(p.liveUrl, '_blank');
                                            }}
                                            className="nes-btn is-success is-small w-full sm:flex-1"
                                        >
                                            🌐 Live Demo
                                        </button>
                                    )}
                                    {p.repoUrl && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(p.repoUrl, '_blank');
                                            }}
                                            className="nes-btn is-primary is-small w-full sm:flex-1"
                                        >
                                            💻 GitHub
                                        </button>
                                    )}
                                    {p.playStoreUrl && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(p.playStoreUrl, '_blank');
                                            }}
                                            className="nes-btn is-warning is-small w-full sm:flex-1"
                                        >
                                            ⭐ View App
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            <ProjectModal open={isModalOpen} project={selectedProject} day={day} onClose={closeProject} />

            <AnimatePresence>
                {visibleCount < siteConfig.projects.length && (
                    <motion.div
                        className="flex justify-center mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <button
                            onClick={showMore}
                            className="nes-btn is-primary"
                        >
                            Load More
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
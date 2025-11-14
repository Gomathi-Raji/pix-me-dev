`use client`

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/config/site';
import type { Project } from '@/types/project';
import { useRouter } from 'next/navigation';


const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Projects({ day }: { day: boolean; }) {
    const router = useRouter();
    const [visibleCount, setVisibleCount] = useState(4);

    const showMore = () => setVisibleCount((prev) => prev + 4);

    return (
        <section
            id="projects"
            className={`nes-container is-rounded with-title p-6 ${day ? 'bg-gray-200' : 'is-dark'}`}
        >
            <p className="title mb-4">Projects</p>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
                                className={`nes-container is-rounded with-title p-4 flex flex-col justify-between ${day ? 'bg-white text-gray-900' : 'is-dark text-gray-100'}`}
                            >
                                {p.image && (
                                    <img
                                        src={p.image}
                                        alt={`${p.name} Project Thumbnail`}
                                        className="w-full h-32 object-cover rounded mb-4 pixelated"
                                    />
                                )}
                                <div>
                                    <p className="title mb-2">{p.name}</p>
                                    <p className="text-sm mb-4">{p.description}</p>
                                    {p.technologies && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {p.technologies.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="nes-badge"
                                                >
                                                    <span className="is-dark">{tech}</span>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {p.liveUrl && (
                                        <button
                                            onClick={() => window.open(p.liveUrl, '_blank')}
                                            className="nes-btn is-success is-small flex-1"
                                        >
                                            <i className="nes-icon globe"></i>
                                            <span className="ml-1">Live Demo</span>
                                        </button>
                                    )}
                                    {p.repoUrl && (
                                        <button
                                            onClick={() => window.open(p.repoUrl, '_blank')}
                                            className="nes-btn is-primary is-small flex-1"
                                        >
                                            <i className="nes-icon github"></i>
                                            <span className="ml-1">GitHub</span>
                                        </button>
                                    )}
                                    {p.playStoreUrl && (
                                        <button
                                            onClick={() => window.open(p.playStoreUrl, '_blank')}
                                            className="nes-btn is-warning is-small flex-1"
                                        >
                                            <i className="nes-icon star"></i>
                                            <span className="ml-1">View App</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

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
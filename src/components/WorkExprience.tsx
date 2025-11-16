'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '@/config/site';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { TbBriefcase, TbCode, TbCrown, TbSchool } from 'react-icons/tb';
import { Work } from '@/types/work';

export default function WorkExprience({ day }: { day: boolean }) {
    return (
        <section className={`experience-timeline nes-container with-title is-rounded p-4 md:p-6 ${day ? 'bg-gray-100' : 'is-dark'}`}>
            <p className="title mb-4">Experience Timeline</p>
            <div className="experience-timeline relative pl-6 md:pl-10">
                <span
                    className={`experience-timeline-line absolute left-3 md:left-4 top-6 bottom-6 w-1 ${day ? 'bg-gray-300' : 'bg-gray-700'}`}
                    aria-hidden="true"
                ></span>
                <div className="mobile-spacing-y-10 space-y-10">
                    {siteConfig.work.map((job, index) => (
                        <TimelineCard key={`${job.company}-${job.position}`} job={job} day={day} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TimelineCard({ job, day, index }: { job: Work; day: boolean; index: number }) {
    const [open, setOpen] = useState(false);

    const resolveIcon = (position: string) => {
        const normalized = position.toLowerCase();
        if (normalized.includes('cto')) return TbCrown;
        if (normalized.includes('developer')) return TbCode;
        if (normalized.includes('intern') || normalized.includes('fellow')) return TbSchool;
        return TbBriefcase;
    };

    const accentPalette = ['border-blue-500', 'border-green-500', 'border-yellow-500', 'border-red-500'];
    const IconComponent = resolveIcon(job.position);
    const markerColor = accentPalette[index % accentPalette.length];

    return (
        <motion.article layout className="experience-card relative pl-2 md:pl-10">
            <span className={`experience-marker absolute left-0 top-8 w-5 h-5 rounded-full border-4 ${markerColor} bg-white`} aria-hidden="true"></span>
            <div className={`nes-container is-rounded with-title p-4 ${day ? 'bg-white text-gray-900' : 'is-dark text-gray-100'}`}>
                <div className="flex flex-col gap-2">
                    <h3 className="experience-title font-bold text-lg flex items-center gap-2">
                        <IconComponent size={22} />
                        {job.position} <span className="experience-summary text-sm text-gray-500">@</span> {job.company}
                    </h3>
                    <p className="experience-summary text-xs text-gray-500">
                        {job.startDate} &mdash; {job.endDate || 'Present'}
                    </p>
                    <p className="experience-summary text-sm leading-relaxed">{job.summary}</p>
                    {job.tags?.length ? (
                        <div className="experience-tags flex flex-wrap gap-2">
                            {job.tags.map((tag) => (
                                <span key={tag} className="nes-badge">
                                    <span className="is-primary">{tag}</span>
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>

                {open ? (
                    <div className="mt-4 space-y-4">
                        <ul className="nes-list is-disc pl-6 space-y-1 text-sm">
                            {job.highlights.map((highlight) => (
                                <li key={highlight}>{highlight}</li>
                            ))}
                        </ul>
                        {job.links?.length ? (
                            <div>
                                <p className="text-sm font-bold mb-2">Links</p>
                                <div className="experience-links flex flex-wrap gap-2">
                                    {job.links.map((link) => (
                                        <a
                                            key={link.url}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="nes-btn is-success is-small"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="nes-btn is-primary is-small mt-4 flex items-center gap-2"
                >
                    {open ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    <span className="text-xs">{open ? 'Hide' : 'Show'} Details</span>
                </button>
            </div>
        </motion.article>
    );
}

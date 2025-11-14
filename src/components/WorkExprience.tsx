`use client`

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/config/site'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { Work } from '@/types/work'

export default function WorkExperience({ day }: { day: boolean }) {
    return (
        <section className={`nes-container with-title is-rounded p-6 ${day ? 'bg-gray-100' : 'is-dark'}`}>
            <p className="title mb-4">Work Experience</p>
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-6">
                {siteConfig.work.map(job => (
                    <WorkCard key={job.company} job={job} day={day} />
                ))}
            </div>
        </section>
    )
}


function WorkCard({ job, day }: { job: Work, day: boolean }) {
    const [open, setOpen] = useState(false)
    return (
        <motion.article
            id="work"
            layout
            className={`relative nes-container is-rounded with-title p-4 flex flex-col justify-between pb-12 ${day ? 'bg-white text-gray-900' : 'is-dark text-gray-100'}`}
        >
            <div>
                <h3 className="font-bold text-lg">
                    {job.position} <span className="text-sm text-gray-500">@</span> {job.company}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                    {job.startDate} &mdash; {job.endDate || 'Present'}
                </p>
                <p className="text-sm mb-2">{job.summary}</p>
            </div>

            {open && (
                <div className="lists">
                    <ul className="nes-list is-circle">
                        {job.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                        ))}
                    </ul>
                </div>
            )}
            <button
                onClick={() => setOpen(o => !o)}
                className="nes-btn absolute bottom-4 left-1/2 transform -translate-x-1/2 nes-btn is-primary is-small flex items-center gap-1"
            >
                <div className="flex items-center gap-2">
                    {open ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    <span className="text-xs">{open ? 'Hide' : 'Show'} Details</span>
                </div>
            </button>
        </motion.article>
    )
}

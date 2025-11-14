import React, { useState } from "react";
import { loadIcon } from "../helpers/iconLoader";
import { siteConfig } from "@/config/site";
import { motion } from "framer-motion";

const Skills = ({ day }: { day: boolean }) => {
    const [showAllStates, setShowAllStates] = useState<Record<string, boolean>>({}); // State to toggle "Load More" and "Show Less" per group

    const toggleShowAll = (groupTitle: string) => {
        setShowAllStates(prev => ({
            ...prev,
            [groupTitle]: !prev[groupTitle]
        }));
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <div className="flex flex-col gap-4">
            {siteConfig.skills.map((skillGroup) => (
                <div key={skillGroup.title} className={`nes-container with-title is-rounded bg-gray-200 ${day ? "" : "is-dark"}`}>
                    <p className="title">
                        <i className="nes-icon star"></i>
                        {skillGroup.title}
                    </p>
                    <motion.div
                        className="flex flex-wrap justify-center gap-4 sm:gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {skillGroup.skills
                            .slice(0, showAllStates[skillGroup.title] ? skillGroup.skills.length : 6) // Show limited skills on mobile
                            .map((skill) => {
                                const IconComponent = loadIcon(skill.library, skill.icon);
                                return (
                                    <motion.div
                                        key={skill.name}
                                        className={`relative group border rounded-lg p-6 sm:p-8 text-center flex-shrink-0 transition-transform transform hover:scale-110 ${day
                                            ? "border-gray-300 bg-white text-black"
                                            : "border-gray-700 bg-gray-800 text-white"
                                            }`}
                                        style={{ width: "45%", maxWidth: "150px" }} // Responsive width
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {IconComponent && React.createElement(IconComponent, { className: "w-12 h-12 sm:w-20 sm:h-20 mx-auto" })}
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1">
                                            {skill.name}
                                        </div>
                                    </motion.div>
                                );
                            })}
                    </motion.div>
                    {skillGroup.skills.length > 6 && (
                        <div className="mt-4 flex justify-end">
                            {!showAllStates[skillGroup.title] ? (
                                <button
                                    type="button"
                                    onClick={() => toggleShowAll(skillGroup.title)}
                                    className="nes-btn is-primary"
                                >
                                    Show More
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => toggleShowAll(skillGroup.title)}
                                    className="nes-btn is-error"
                                >
                                    Show Less
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Skills;

import { siteConfig } from "@/config/site";
import ContactForm from "./ContactForm";
import { motion } from "framer-motion";

export default function Contact({ day }: { day: boolean }) {
    const buttonBase = `nes-btn contact-social-btn ${day ? "contact-social-btn-day" : "contact-social-btn-night"}`;

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const socialVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { 
                staggerChildren: 0.1,
                delayChildren: 0.3
            } 
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.8 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { 
                type: "spring" as const, 
                stiffness: 300, 
                damping: 20 
            } 
        }
    };

    return (
        <motion.section 
            id="contact" 
            className={`nes-container is-rounded with-title ${day ? "bg-gray-200" : "bg-gray-900 is-dark"} relative overflow-hidden`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            <p className="title">💬 CONNECT WITH ME</p>

            {/* Contact Form */}
            <ContactForm day={day} />

            {/* Social Links */}
            <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                variants={socialVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.a 
                    href={siteConfig.contact.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${buttonBase} group`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="nes-icon linkedin is-large group-hover:animate-pulse"></i>
                    <span className="ml-2">LinkedIn</span>
                </motion.a>
                <motion.a 
                    href={siteConfig.contact.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${buttonBase} group`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="nes-icon github is-large group-hover:animate-pulse"></i>
                    <span className="ml-2">GitHub</span>
                </motion.a>
                <motion.a 
                    href={siteConfig.contact.kaggle} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${buttonBase} group`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="nes-icon twitter is-large group-hover:animate-pulse"></i>
                    <span className="ml-2">Kaggle</span>
                </motion.a>
                <motion.a 
                    href={siteConfig.contact.leetcode} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${buttonBase} group`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="nes-icon google is-large group-hover:animate-pulse"></i>
                    <span className="ml-2">LeetCode</span>
                </motion.a>
                <motion.a 
                    href={siteConfig.contact.geeksforgeeks} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${buttonBase} group`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="nes-icon reddit is-large group-hover:animate-pulse"></i>
                    <span className="ml-2">GFG</span>
                </motion.a>
                <motion.a 
                    href={siteConfig.contact.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${buttonBase} group`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="nes-icon youtube is-large group-hover:animate-pulse"></i>
                    <span className="ml-2">YouTube</span>
                </motion.a>
                <motion.a 
                    href={`mailto:${siteConfig.contact.email}`} 
                    className={`${buttonBase} group`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="nes-icon gmail is-large group-hover:animate-pulse"></i>
                    <span className="ml-2">Email</span>
                </motion.a>
                <motion.a 
                    href={siteConfig.contact.resume} 
                    download 
                    className={`${buttonBase} contact-social-btn-resume group`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="nes-icon star is-large group-hover:animate-spin"></i>
                    <span className="ml-2">Resume</span>
                </motion.a>
            </motion.div>

            <motion.div 
                className="text-center space-y-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            >
                <p className={`contact-cta ${day ? '' : 'dark'}`}>⭐️ Let's Innovate Together!</p>
                <p className={`text-sm ${day ? 'text-gray-600' : 'text-gray-400'}`}>
                    Feel free to reach out for collaborations, projects, or a chat about tech and interactive fun.
                </p>
            </motion.div>
        </motion.section>
    );
}

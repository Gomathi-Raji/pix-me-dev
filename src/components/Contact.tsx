import { siteConfig } from "@/config/site";

export default function Contact({ day }: { day: boolean }) {
    const buttonBase = `nes-btn contact-social-btn ${day ? "contact-social-btn-day" : "contact-social-btn-night"}`;

    return (
        <section id="contact" className={`nes-container is-rounded with-title ${day ? "bg-gray-200" : "bg-gray-900 is-dark"}`}>
            <p className="title">💬 CONNECT WITH ME</p>

            {/* Social Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <a href={siteConfig.contact.linkedin} target="_blank" rel="noopener noreferrer" className={buttonBase}>
                    <i className="nes-icon linkedin is-large"></i>
                    <span className="ml-2">LinkedIn</span>
                </a>
                <a href={siteConfig.contact.github} target="_blank" rel="noopener noreferrer" className={buttonBase}>
                    <i className="nes-icon github is-large"></i>
                    <span className="ml-2">GitHub</span>
                </a>
                <a href={siteConfig.contact.kaggle} target="_blank" rel="noopener noreferrer" className={buttonBase}>
                    <i className="nes-icon twitter is-large"></i>
                    <span className="ml-2">Kaggle</span>
                </a>
                <a href={siteConfig.contact.leetcode} target="_blank" rel="noopener noreferrer" className={buttonBase}>
                    <i className="nes-icon google is-large"></i>
                    <span className="ml-2">LeetCode</span>
                </a>
                <a href={siteConfig.contact.geeksforgeeks} target="_blank" rel="noopener noreferrer" className={buttonBase}>
                    <i className="nes-icon reddit is-large"></i>
                    <span className="ml-2">GFG</span>
                </a>
                <a href={siteConfig.contact.youtube} target="_blank" rel="noopener noreferrer" className={buttonBase}>
                    <i className="nes-icon youtube is-large"></i>
                    <span className="ml-2">YouTube</span>
                </a>
                <a href={`mailto:${siteConfig.contact.email}`} className={buttonBase}>
                    <i className="nes-icon gmail is-large"></i>
                    <span className="ml-2">Email</span>
                </a>
                <a href={siteConfig.contact.resume} download className={`${buttonBase} contact-social-btn-resume`}>
                    <i className="nes-icon star is-large"></i>
                    <span className="ml-2">Resume</span>
                </a>
            </div>

            <p className="text-center nes-text is-primary">⭐️ Let's Innovate Together!</p>
            <p className="text-center">Feel free to reach out for collaborations, projects, or a chat about tech and interactive fun.</p>
        </section>
    )
}

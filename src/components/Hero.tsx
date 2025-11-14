import { siteConfig } from '@/config/site'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Hero({ day }: { day: boolean }) {
    const pathname = usePathname()
    const isHomePage = pathname === '/'

    return (
        <section id="hero" className={`nes-container with-title is-rounded bg-gray-200 ${day ? "" : "is-dark"} relative overflow-hidden`
        }>
            {!day && (
                <div className="absolute inset-0 pointer-events-none">
                    {/* Hero Shooting Stars */}
                    {[...Array(6)].map((_, i) => {
                        const startLeft = Math.random() * 100;
                        const endLeft = startLeft + 25;
                        return (
                            <motion.div
                                key={`hero-falling-${i}`}
                                className="absolute"
                                initial={{
                                    top: `${Math.random() * 40}%`,
                                    left: `${startLeft}%`,
                                    opacity: 0
                                }}
                                animate={{
                                    top: '100%',
                                    left: `${endLeft}%`,
                                    opacity: [0, 1, 1, 0]
                                }}
                                transition={{
                                    duration: 1.2 + Math.random() * 0.8,
                                    repeat: Infinity,
                                    delay: Math.random() * 10,
                                    ease: 'easeOut'
                                }}
                            >
                                <div className="w-px h-24 bg-gradient-to-b from-white via-white/90 to-transparent blur-sm shadow-lg"
                                     style={{ transform: 'rotate(45deg)' }} />
                            </motion.div>
                        );
                    })}
                </div>
            )}
            {isHomePage && <p className="title relative z-10">🎮 Welcome to my pixel-perfect portfolio.</p>}
            <div className='flex flex-col items-center space-y-4 relative z-10'>
                <div className="nes-badge">
                    <span className="is-primary">Full-Stack Developer</span>
                </div>
                <div className="relative flex justify-center">
                    <div className="text-8xl">
                        <i className="nes-mario block"></i>
                    </div>
                    <div className="absolute -bottom-2 -right-2">
                        <i className="nes-icon coin"></i>
                    </div>
                </div>
                <div className={`nes-balloon from-left ${day ? "" : "is-dark"}`}>
                    <p className="text-sm">{siteConfig.profile.summary}</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                    <i className="nes-icon heart"></i>
                    <span className="nes-text is-primary">AI & Machine Learning</span>
                    <i className="nes-icon star"></i>
                    <span className="nes-text is-success">Web Development</span>
                    <i className="nes-icon trophy"></i>
                    <span className="nes-text is-warning">Problem Solving</span>
                </div>
            </div>
        </section >
    )
}

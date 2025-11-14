import { siteConfig } from '@/config/site'
import { usePathname } from 'next/navigation'

export default function Hero({ day }: { day: boolean }) {
    const pathname = usePathname()
    const isHomePage = pathname === '/'

    return (
        <section id="hero" className={`nes-container with-title is-rounded bg-gray-200 ${day ? "" : "is-dark"}`
        }>
            {isHomePage && <p className="title">🎮 Welcome to my pixel-perfect portfolio.</p>}
            <div className='flex flex-col items-center space-y-4'>
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

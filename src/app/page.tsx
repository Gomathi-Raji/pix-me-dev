'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Hero from '@/components/Hero';
import PortalOverlay from '@/components/PortalOverlay';
import PortalQuickButton from '@/components/PortalQuickButton';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import MinecraftLayout from '@/components/MinecraftLayout';
import Loading from '@/components/Loading';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { loadIcon } from '@/helpers/iconLoader';
import TestimonialsMarquee from '../components/TestimonialsMarquee';

export default function Home() {
  // PortalToast removed — use the full-screen PortalOverlay instead
  const [day, setDay] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showPortalOverlay, setShowPortalOverlay] = useState(false);

  const portalDebug = (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug(...args);
    }
  };

  const backgroundStars = useMemo(
    () =>
      Array.from({ length: 80 }, () => {
        const sizeClass =
          Math.random() > 0.7
            ? 'w-1 h-1 opacity-30'
            : Math.random() > 0.4
              ? 'w-0.5 h-0.5 opacity-20'
              : 'w-px h-px opacity-15';

        return {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          sizeClass,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 4}s`,
        };
      }),
    []
  );

  const twinkleStars = useMemo(
    () =>
      Array.from({ length: 15 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: `${2 + Math.random() * 3}s`,
        delay: `${Math.random() * 4}s`,
      })),
    []
  );

  useEffect(() => {
    // Check if this is first visit or if cache expired
    if (typeof window !== 'undefined') {
      const hasEnteredPortal = localStorage.getItem('portalEntered');
      const lastEnterTime = localStorage.getItem('portalEnterTime');
      const currentTime = Date.now();
      const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
      
      // No automatic portal/page — use a toast instead.
      // If portal has never been entered, don't auto-redirect — we will
      // offer a toast instead. This avoids forced navigations.
      if (lastEnterTime) {
        const timeSinceEnter = currentTime - parseInt(lastEnterTime);
        if (timeSinceEnter >= CACHE_DURATION) {
          // Cache expired, clear and don't redirect (stay on home)
          localStorage.removeItem('portalEnterTime');
        }
      }

      // No automatic portal/showing — use the full PortalOverlay instead.
      // Show the PortalOverlay on first visit, or when TTL expired.
      const hidePortalUntil = Number(localStorage.getItem('hidePortalUntil') || 0);
      // If there is no portalEnterTime recorded (older state or lost timestamp),
      // treat it as expired so we can re-show the portal toast — this helps when
      // users entered before we started recording portalEnterTime.
      const lastEnterTimeNum = lastEnterTime ? parseInt(lastEnterTime) : 0;
      const shouldShowBecauseNotEntered = hasEnteredPortal !== 'true';
      const shouldShowBecauseExpired = lastEnterTimeNum === 0 || (currentTime - lastEnterTimeNum >= CACHE_DURATION);
      // Debug information to help trace why toast may not appear
      // (useful during development and tests)
      portalDebug('[Portal] show candidates', {
        hasEnteredPortal,
        lastEnterTime,
        currentTime,
        hidePortalUntil,
        shouldShowBecauseNotEntered,
        shouldShowBecauseExpired,
        willShow: Date.now() > hidePortalUntil && (shouldShowBecauseNotEntered || shouldShowBecauseExpired),
      });

      // If a user has never entered (first visit) then show the overlay as a
      // welcome. If the user has entered before and TTL expired, show toast
      // instead of overlay.
      if (Date.now() > hidePortalUntil && shouldShowBecauseNotEntered) {
        // Show overlay for first-time visitors as a welcome.
        // Do not mark portal as entered until user taps "EXPLORE MY WORK".
        portalDebug('[Portal] first visit - show overlay');
        setShowPortalOverlay(true);
      } else if (Date.now() > hidePortalUntil && shouldShowBecauseExpired) {
        // If TTL expired, show the overlay again instead of the toast
        // (user requested Portal overlay rather than the smaller toast)
        portalDebug('[Portal] TTL expired - showing overlay');
        setShowPortalOverlay(true);
      }
    }

    const hour = new Date().getHours();
    setDay(hour >= 6 && hour < 18);

    // Simulate loading time to show the animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Show loading for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  

  const handleDayChange = (isDay: boolean) => {
    setDay(isDay);
  };

  const handleEnterHome = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('portalEntered', 'true');
      localStorage.setItem('portalEnterTime', Date.now().toString());
    }
    // If we are showing the overlay on home, close it; navigation to solar
    // system is handled by PortalOverlay after onEnter is called.
    setShowPortalOverlay(false);
  };

  useEffect(() => {
    // If the overlay is shown, ensure no toast logic remains active
    if (showPortalOverlay) {
      // Nothing else — the overlay takes precedence
    }
  }, [showPortalOverlay]);

  const clearPortalState = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portalEntered');
      localStorage.removeItem('portalEnterTime');
      localStorage.removeItem('hidePortalUntil');
      localStorage.removeItem('showPortalAfterLanding');
      // Show the toast again immediately so QA can test
      setShowPortalOverlay(true);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <MinecraftLayout setDayOrNight={handleDayChange}>
      <div className="min-h-screen pt-20 relative">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none stars-background">
          {day ? (
            // No animations in light mode
            null
          ) : (
            <>
              {/* Subtle Background Stars for Night Mode */}
              {backgroundStars.map((s, i) => (
                <div
                  key={i}
                  className={`absolute bg-white rounded-full ${s.sizeClass} animate-pulse`}
                  style={{
                    top: s.top,
                    left: s.left,
                    animationDelay: s.animationDelay,
                    animationDuration: s.animationDuration,
                  }}
                />
              ))}
              {/* Twinkling stars with different sizes */}
              {twinkleStars.map((t, i) => (
                <div
                  key={`twinkle-${i}`}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-40"
                  style={{
                    top: t.top,
                    left: t.left,
                    animation: `twinkle ${t.duration} ease-in-out infinite`,
                    animationDelay: t.delay,
                  }}
                />
              ))}
            </>
          )}
        </div>

        <div className="relative z-10"><Hero day={day} /></div>
        {/* Show portal overlay in-place if we returned from Solar System */}
        {showPortalOverlay && (
          <div className="fixed inset-0 z-50">
            <PortalOverlay day={day} onEnter={handleEnterHome} />
          </div>
        )}
                
        {/* Stats Section */}
        <section className="py-12 px-4 relative z-10">
          {/* Portal toast shown at the end of layout so it's above other elements */}
          {/* PortalToast removed — we prefer the full PortalOverlay */}

          {/* Small quick button for opening the portal overlay (planet) - hide when overlay is open */}
          {!showPortalOverlay && (
            <PortalQuickButton onOpen={() => { setShowPortalOverlay(true); }} />
          )}
          <div className="max-w-6xl mx-auto">
            <div className="home-stats-grid grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className={`nes-container is-rounded text-center p-6 hover:scale-105 transition-transform duration-300 ${day ? 'bg-white' : 'is-dark'}`}>
                <div className="text-4xl mb-3 animate-float-delay-1">🚀</div>
                <div className="mobile-text-3xl text-3xl font-bold nes-text is-primary mb-1">12+</div>
                <div className="mobile-text-sm text-sm font-medium">Projects Completed</div>
              </div>
              <div className={`nes-container is-rounded text-center p-6 hover:scale-105 transition-transform duration-300 ${day ? 'bg-white' : 'is-dark'}`}>
                <div className="text-4xl mb-3 animate-float-delay-2">⚡</div>
                <div className="mobile-text-3xl text-3xl font-bold nes-text is-success mb-1">15+</div>
                <div className="mobile-text-sm text-sm font-medium">Technologies Mastered</div>
              </div>
              <div className={`nes-container is-rounded text-center p-6 hover:scale-105 transition-transform duration-300 ${day ? 'bg-white' : 'is-dark'}`}>
                <div className="text-4xl mb-3 animate-float-delay-3">🎓</div>
                <div className="mobile-text-3xl text-3xl font-bold nes-text is-warning mb-1">8.5</div>
                <div className="mobile-text-sm text-sm font-medium">Academic GPA</div>
              </div>
              <div className={`nes-container is-rounded text-center p-6 hover:scale-105 transition-transform duration-300 ${day ? 'bg-white' : 'is-dark'}`}>
                <div className="text-4xl mb-3 animate-float-delay-4">💼</div>
                <div className="mobile-text-3xl text-3xl font-bold nes-text is-error mb-1">2+</div>
                <div className="mobile-text-sm text-sm font-medium">Years Experience</div>
              </div>
            </div>
          </div>
        </section>
        {/* Projects Section */}
        <section id="projects" className="py-16 px-4 scroll-mt-20 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold mb-8 text-center nes-text is-primary">🚀 Featured Projects</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
            <div className="home-project-grid grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {siteConfig.projects.slice(0, 4).map((p) => (
                <div
                  key={p.name}
                  className={`home-project-card nes-container is-rounded with-title p-3 sm:p-4 flex flex-col justify-between h-full hover:shadow-2xl active:scale-95 transition-all duration-300 touch-manipulation cursor-pointer ${day ? 'bg-white text-gray-900' : 'is-dark text-gray-100'}`}
                >
                  {p.image && (
                    <img
                      src={p.image}
                      alt={`${p.name} Project Thumbnail`}
                      className="home-project-image w-full h-24 sm:h-32 object-cover rounded mb-3 sm:mb-4 pixelated hover:scale-105 transition-transform duration-200"
                    />
                  )}
                  <div className="flex-grow">
                    <p className="title mb-2 mobile-text-sm text-sm sm:text-base break-words">{p.name}</p>
                    <p className="mobile-text-xs text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">{p.description}</p>
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
                              style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '6px' }}
                            >
                              {tech}
                            </span>
                          );
                        })}
                        {p.technologies.length > 4 && (
                          <span className="home-tech-tag inline-block px-2 py-1 text-xs font-bold rounded bg-gray-500 text-white border-2 border-black" style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '6px' }}>
                            +{p.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="experience-links flex gap-2">
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nes-btn is-success is-small flex-1 text-center"
                      >
                        🌐 Live Demo
                      </a>
                    )}
                    {p.repoUrl && (
                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nes-btn is-primary is-small flex-1 text-center"
                      >
                        💻 GitHub
                      </a>
                    )}
                    {p.playStoreUrl && (
                      <a
                        href={p.playStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nes-btn is-warning is-small flex-1 text-center"
                      >
                        ⭐ View App
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/projects" className="nes-btn is-primary text-lg px-8 py-3 hover:scale-105 transition-transform">
                View All Projects
              </Link>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-16 px-4 scroll-mt-20 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold mb-8 text-center nes-text is-primary">⚡ Skills & Technologies</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-8 rounded-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {siteConfig.skills.slice(0, 3).map((skillGroup) => (
                <div key={skillGroup.title} className={`nes-container with-title is-rounded ${day ? '' : 'is-dark'}`}>
                  <p className="title">
                    <i className="nes-icon star"></i>
                    {skillGroup.title}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    {skillGroup.skills.slice(0, 6).map((skill) => {
                      const IconComponent = loadIcon(skill.library, skill.icon);
                      return (
                        <div key={skill.name} className="relative group border rounded-lg p-4 text-center flex-shrink-0 transition-transform transform hover:scale-110">
                          {IconComponent && React.createElement(IconComponent, { className: "w-12 h-12 mx-auto mb-2" })}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1">
                            {skill.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/skills" className="nes-btn is-primary text-lg px-8 py-3 hover:scale-105 transition-transform">
                View All Skills
              </Link>
            </div>
          </div>
        </section>

        {/* Work Experience Section */}
        <section id="experience" className="py-16 px-4 scroll-mt-20 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold mb-8 text-center nes-text is-primary">💼 Work Experience</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto mb-8 rounded-full"></div>
            <div className="space-y-6 mb-8">
              {siteConfig.work.slice(0, 2).map((experience, index) => (
                <div key={experience.position} className={`nes-container is-rounded ${day ? '' : 'is-dark'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="pixel-text text-sm text-yellow-400">
                      #{String(index + 1).padStart(2, '0')}
                    </p>
                    <span className="nes-badge">
                      <span className="is-warning">{experience.startDate} - {experience.endDate || 'Present'}</span>
                    </span>
                  </div>
                  <h3 className="pixel-text text-lg text-green-400 mb-2">{experience.position}</h3>
                  <p className="text-xs uppercase tracking-wide mb-2">{experience.company}</p>
                  <p className="text-sm mb-3 leading-relaxed">{experience.summary}</p>
                  {experience.tags && experience.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {experience.tags.map((tag, index) => (
                        <span key={index} className="nes-badge">
                          <span className="is-primary">{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}
                  <ul className="nes-list is-disc pl-6 space-y-1 text-xs">
                    {experience.highlights.slice(0, 2).map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/experience" className="nes-btn is-primary text-lg px-8 py-3 hover:scale-105 transition-transform">
                View All Experience
              </Link>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="py-16 px-2 sm:px-4 scroll-mt-20 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <Education day={day} />
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-r via-blue-500/5 rounded-lg"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className={`nes-container is-rounded p-8 shadow-2xl ${day ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'is-dark bg-gradient-to-r via-blue-500/5'}`}>
              <div className="mb-6">
                <span className="text-6xl animate-bounce">🚀</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 nes-text is-primary">Ready to Build Something Amazing?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                I'm passionate about AI, machine learning, and creating innovative solutions. 
                Let's collaborate on your next project or discuss exciting opportunities!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <a href="#contact" className={`nes-btn contact-cta-btn ${day ? '' : 'dark'} text-lg px-8 py-3 hover:scale-105 transition-transform`}>
                  💬 Let's Connect
                </a>
                <a href="#projects" className="nes-btn is-success text-lg px-8 py-3 hover:scale-105 transition-transform">
                  🎮 View My Work
                </a>
              </div>
              <div className="text-sm opacity-75">
                <p>💡 Open to projects • internships • collaborations • open-source contributions</p>
              </div>
            </div>
          </div>
        </section>

        <TestimonialsMarquee day={day} testimonials={siteConfig.testimonials} />

        {/* Contact Section */}
        <div className="relative z-10"><Contact day={day} /></div>
      </div>
    </MinecraftLayout>
  );
}

'use client';

import React from 'react';
import Hero from '@/components/Hero';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import MinecraftLayout from '@/components/MinecraftLayout';
import Loading from '@/components/Loading';
import { useState, useEffect } from 'react';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { loadIcon } from '@/helpers/iconLoader';

export default function Home() {
  const [day, setDay] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
              {[...Array(80)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute bg-white rounded-full ${
                    Math.random() > 0.7 ? 'w-1 h-1 opacity-30' :
                    Math.random() > 0.4 ? 'w-0.5 h-0.5 opacity-20' :
                    'w-px h-px opacity-15'
                  } animate-pulse`}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 4}s`,
                  }}
                />
              ))}
              {/* Twinkling stars with different sizes */}
              {[...Array(15)].map((_, i) => (
                <div
                  key={`twinkle-${i}`}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-40"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 4}s`,
                  }}
                />
              ))}
            </>
          )}
        </div>

        <div className="relative z-10"><Hero day={day} /></div>
        
        {/* Stats Section */}
        <section className="py-12 px-4 relative z-10">
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
                      <button
                        onClick={() => window.open(p.liveUrl, '_blank')}
                        className="nes-btn is-success is-small flex-1"
                      >
                        🌐 Live Demo
                      </button>
                    )}
                    {p.repoUrl && (
                      <button
                        onClick={() => window.open(p.repoUrl, '_blank')}
                        className="nes-btn is-primary is-small flex-1"
                      >
                        💻 GitHub
                      </button>
                    )}
                    {p.playStoreUrl && (
                      <button
                        onClick={() => window.open(p.playStoreUrl, '_blank')}
                        className="nes-btn is-warning is-small flex-1"
                      >
                        ⭐ View App
                      </button>
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
        <section id="education" className="py-16 px-4 scroll-mt-20 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <Education day={day} />
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-lg"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className={`nes-container is-rounded p-8 shadow-2xl ${day ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'is-dark bg-gradient-to-r from-gray-800 to-gray-700'}`}>
              <div className="mb-6">
                <span className="text-6xl animate-bounce">🚀</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 nes-text is-primary">Ready to Build Something Amazing?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                I'm passionate about AI, machine learning, and creating innovative solutions. 
                Let's collaborate on your next project or discuss exciting opportunities!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <a href="#contact" className="nes-btn is-primary text-lg px-8 py-3 hover:scale-105 transition-transform">
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

        {/* Contact Section */}
        <div className="relative z-10"><Contact day={day} /></div>
      </div>
    </MinecraftLayout>
  );
}

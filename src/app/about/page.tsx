'use client';

import { siteConfig } from '@/config/site';
import Education from '@/components/Education';
import Hero from '@/components/Hero';
import MinecraftLayout from '@/components/MinecraftLayout';
import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [day, setDay] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    setDay(hour >= 6 && hour < 18);
  }, []);

  const handleDayChange = (isDay: boolean) => {
    setDay(isDay);
  };

  return (
    <MinecraftLayout setDayOrNight={handleDayChange}>
      <div className="min-h-screen pt-20">
        <Hero day={day} />

        {/* Pixelated About Section */}
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Pixelated Header */}
            <div className={`education-header-container p-6 mb-12 rounded-lg ${day ? '' : 'is-dark'}`}>
              <div className="text-center">
                <h2 className="pixel-text text-4xl md:text-5xl text-yellow-400 mb-4">
                  🎮 ABOUT ME
                </h2>
                <div className="flex justify-center items-center gap-4">
                  <i className="nes-icon star is-large text-yellow-400"></i>
                  <p className="pixel-text text-green-400 text-lg">AI • ML • DATA INNOVATOR</p>
                  <i className="nes-icon trophy is-large text-yellow-400"></i>
                </div>
              </div>
            </div>

            {/* Profile Overview - Pixelated Style */}
            <div className={`nes-container with-title is-centered mb-16 ${day ? '' : 'is-dark'}`}>
              <p className="title">👋 PROFILE OVERVIEW</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed pixel-text">
                    {siteConfig.profile.summary}
                  </p>
                  <div className={`nes-container is-rounded ${day ? '' : 'is-dark'} education-info-card`}>
                    <p className="pixel-text text-center text-lg">
                      🚀 Ready to innovate and create amazing things!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className={`nes-container is-rounded ${day ? '' : 'is-dark'} education-info-card`}>
                    <div className="flex items-center space-x-4">
                      <div className="logo-icon-box">
                        <i className="nes-icon trophy is-large text-yellow-400"></i>
                      </div>
                      <div>
                        <p className="pixel-text text-yellow-400 font-bold">EDUCATION</p>
                        <p className="text-sm">{siteConfig.profile.education}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`nes-container is-rounded ${day ? '' : 'is-dark'} education-gpa-card`}>
                    <div className="flex items-center space-x-4">
                      <div className="logo-icon-box">
                        <i className="nes-icon heart is-large text-red-400"></i>
                      </div>
                      <div>
                        <p className="pixel-text text-green-400 font-bold">EXPERTISE</p>
                        <p className="text-sm">{siteConfig.profile.expertise}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`nes-container is-rounded ${day ? '' : 'is-dark'} education-desc-card`}>
                    <div className="flex items-center space-x-4">
                      <div className="logo-icon-box">
                        <i className="nes-icon star is-large text-blue-400"></i>
                      </div>
                      <div>
                        <p className="pixel-text text-purple-400 font-bold">FOCUS AREAS</p>
                        <p className="text-sm">{siteConfig.profile.focusAreas}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Expertise - Pixelated Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className={`nes-container with-title ${day ? '' : 'is-dark'}`}>
                <p className="title">🤝 COLLABORATIONS</p>
                <div className="space-y-4">
                  <p className="pixel-text">{siteConfig.profile.collaborations}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="pixel-text text-sm">Project Openness</span>
                      <span className="pixel-text text-sm text-green-400">90%</span>
                    </div>
                    <div className="nes-progress">
                      <progress className="nes-progress" value="90" max="100"></progress>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`nes-container with-title ${day ? '' : 'is-dark'}`}>
                <p className="title">🎮 HOBBIES & INTERESTS</p>
                <div className="space-y-4">
                  <p className="pixel-text">{siteConfig.profile.hobbies}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="nes-badge">
                      <span className="is-primary">🎮 Gaming</span>
                    </span>
                    <span className="nes-badge">
                      <span className="is-success">📚 Sci-fi</span>
                    </span>
                    <span className="nes-badge">
                      <span className="is-warning">💻 Coding</span>
                    </span>
                    <span className="nes-badge">
                      <span className="is-error">🚀 Space</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className={`nes-container with-title ${day ? '' : 'is-dark'}`}>
                <p className="title">🌟 PASSION LEVELS</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="pixel-text text-sm">AI & Machine Learning</p>
                      <span className="pixel-text text-sm text-blue-400">95%</span>
                    </div>
                    <div className="nes-progress">
                      <progress className="nes-progress" value="95" max="100"></progress>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="pixel-text text-sm">Data Science & Analytics</p>
                      <span className="pixel-text text-sm text-green-400">90%</span>
                    </div>
                    <div className="nes-progress">
                      <progress className="nes-progress" value="90" max="100"></progress>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="pixel-text text-sm">Innovation & Creativity</p>
                      <span className="pixel-text text-sm text-purple-400">88%</span>
                    </div>
                    <div className="nes-progress">
                      <progress className="nes-progress" value="88" max="100"></progress>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="mb-16">
              <Education />
            </div>

            {/* Fun Facts Section - Pixelated Style */}
            <div className={`nes-container with-title is-centered ${day ? '' : 'is-dark'}`}>
              <p className="title">🎯 FUN FACTS & BEYOND</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {siteConfig.profile.funFacts.map((fact, index) => (
                  <div
                    key={index}
                    className={`nes-container is-rounded ${day ? '' : 'is-dark'} education-gpa-card`}
                  >
                    <p className="pixel-text text-center font-medium">{fact}</p>
                  </div>
                ))}
              </div>

              {/* Call to Action - Pixelated Style */}
              <div className="mt-10">
                <div className={`nes-container is-rounded ${day ? '' : 'is-dark'} education-info-card`}>
                  <div className="text-center space-y-4">
                    <p className="pixel-text text-2xl text-yellow-400">
                      🌟 LET'S CONNECT & BUILD SOMETHING AMAZING!
                    </p>
                    <p className="pixel-text text-lg">
                      Whether it's AI projects, gaming innovations, or just a friendly chat about technology!
                    </p>
                    <div className="flex justify-center gap-4 mt-6">
                      <i className="nes-icon heart is-large text-red-400"></i>
                      <i className="nes-icon star is-large text-yellow-400"></i>
                      <i className="nes-icon trophy is-large text-green-400"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MinecraftLayout>
  );
}
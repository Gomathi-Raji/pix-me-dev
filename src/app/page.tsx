'use client';

import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import WorkExperience from '@/components/WorkExprience';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import MinecraftLayout from '@/components/MinecraftLayout';
import Loading from '@/components/Loading';
import { useState, useEffect } from 'react';

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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {day ? (
            <>
              <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute top-40 right-20 w-6 h-6 bg-green-400 rounded-full opacity-15 animate-bounce"></div>
              <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-purple-400 rounded-full opacity-25 animate-pulse"></div>
              <div className="absolute bottom-60 right-1/3 w-5 h-5 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
            </>
          ) : (
            <>
              {/* Additional Stars for Night Mode */}
              {[...Array(200)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </>
          )}
        </div>

        <Hero day={day} />
        
        {/* Stats Section */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className={`nes-container is-rounded text-center p-6 hover:scale-105 transition-transform duration-300 ${day ? 'bg-white' : 'is-dark'}`}>
                <div className="text-4xl mb-3 animate-float-delay-1">🚀</div>
                <div className="text-3xl font-bold nes-text is-primary mb-1">12+</div>
                <div className="text-sm font-medium">Projects Completed</div>
              </div>
              <div className={`nes-container is-rounded text-center p-6 hover:scale-105 transition-transform duration-300 ${day ? 'bg-white' : 'is-dark'}`}>
                <div className="text-4xl mb-3 animate-float-delay-2">⚡</div>
                <div className="text-3xl font-bold nes-text is-success mb-1">15+</div>
                <div className="text-sm font-medium">Technologies Mastered</div>
              </div>
              <div className={`nes-container is-rounded text-center p-6 hover:scale-105 transition-transform duration-300 ${day ? 'bg-white' : 'is-dark'}`}>
                <div className="text-4xl mb-3 animate-float-delay-3">🎓</div>
                <div className="text-3xl font-bold nes-text is-warning mb-1">8.5</div>
                <div className="text-sm font-medium">Academic GPA</div>
              </div>
              <div className={`nes-container is-rounded text-center p-6 hover:scale-105 transition-transform duration-300 ${day ? 'bg-white' : 'is-dark'}`}>
                <div className="text-4xl mb-3 animate-float-delay-4">💼</div>
                <div className="text-3xl font-bold nes-text is-error mb-1">2+</div>
                <div className="text-sm font-medium">Years Experience</div>
              </div>
            </div>
          </div>
        </section>
        {/* Projects Section */}
        <section id="projects" className="py-16 px-4 scroll-mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold mb-8 text-center nes-text is-primary">🚀 Featured Projects</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
            <Projects day={day} />
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-16 px-4 scroll-mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold mb-8 text-center nes-text is-primary">⚡ Skills & Technologies</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-8 rounded-full"></div>
            <Skills day={day} />
          </div>
        </section>

        {/* Work Experience Section */}
        <section id="experience" className="py-16 px-4 scroll-mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold mb-8 text-center nes-text is-primary">💼 Work Experience</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto mb-8 rounded-full"></div>
            <WorkExperience day={day} />
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="py-16 px-4 scroll-mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <Education />
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 relative">
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
        <Contact day={day} />
      </div>
    </MinecraftLayout>
  );
}

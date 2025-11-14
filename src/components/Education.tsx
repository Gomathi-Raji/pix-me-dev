import { siteConfig } from '@/config/site';

const Education = () => {
  if (!siteConfig.education || siteConfig.education.length === 0) {
    return null;
  }

  return (
    <section className="py-12 mb-12 pixelated">
      <div className="text-center mb-8">
        {/* Main Header with Pixelated NES Container */}
        <div className="nes-container is-rounded is-dark bg-gray-900 p-6 mb-4 max-w-2xl mx-auto education-header-container">
          <div className="flex items-center justify-center gap-4 mb-2">
            <i className="nes-icon trophy text-yellow-400 text-2xl"></i>
            <h3 className="pixel-text text-yellow-400 text-2xl md:text-3xl font-bold">EDUCATION JOURNEY</h3>
            <i className="nes-icon trophy text-yellow-400 text-2xl"></i>
          </div>
          <div className="flex justify-center gap-3">
            <i className="nes-icon star text-blue-400"></i>
            <i className="nes-icon heart text-red-400"></i>
            <i className="nes-icon like text-green-400"></i>
            <i className="nes-icon close text-purple-400"></i>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Enhanced Pixelated Timeline */}
        <div className="absolute left-8 top-0 bottom-0 w-3 bg-gradient-to-b from-yellow-400 via-blue-400 to-purple-400 hidden md:block education-timeline education-timeline-enhanced">
          {/* Timeline markers */}
          {siteConfig.education.map((_, index) => (
            <div
              key={index}
              className="absolute w-full h-2 bg-yellow-400 education-timeline-marker"
              style={{ top: `${(index * 100) / (siteConfig.education.length - 1)}%` }}
            />
          ))}
        </div>

        <div className="space-y-8">
          {siteConfig.education.map((edu, index) => (
            <div
              key={index}
              className="relative"
            >
              {/* Enhanced Timeline Dot */}
              <div className="absolute left-6 top-6 w-8 h-8 bg-yellow-400 rounded-full border-4 border-gray-800 hidden md:block education-timeline-dot">
                <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-900">{index + 1}</span>
                </div>
              </div>

              <div className="ml-0 md:ml-20">
                <div className="nes-container with-title is-rounded pixelated hover:shadow-2xl transition-all duration-300 education-card">
                  <p className="title flex items-center gap-3 pixel-text text-lg bg-gray-800 p-3 rounded">
                    <span className="text-3xl animate-bounce">🎓</span>
                    <span className="text-yellow-400 font-bold text-xl">{edu.degree}</span>
                    <div className="flex gap-1 ml-auto">
                      <i className="nes-icon star is-small text-yellow-400"></i>
                      <i className="nes-icon heart is-small text-red-400"></i>
                    </div>
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="nes-container is-rounded is-dark education-info-card">
                      <p className="nes-text text-blue-200">
                        <strong className="text-blue-400 flex items-center gap-2 pixel-text text-sm">
                          <i className="nes-icon home"></i>
                          INSTITUTION
                        </strong><br />
                        <span className="text-white font-bold text-lg pixel-text">{edu.institution}</span>
                      </p>
                    </div>
                    <div className="nes-container is-rounded is-dark education-info-card">
                      <p className="nes-text text-green-200">
                        <strong className="text-green-400 flex items-center gap-2 pixel-text text-sm">
                          <i className="nes-icon clock"></i>
                          YEAR
                        </strong><br />
                        <span className="text-white font-bold text-lg pixel-text">{edu.year}</span>
                      </p>
                    </div>
                  </div>

                  {edu.gpa && (
                    <div className="nes-container is-rounded mb-4 education-gpa-card border-4 border-yellow-500">
                      <div className="flex items-center justify-between p-2">
                        <div>
                          <p className="nes-text text-yellow-200 mb-1">
                            <strong className="text-yellow-400 flex items-center gap-2 pixel-text">
                              <i className="nes-icon star text-xl"></i>
                              GPA SCORE
                            </strong>
                          </p>
                          <span className="text-white font-bold text-2xl pixel-text">{edu.gpa}</span>
                        </div>
                        <div className="nes-progress w-40">
                          <progress
                            className="nes-progress"
                            value={parseFloat(edu.gpa) * 10}
                            max="100"
                          ></progress>
                        </div>
                      </div>
                    </div>
                  )}

                  {edu.description && (
                    <div className="nes-container is-rounded education-desc-card border-4 border-purple-500">
                      <p className="nes-text text-purple-200">
                        <strong className="text-purple-400 flex items-center gap-2 pixel-text text-sm mb-2">
                          <i className="nes-icon book text-lg"></i>
                          DESCRIPTION
                        </strong><br />
                        <span className="text-white pixel-text leading-relaxed">{edu.description}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
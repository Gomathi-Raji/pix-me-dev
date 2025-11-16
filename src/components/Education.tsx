import { siteConfig } from '@/config/site';

const Education = ({ day }: { day: boolean }) => {
  if (!siteConfig.education || siteConfig.education.length === 0) {
    return null;
  }

  return (
    <section className="py-4 sm:py-6 md:py-8 lg:py-12 mb-4 sm:mb-6 md:mb-8 lg:mb-12 pixelated px-2 sm:px-4">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        {/* Main Header with Pixelated NES Container */}
        <div className={`nes-container is-rounded p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 max-w-2xl mx-auto education-header-container touch-manipulation ${day ? 'bg-gray-200' : 'is-dark bg-gray-900'}`}>
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-2 flex-wrap">
            <span className={`text-lg sm:text-xl md:text-2xl ${day ? 'text-yellow-600' : 'text-yellow-400'}`}>🏆</span>
            <h3 className={`pixel-text text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold ${day ? 'text-yellow-600' : 'text-yellow-400'} text-center`}>EDUCATION JOURNEY</h3>
            <span className={`text-lg sm:text-xl md:text-2xl ${day ? 'text-yellow-600' : 'text-yellow-400'}`}>🏆</span>
          </div>
          <div className="flex justify-center gap-2 sm:gap-3">
            <span className="text-blue-400 text-sm sm:text-base">⭐</span>
            <span className="text-red-400 text-sm sm:text-base">❤️</span>
            <span className="text-green-400 text-sm sm:text-base">👍</span>
            <span className="text-purple-400 text-sm sm:text-base">❌</span>
          </div>
        </div>
      </div>

      <div className="relative px-2 sm:px-4">
        {/* Enhanced Pixelated Timeline - Hidden on mobile, visible on tablet+ */}
        <div className="absolute left-4 sm:left-6 md:left-8 top-0 bottom-0 w-1.5 sm:w-2 md:w-3 bg-gradient-to-b from-yellow-400 via-blue-400 to-purple-400 hidden sm:block education-timeline education-timeline-enhanced">
          {/* Timeline markers */}
          {siteConfig.education.map((_, index) => (
            <div
              key={index}
              className="absolute w-full h-1 sm:h-1.5 md:h-2 bg-yellow-400 education-timeline-marker rounded-full"
              style={{ top: `${(index * 100) / (siteConfig.education.length - 1)}%` }}
            />
          ))}
        </div>

        <div className="space-y-6 sm:space-y-8 md:space-y-10">
          {siteConfig.education.map((edu, index) => (
            <div
              key={index}
              className="relative"
            >
              {/* Enhanced Timeline Dot - Responsive sizing */}
              <div className="absolute left-1 sm:left-3 md:left-5 top-3 sm:top-4 md:top-6 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 bg-yellow-400 rounded-full border-2 sm:border-3 md:border-4 border-gray-800 hidden sm:flex items-center justify-center education-timeline-dot">
                <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-900">{index + 1}</span>
                </div>
              </div>

              <div className="ml-0 sm:ml-10 md:ml-14 lg:ml-18">
                <div className={`nes-container with-title is-rounded pixelated hover:shadow-2xl active:scale-95 transition-all duration-300 education-card touch-manipulation cursor-pointer ${day ? 'bg-white' : 'is-dark'}`}>
                  <div className="title flex items-center gap-2 sm:gap-3 pixel-text text-base sm:text-lg bg-gray-800 p-2 sm:p-3 rounded">
                    <span className="text-2xl sm:text-3xl animate-bounce">🎓</span>
                    <span className="text-yellow-400 font-bold text-sm sm:text-base md:text-lg lg:text-xl break-words leading-tight">{edu.degree}</span>
                    <div className="flex gap-1 ml-auto">
                      <i className="nes-icon star is-small text-yellow-400"></i>
                      <i className="nes-icon heart is-small text-red-400"></i>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4">
                    <div className={`nes-container is-rounded education-info-card touch-manipulation hover:scale-105 active:scale-95 transition-transform duration-200 ${day ? 'bg-white' : 'is-dark'}`}>
                      <p className={`nes-text ${day ? 'text-blue-600' : 'text-blue-200'}`}>
                        <strong className={`flex items-center gap-1 sm:gap-2 pixel-text text-xs sm:text-sm ${day ? 'text-blue-700' : 'text-blue-400'}`}>
                          <span className="text-sm sm:text-base">🏛️</span>
                          INSTITUTION
                        </strong><br />
                        <span className={`font-bold text-xs sm:text-sm md:text-base lg:text-lg pixel-text ${day ? 'text-gray-800' : 'text-white'} break-words leading-tight`}>{edu.institution}</span>
                      </p>
                    </div>
                    <div className={`nes-container is-rounded education-info-card touch-manipulation hover:scale-105 active:scale-95 transition-transform duration-200 ${day ? 'bg-white' : 'is-dark'}`}>
                      <p className={`nes-text ${day ? 'text-green-600' : 'text-green-200'}`}>
                        <strong className={`flex items-center gap-1 sm:gap-2 pixel-text text-xs sm:text-sm ${day ? 'text-green-700' : 'text-green-400'}`}>
                          <span className="text-sm sm:text-base">📅</span>
                          YEAR
                        </strong><br />
                        <span className={`font-bold text-xs sm:text-sm md:text-base lg:text-lg pixel-text ${day ? 'text-gray-800' : 'text-white'}`}>{edu.year}</span>
                      </p>
                    </div>
                    {edu.location && (
                      <div className={`nes-container is-rounded education-info-card touch-manipulation hover:scale-105 active:scale-95 transition-transform duration-200 ${day ? 'bg-white' : 'is-dark'}`}>
                        <p className={`nes-text ${day ? 'text-purple-600' : 'text-purple-200'}`}>
                          <strong className={`flex items-center gap-1 sm:gap-2 pixel-text text-xs sm:text-sm ${day ? 'text-purple-700' : 'text-purple-400'}`}>
                            <span className="text-sm sm:text-base">📍</span>
                            LOCATION
                          </strong><br />
                          <span className={`font-bold text-xs sm:text-sm md:text-base lg:text-lg pixel-text ${day ? 'text-gray-800' : 'text-white'} break-words leading-tight`}>{edu.location}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {edu.gpa && (
                    <div className={`nes-container is-rounded mb-4 education-gpa-card border-4 border-yellow-500 ${day ? 'bg-white' : 'is-dark'}`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 gap-3">
                        <div className="flex-1">
                          <p className="nes-text text-yellow-200 mb-1">
                            <strong className="text-yellow-400 flex items-center gap-2 pixel-text text-sm">
                              <span className="text-lg">⭐</span>
                              GPA SCORE
                            </strong>
                          </p>
                          <span className="text-white font-bold text-xl sm:text-2xl pixel-text">{edu.gpa}</span>
                        </div>
                        {(() => {
                          const gpaValue = edu.gpa.replace('%', '');
                          const numericValue = parseFloat(gpaValue);
                          return !isNaN(numericValue) ? (
                            <div className="nes-progress w-full sm:w-32 md:w-40">
                              <progress
                                className="nes-progress"
                                value={numericValue}
                                max="100"
                              ></progress>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  )}

                  {edu.description && (
                    <div className={`nes-container is-rounded education-desc-card border-4 border-purple-500 ${day ? 'bg-white' : 'is-dark'}`}>
                      <div className="nes-text text-purple-200">
                        <strong className="text-purple-400 flex items-center gap-2 pixel-text text-sm mb-3">
                          <span className="text-lg">📚</span>
                          HIGHLIGHTS
                        </strong>
                        <div className={`text-xs sm:text-sm md:text-base pixel-text leading-relaxed ${day ? 'text-gray-700' : 'text-white'}`}>
                          {edu.description.split('\n').map((line, idx) => (
                            <div key={idx} className="flex items-start gap-2 mb-2">
                              <span className="text-purple-400 mt-0.5">•</span>
                              <span>{line.replace('• ', '')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
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
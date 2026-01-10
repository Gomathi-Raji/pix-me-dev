import React from 'react';

export type Testimonial = {
  quote?: string;
  name: string;
  title?: string;
  href?: string;
  imageUrl?: string;
  praiseLine1?: string;
  praiseLine2?: string;
};

export default function TestimonialsMarquee({
  testimonials,
  day,
}: {
  testimonials: Testimonial[];
  day: boolean;
}) {
  if (!testimonials || testimonials.length === 0) return null;

  // Ensure we have enough items for a smooth marquee even with 1–3 quotes.
  const base = testimonials.length < 6 ? [...testimonials, ...testimonials] : testimonials;
  const trackItems = [...base, ...base];

  return (
    <section className="py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-center nes-text is-primary">🤝 Worked With</h2>
        <div
          className={`nes-container is-rounded p-4 ${day ? 'bg-white' : 'is-dark'}`}
          aria-label="Testimonials"
        >
          <div className="marquee">
            <div className="marquee-track">
              {trackItems.map((t, idx) => {
                const isAvatar = Boolean(t.imageUrl);

                const content = (
                  <div
                    className={`marquee-item nes-container is-rounded p-4 ${day ? 'bg-white' : 'is-dark'}`}
                  >
                    {isAvatar ? (
                      <div>
                        <div className="flex items-center gap-3">
                          <img
                            src={t.imageUrl}
                            alt={t.title ? `${t.name} — ${t.title}` : t.name}
                            className="w-12 h-12 rounded-full border-2 border-black object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{t.name}</p>
                            {t.title ? <p className="text-xs opacity-80 truncate">{t.title}</p> : null}
                          </div>
                        </div>

                        {(t.praiseLine1 || t.praiseLine2) && (
                          <div className="mt-3">
                            {t.praiseLine1 ? <p className="text-xs leading-relaxed">{t.praiseLine1}</p> : null}
                            {t.praiseLine2 ? <p className="text-xs leading-relaxed mt-1">{t.praiseLine2}</p> : null}
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {t.quote ? <p className="text-sm leading-relaxed">“{t.quote}”</p> : null}
                        <p className="text-xs mt-3 opacity-80">
                          — {t.name}
                          {t.title ? `, ${t.title}` : ''}
                        </p>
                      </>
                    )}
                  </div>
                );

                return (
                  <div key={`${t.name}-${idx}`}>
                    {t.href ? (
                      <a
                        href={t.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

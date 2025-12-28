'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Project } from '@/types/project';
import QRCode from 'qrcode';

type UiVariant = 'primary' | 'success' | 'warning' | 'error' | 'default';

type QuickFact = { label: string; value: string; variant: UiVariant };

function isVideoUrl(url: string) {
  return /(youtube\.com|youtu\.be|vimeo\.com)/i.test(url);
}

function toEmbedUrl(url: string) {
  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{6,})/);
  if (ytMatch?.[1]) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d{6,})/);
  if (vimeoMatch?.[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return url;
}

function getYouTubeId(url: string) {
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{6,})/);
  return ytMatch?.[1] ?? null;
}

function getVimeoId(url: string) {
  const vimeoMatch = url.match(/vimeo\.com\/(\d{6,})/);
  return vimeoMatch?.[1] ?? null;
}

function variantToNesClass(variant?: UiVariant) {
  switch (variant) {
    case 'primary':
      return 'is-primary';
    case 'success':
      return 'is-success';
    case 'warning':
      return 'is-warning';
    case 'error':
      return 'is-error';
    default:
      return 'is-dark text-white';
  }
}

function MediaThumbnail({
  item,
  active,
  onClick,
}: {
  item: NonNullable<Project['media']>[number];
  active: boolean;
  onClick: () => void;
}) {
  const src = (item as any).src as string;

  let thumbUrl: string | null = null;
  if (item.type === 'image') {
    thumbUrl = src;
  } else {
    const ytId = getYouTubeId(src);
    if (ytId) {
      thumbUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    } else {
      const vimeoId = getVimeoId(src);
      // Vimeo thumbnail requires an API call; fallback to a simple tile.
      thumbUrl = vimeoId ? null : null;
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-20 h-14 flex-shrink-0 border-2 ${active ? 'border-yellow-400' : 'border-white/30'} bg-black/40 rounded overflow-hidden`}
      aria-label={item.type === 'image' ? 'Show image' : 'Show video'}
      title={item.type === 'image' ? 'Image' : 'Video'}
    >
      {thumbUrl ? (
        <img src={thumbUrl} alt="" className="w-full h-full object-cover pixelated" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-xs">{item.type === 'video' ? 'VIDEO' : 'MEDIA'}</span>
        </div>
      )}
      {item.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-black/60 border border-white/40 flex items-center justify-center">
            <span className="text-xs">▶</span>
          </div>
        </div>
      )}
    </button>
  );
}

export default function ProjectModal({
  open,
  project,
  day,
  onClose,
}: {
  open: boolean;
  project: Project | null;
  day: boolean;
  onClose: () => void;
}) {
  const modalBodyRef = useRef<HTMLDivElement | null>(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const media = useMemo(() => {
    if (!project) return [];

    // If a project has no explicit media, fall back to its primary image.
    if (project.media?.length) return project.media;
    if (project.image) return [{ type: 'image' as const, src: project.image, alt: `${project.name} preview` }];
    return [];
  }, [project]);

  const videos = useMemo(() => media.filter((m) => m.type === 'video'), [media]);
  const images = useMemo(() => media.filter((m) => m.type === 'image'), [media]);

  const links = useMemo(() => {
    if (!project) return [];

    const derived: Array<{ label: string; url: string }> = [];
    if (project.liveUrl) derived.push({ label: 'Live Demo', url: project.liveUrl });
    if (project.repoUrl) derived.push({ label: 'GitHub Repo', url: project.repoUrl });
    if (project.playStoreUrl) derived.push({ label: 'Play Store', url: project.playStoreUrl });

    // Include any custom links, but avoid duplicates
    const custom = project.links ?? [];
    const all = [...derived, ...custom];
    const seen = new Set<string>();
    return all.filter((l) => {
      const key = `${l.label}|${l.url}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [project]);

  const quickFacts = useMemo<QuickFact[]>(() => {
    if (!project) return [];

    const year = String(new Date().getFullYear());
    const type = project.playStoreUrl ? 'Android App' : 'Web App';
    const status = project.liveUrl ? 'Live' : 'Stable';

    return [
      { label: 'Status', value: status, variant: 'success' },
      { label: 'Type', value: type, variant: 'primary' },
      { label: 'Role', value: 'Solo', variant: 'warning' },
      { label: 'Year', value: year, variant: 'default' },
    ];
  }, [project]);

  const qrUrl = useMemo(() => {
    if (!project) return null;
    return project.liveUrl ?? null;
  }, [project]);

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function generate() {
      if (!qrUrl) {
        setQrDataUrl(null);
        return;
      }

      try {
        const dataUrl = await QRCode.toDataURL(qrUrl, {
          width: 256,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: { dark: '#000000', light: '#ffffff' },
        });

        if (!cancelled) setQrDataUrl(dataUrl);
      } catch {
        if (!cancelled) setQrDataUrl(null);
      }
    }

    generate();
    return () => {
      cancelled = true;
    };
  }, [qrUrl]);

  useEffect(() => {
    if (!open) return;

    setActiveImageIndex(0);
    setActiveVideoIndex(0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // Reset modal internal scroll each time it opens
  useEffect(() => {
    if (!open) return;
    modalBodyRef.current?.scrollTo({ top: 0 });
  }, [open]);

  return (
    <AnimatePresence>
      {open && project && (
        <motion.div
          className="fixed inset-0 z-[9999] project-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} details`}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close project details"
            onClick={onClose}
            onWheel={(e) => {
              // Allow scrolling the page behind the modal while it's open
              if (e.deltaY) window.scrollBy({ top: e.deltaY });
            }}
            className="absolute inset-0 w-full h-full bg-black/70"
          />

          {/* Modal */}
          <div className="relative h-full w-full flex items-center justify-center p-3 sm:p-6">
            <motion.div
              ref={modalBodyRef}
              className={`relative w-full max-w-3xl max-h-[86vh] overflow-auto nes-container is-rounded with-title !p-2 sm:!p-4 ${
                day ? 'bg-gray-100 text-gray-900' : 'is-dark text-gray-100 !border-white'
              }`}
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <p className="title text-center sm:text-left text-xs sm:text-sm break-words">{project.name}</p>

              <button
                type="button"
                onClick={onClose}
                className="nes-btn is-error is-small absolute top-2 right-2 left-auto z-10"
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {/* Left Column: Preview + Demo stacked */}
                <div className="flex flex-col gap-3">
                  {/* Preview Section (Images) */}
                  <div
                    className={`nes-container is-rounded with-title !p-2 ${day ? '' : 'is-dark text-gray-100 !border-white'}`}
                  >
                    <p className="title text-xs leading-none">Preview</p>
                    <div className="space-y-2">
                      {images.length > 0 ? (
                        <>
                          <img
                            src={(images[activeImageIndex] as any).src}
                            alt={(images[activeImageIndex] as any).alt ?? `${project.name} image`}
                            className="w-full max-h-[26vh] object-contain rounded pixelated bg-black/10"
                          />
                          {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                              {images.map((img, idx) => (
                                <MediaThumbnail
                                  key={`image-${(img as any).src}-${idx}`}
                                  item={img}
                                  active={idx === activeImageIndex}
                                  onClick={() => setActiveImageIndex(idx)}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-32 flex items-center justify-center bg-black/10 rounded">
                          <p className="text-xs opacity-50">No preview images</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Demo Section (Video) - Always shown (placeholder if missing) */}
                  <div
                    className={`nes-container is-rounded with-title !p-2 ${day ? '' : 'is-dark text-gray-100 !border-white'}`}
                  >
                    <p className="title text-xs leading-none">Demo</p>
                    <div className="space-y-2">
                      {videos.length > 0 ? (
                        <>
                          {(() => {
                            const src = (videos[activeVideoIndex] as any).src as string;
                            const title = (videos[activeVideoIndex] as any).title as string | undefined;

                            if (isVideoUrl(src)) {
                              const embedUrl = toEmbedUrl(src);
                              return (
                                <div className="aspect-video w-full rounded overflow-hidden bg-black">
                                  <iframe
                                    className="w-full h-full"
                                    src={embedUrl}
                                    title={title ?? `${project.name} demo video`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              );
                            }

                            return (
                              <video className="w-full rounded bg-black" controls preload="metadata">
                                <source src={src} />
                                Your browser does not support the video tag.
                              </video>
                            );
                          })()}

                          {videos.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                              {videos.map((v, idx) => (
                                <MediaThumbnail
                                  key={`video-${(v as any).src}-${idx}`}
                                  item={v}
                                  active={idx === activeVideoIndex}
                                  onClick={() => setActiveVideoIndex(idx)}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="aspect-video w-full rounded bg-black/20 border border-white/20 flex items-center justify-center text-center px-4">
                          <div className="space-y-2">
                            <p className="text-xs nes-text is-warning">YouTube demo coming soon</p>
                            <p className="text-[10px] opacity-80">Add a YouTube URL in project media.</p>
                          </div>
                        </div>
                      )}

                      {/* Quick Facts + QR (fills whitespace below demo) */}
                      <div className="pt-2 mt-2 border-t border-white/20">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] opacity-80 mb-2">Quick Facts</p>
                            <div className="flex flex-wrap gap-2">
                              {quickFacts.map((f) => (
                                <span key={`${f.label}-${f.value}`} className="nes-badge">
                                  <span className={`${variantToNesClass(f.variant)} text-[10px] px-2 py-1`}>
                                    {f.label}: {f.value}
                                  </span>
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <p className="text-[10px] opacity-80">Scan to play</p>
                            <div
                              className={`nes-container is-rounded !p-1 ${day ? '' : 'is-dark text-gray-100 !border-white'} w-32 h-32 flex items-center justify-center`}
                              aria-label="Live demo QR code"
                            >
                              <div className="w-full h-full bg-white flex items-center justify-center p-2">
                                {!qrUrl ? (
                                  <p className="text-[10px] text-black/70 text-center">No live URL</p>
                                ) : qrDataUrl ? (
                                  <img
                                    src={qrDataUrl}
                                    alt="Live demo QR code"
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <p className="text-[10px] text-black/70 text-center">Generating…</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Details (border like Preview) */}
                <div
                  className={`nes-container is-rounded with-title !p-2 ${day ? '' : 'is-dark text-gray-100 !border-white'}`}
                >
                  <p className="title text-xs leading-none">Details</p>
                  <div className="flex flex-col gap-3">
                    {/* Description */}
                    <div>
                      <p className="text-xs sm:text-sm mb-2 nes-text is-primary">Briefing</p>
                      <p className="text-xs leading-relaxed opacity-90 text-justify">
                        {project.longDescription ?? project.description}
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <p className="text-xs sm:text-sm mb-2 nes-text is-success">Tech Stack</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(project.technologies ?? []).map((t) => (
                          <span key={t} className="nes-badge">
                            <span className="is-primary text-[10px] py-1 px-2">{t}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Links */}
                    {links.length ? (
                      <div>
                        <p className="text-xs sm:text-sm mb-2 nes-text is-warning">Access</p>
                        <div className="flex flex-col gap-2">
                          {links.map((l) => (
                            <button
                              key={`${l.label}-${l.url}`}
                              type="button"
                              onClick={() => window.open(l.url, '_blank')}
                              className={`nes-btn is-small w-full text-xs flex items-center justify-center gap-2 ${
                                l.label.toLowerCase().includes('demo')
                                  ? 'is-success'
                                  : l.label.toLowerCase().includes('repo')
                                    ? 'is-warning'
                                    : 'is-primary'
                              }`}
                            >
                              {l.label}
                              <span className="text-[10px]">↗</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

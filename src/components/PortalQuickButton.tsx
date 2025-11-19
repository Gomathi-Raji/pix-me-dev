'use client';

import React from 'react';

export default function PortalQuickButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      aria-label="Open portal"
      title="Open Portal"
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-[10000] w-12 h-12 rounded-sm bg-black bg-opacity-80 border-2 border-cyan-500 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform portal-quick-button"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Inline pixel-style planet icon */}
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="pixelated">
        <rect x="2" y="7" width="20" height="10" rx="2" fill="#111827" />
        <circle cx="12" cy="12" r="4" fill="#60A5FA" />
        <path d="M1 12C4 9 8 8 12 8s8 1 11 4c-3 3-7 4-11 4s-8-1-11-4z" fill="#FDE68A" />
        <path d="M2 16c4 1 8 1 10 1s6 0 10-1" stroke="#F87171" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}

'use client';

import WorkExprience from '@/components/WorkExprience';
import MinecraftLayout from '@/components/MinecraftLayout';
import { useState, useEffect } from 'react';

export default function ExperiencePage() {
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
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-center nes-text is-primary">Work Experience</h1>
            <p className="mt-3 text-center text-sm text-gray-600">
              Roles, responsibilities, and highlights from my journey.
            </p>
          </header>

          <WorkExprience day={day} />
        </div>
      </div>
    </MinecraftLayout>
  );
}
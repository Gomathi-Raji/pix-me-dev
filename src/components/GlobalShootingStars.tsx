'use client';

import { useEffect, useState } from 'react';

export default function GlobalShootingStars() {
    const [isNight, setIsNight] = useState(false);

    useEffect(() => {
        const checkTime = () => {
            const hour = new Date().getHours();
            setIsNight(hour >= 18 || hour < 6); // Night time: 6 PM to 6 AM
        };

        checkTime();
        const interval = setInterval(checkTime, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    // Only show in night mode
    if (!isNight) return null;

    return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
            {/* Footer area shooting stars only (bottom 20% of screen) */}
            {[...Array(8)].map((_, i) => (
                <span
                    key={`global-shooting-star-${i}`}
                    className="shooting-star"
                    style={{
                        top: `${80 + Math.random() * 20}%`, // Only in bottom 20% of screen
                        right: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 20}s`,
                        animationDuration: `${2 + Math.random() * 4}s`,
                    }}
                ></span>
            ))}
        </div>
    );
}
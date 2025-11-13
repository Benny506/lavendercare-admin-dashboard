import React, { useEffect, useRef, useState } from "react";

export default function Carousel({
    slides = [],
    interval = 4000,
    pauseOnHover = true,
    showArrows = true,
    showDots = true,
}) {
    console.log(slides)
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const timerRef = useRef(null);
    const total = slides.length;

    useEffect(() => {
        if (total <= 1) return;
        const next = () => setIndex((i) => (i + 1) % total);
        if (!paused) timerRef.current = setInterval(next, interval);
        return () => clearInterval(timerRef.current);
    }, [paused, interval, total]);

    if (total === 0) return null;

    const goTo = (i) => setIndex(i % total);
    const goPrev = () => goTo((index - 1 + total) % total);
    const goNext = () => goTo((index + 1) % total);

    return (
        <div
            className="relative w-full h-full overflow-hidden rounded-lg"
            onMouseEnter={() => pauseOnHover && setPaused(true)}
            onMouseLeave={() => pauseOnHover && setPaused(false)}
        >
            {/* Slides */}
            <div className="relative w-full h-full">
                {slides.map((item, i) => {
                    const isActive = i === index;
                    return (
                        <img
                            key={i}
                            src={item.src}
                            alt={item.alt || `Slide ${i + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                                }`}
                            draggable={false}
                        />
                    );
                })}
            </div>

            {showArrows && total > 1 && (
                <>
                    <button
                        onClick={goPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 px-3 py-2 rounded-full text-lg font-bold shadow-md transition-all duration-200"
                    >
                        ‹
                    </button>
                    <button
                        onClick={goNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 px-3 py-2 rounded-full text-lg font-bold shadow-md transition-all duration-200"
                    >
                        ›
                    </button>
                </>
            )}


            {/* Dots */}
            {showDots && total > 1 && (
                <div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex gap-2 z-20">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`w-3 h-3 rounded-full border border-white transition-all duration-300 focus:outline-none ${i === index
                                    ? 'bg-white scale-110 shadow-md'
                                    : 'bg-white/60 hover:bg-white/80'
                                }`}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}

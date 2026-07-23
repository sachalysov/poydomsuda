"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type HowItWorksStep = {
  step: string;
  title: string;
  desc: string;
};

function StepCard({ step, title, desc }: HowItWorksStep) {
  return (
    <div className="relative text-center px-2">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-600 text-white font-bold text-lg rounded-full mb-4 shadow-lg shadow-rose-900/30 dark:shadow-rose-900/60">
        {step}
      </div>
      <h3 className="text-lg font-bold text-text-soft mb-2 text-shadow-soft">{title}</h3>
      <p className="text-text-body text-sm leading-relaxed max-w-xs mx-auto text-shadow-soft">{desc}</p>
    </div>
  );
}

const TRANSITION_MS = 350;
const AUTOPLAY_MS = 4000;

function MobileCarousel({ steps }: { steps: HowItWorksStep[] }) {
  const n = steps.length;
  // [last clone, ...real, first clone] for seamless loop
  const slides = [steps[n - 1], ...steps, steps[0]];
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [dragX, setDragX] = useState(0);
  const [width, setWidth] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setWidth(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const goTo = useCallback((next: number) => {
    setAnimate(true);
    setIndex(next);
  }, []);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      setAnimate(true);
      setIndex((i) => i + 1);
    }, AUTOPLAY_MS);
  }, [stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  // After animating onto a clone, silently jump to the matching real slide
  useEffect(() => {
    if (index !== 0 && index !== n + 1) return;
    const id = window.setTimeout(() => {
      setAnimate(false);
      setIndex(index === 0 ? n : 1);
    }, TRANSITION_MS);
    return () => clearTimeout(id);
  }, [index, n]);

  // Re-enable transition after silent jump (next paint)
  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimate(true));
    });
    return () => cancelAnimationFrame(id);
  }, [animate, index]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    stopAutoplay();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setDragX(e.clientX - startX.current);
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const threshold = Math.min(48, width * 0.2);
    if (dragX < -threshold) goTo(index + 1);
    else if (dragX > threshold) goTo(index - 1);
    setDragX(0);
    startAutoplay();
  };

  const activeDot = ((index - 1) % n + n) % n;
  const offset = width > 0 ? -index * width + dragX : 0;

  return (
    <div className="relative">
      <div
        ref={viewportRef}
        className="overflow-hidden touch-pan-y select-none cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="flex will-change-transform"
          style={{
            width: width > 0 ? width * slides.length : undefined,
            transform: `translate3d(${offset}px, 0, 0)`,
            transition:
              animate && !dragging.current
                ? `transform ${TRANSITION_MS}ms ease-out`
                : "none",
          }}
        >
          {slides.map((item, i) => {
            const isClone = i === 0 || i === slides.length - 1;
            return (
              <div
                key={`${item.step}-${i}`}
                className="shrink-0"
                style={{ width: width > 0 ? width : "100%" }}
                aria-hidden={isClone || i !== index}
              >
                <StepCard {...item} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Шаги">
        {steps.map((item, i) => (
          <button
            key={item.step}
            type="button"
            role="tab"
            aria-selected={i === activeDot}
            aria-label={`Шаг ${item.step}`}
            onClick={() => {
              stopAutoplay();
              goTo(i + 1);
              startAutoplay();
            }}
            className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-full"
          >
            <span
              className={`block h-2.5 rounded-full transition-all duration-200 ${
                i === activeDot
                  ? "w-6 bg-rose-600"
                  : "w-2.5 bg-rose-600/30"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function HowItWorksSteps({ steps }: { steps: HowItWorksStep[] }) {
  return (
    <>
      <div className="md:hidden">
        <MobileCarousel steps={steps} />
      </div>
      <div className="hidden md:grid md:grid-cols-3 gap-10">
        {steps.map((item) => (
          <StepCard key={item.step} {...item} />
        ))}
      </div>
    </>
  );
}

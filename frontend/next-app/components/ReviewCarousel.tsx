"use client";

import { useEffect, useRef } from "react";
import { home, reviews } from "@/lib/content";

export function ReviewCarousel() {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const track = trackRef.current;
    if (!shell || !track) return;

    let visible = true;
    let frame = 0;
    let offset = 0;
    let last = performance.now();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) last = performance.now();
    });

    observer.observe(shell);

    function tick(now: number) {
      const delta = now - last;
      last = now;
      if (visible && track && shell) {
        const loopWidth = Math.max(track.scrollWidth / 2, shell.clientWidth, 1);
        offset = (offset + delta * 0.025) % loopWidth;
        track.style.transform = `translateX(-${offset}px)`;
      }
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">{home.reviews.eyebrow}</p>
            <h2>{home.reviews.title}</h2>
            <p className="muted">{home.reviews.subtitle}</p>
          </div>
        </div>
        <div className="review-shell" ref={shellRef}>
          <div className="review-track" ref={trackRef}>
            {[...reviews, ...reviews].map((review, index) => (
              <article className="review-card" key={`${review.name}-${index}`}>
                <p>"{review.text}"</p>
                <strong>{review.name}</strong>
                <p className="muted">{review.location}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

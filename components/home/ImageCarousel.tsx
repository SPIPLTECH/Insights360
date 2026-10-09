"use client";

import { useEffect, useState } from "react";

const IMAGES = ["/.banner1.png",  "/.img4.png", "/.25year.png"];

export default function ImageCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % IMAGES.length);
    }, 4500);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="carousel">
      {IMAGES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={`Vidarbha East highlight ${i + 1}`}
          className={`carousel-img ${i === active ? "is-active" : ""}`}
        />
      ))}

      <div className="carousel-dots">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === active ? "is-active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Show image ${i + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .carousel {
          position: relative;
          width: 100%;

          /* Same proportion as your 1413 × 255 banner */
          aspect-ratio: 1413 / 255;

          border-radius: 24px;
          overflow: hidden;
          background: #fff;
          border: 1px solid rgba(255, 61, 110, 0.2);
        }

        .carousel-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;

          /* Keeps the banner properly fitted */
          object-fit: cover;

          opacity: 0;
          transition: opacity 1.4s ease-in-out;
        }

        .carousel-img.is-active {
          opacity: 1;
        }

        .carousel-dots {
          position: absolute;
          left: 50%;
          bottom: 14px;
          transform: translateX(-50%);

          display: flex;
          gap: 10px;
          z-index: 5;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #fff;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          padding: 0;

          transition: all 0.25s ease;
        }

        .dot.is-active {
          background: linear-gradient(90deg, #ff7a2e, #ff3d6e);
          border-color: transparent;
          width: 26px;
          border-radius: 6px;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .carousel {
            border-radius: 14px;
            aspect-ratio: 1413 / 255;
          }

          .carousel-dots {
            bottom: 7px;
            gap: 6px;
          }

          .dot {
            width: 7px;
            height: 7px;
          }

          .dot.is-active {
            width: 18px;
          }
        }
      `}</style>
    </div>
  );
}
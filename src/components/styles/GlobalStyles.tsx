'use client';

export default function GlobalStyles() {
  return (
    <style jsx global>{`
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .shimmer-effect {
        background: linear-gradient(
          to right,
          #333 0%,
          #444 20%,
          #333 40%,
          #333 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite linear;
      }
      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
      .anime-row:hover .netflix-card {
        transform: translateX(-25%);
      }
      .netflix-card:hover ~ .netflix-card {
        transform: translateX(25%);
      }
      .netflix-card:hover {
        transform: scale(1.2) !important;
      }
    `}</style>
  );
} 
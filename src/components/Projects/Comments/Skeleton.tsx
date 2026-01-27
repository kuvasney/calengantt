import "./comments.scss";

export default function Skeleton() {
  return (
    <section className="comments">
      <div className="skeleton skeleton-title"></div>
      <ul className="comments__list">
        {[1, 2].map((i) => (
          <li key={i} className="comments__item">
            <div className="comments__author">
              <div className="skeleton skeleton-author-name"></div>
              <div className="skeleton skeleton-date"></div>
            </div>
            <div>
              <div className="skeleton skeleton-text-line"></div>
              <div className="skeleton skeleton-text-line-short"></div>
            </div>
          </li>
        ))}
      </ul>

      <style>{`
        .skeleton {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: loading 1.5s ease-in-out infinite;
          border-radius: 4px;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .skeleton-title {
          height: 24px;
          width: 120px;
          margin-bottom: 1rem;
        }

        .skeleton-author-name {
          height: 16px;
          width: 140px;
          display: inline-block;
          margin-right: 0.5rem;
        }

        .skeleton-date {
          height: 14px;
          width: 100px;
          display: inline-block;
        }

        .skeleton-text-line {
          height: 16px;
          width: 100%;
          margin-top: 0.5rem;
        }

        .skeleton-text-line-short {
          height: 16px;
          width: 75%;
          margin-top: 0.5rem;
        }
      `}</style>
    </section>
  );
}

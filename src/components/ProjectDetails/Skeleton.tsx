import "./ProjectDetails.scss";

export default function Skeleton() {
  return (
    <section className="project-details">
      <header className="project-header">
        <div className="project-title">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-badge"></div>
        </div>
        <div className="project-meta">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="meta-item">
              <div className="skeleton skeleton-label"></div>
              <div className="skeleton skeleton-value"></div>
            </div>
          ))}
        </div>
        <div className="skeleton skeleton-comments"></div>
      </header>

      <div className="steps-section">
        <div className="skeleton skeleton-section-title"></div>
        <div className="steps-timeline">
          {[1, 2, 3].map((i) => (
            <div key={i} className="step-card">
              <div className="step-header">
                <div className="skeleton skeleton-circle"></div>
                <div className="step-info" style={{ flex: 1 }}>
                  <div className="skeleton skeleton-step-name"></div>
                  <div className="skeleton skeleton-status"></div>
                </div>
              </div>

              <div className="step-dates">
                <div className="date-group">
                  <div className="skeleton skeleton-date-label"></div>
                  <div className="skeleton skeleton-date-range"></div>
                </div>
              </div>

              <div className="step-footer">
                <div className="skeleton skeleton-duration"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
          height: 32px;
          width: 250px;
          margin-bottom: 0.5rem;
        }

        .skeleton-badge {
          height: 24px;
          width: 60px;
        }

        .skeleton-label {
          height: 14px;
          width: 80px;
          margin-bottom: 0.5rem;
        }

        .skeleton-value {
          height: 18px;
          width: 150px;
        }

        .skeleton-comments {
          height: 100px;
          width: 100%;
          margin-top: 1rem;
        }

        .skeleton-section-title {
          height: 24px;
          width: 200px;
          margin-bottom: 1rem;
        }

        .skeleton-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .skeleton-step-name {
          height: 20px;
          width: 180px;
          margin-bottom: 0.5rem;
        }

        .skeleton-status {
          height: 24px;
          width: 120px;
        }

        .skeleton-date-label {
          height: 14px;
          width: 80px;
          margin-bottom: 0.5rem;
        }

        .skeleton-date-range {
          height: 18px;
          width: 200px;
        }

        .skeleton-duration {
          height: 18px;
          width: 100px;
        }
      `}</style>
    </section>
  );
}

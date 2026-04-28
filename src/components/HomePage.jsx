import React from 'react';

const roleCards = [
  {
    title: 'Admin Command Center',
    icon: '01',
    description: 'Launch drives, monitor transparency, and keep the emergency response pipeline moving.'
  },
  {
    title: 'Donor Supply Desk',
    icon: '02',
    description: 'List food, clothing, hygiene kits, and relief materials while tracking impact by campaign.'
  },
  {
    title: 'Recipient Help Queue',
    icon: '03',
    description: 'Submit requests for essentials, highlight urgency, and follow delivery progress clearly.'
  },
  {
    title: 'Logistics Control',
    icon: '04',
    description: 'Coordinate pickup, route dispatch, shipment status, and final delivery confirmation.'
  }
];

function HomePage({ onNavigate }) {
  return (
    <>
      <section className="home-page page-shell">
        <div className="home-hero glass-panel fade-in">
          <div className="home-hero__copy">
            <span className="eyebrow">Emergency Relief for Essentials</span>
            <h4 className="home-hero__title">Donating necessary items to people in need, with real operational structure.</h4>
            <p className="hero-copy">
              Care Connect helps teams organize food, clothing, shelter items, and emergency supplies across donation drives,
              recipient requests, and logistics movement without changing your existing backend or database.
            </p>

            <div className="home-hero__actions">
              <button className="primary-btn focus-outline" onClick={() => onNavigate('auth')}>
                Enter Role Workspace
              </button>
              <button className="ghost-btn focus-outline" onClick={() => onNavigate('about')}>
                Learn More
              </button>
            </div>

            <div className="home-hero__stats">
              <div className="section-card home-stat">
                <strong>4</strong>
                <span>Operational roles</span>
              </div>
              <div className="section-card home-stat">
                <strong>24/7</strong>
                <span>Emergency coordination</span>
              </div>
              <div className="section-card home-stat">
                <strong>Live</strong>
                <span>Drive, request, donation, shipment tracking</span>
              </div>
            </div>
          </div>

          <div className="home-hero__board section-card slide-in">
            <div className="ops-flow">
              <div>
                <small>Priority routing</small>
                <strong>Food | Clothing | Shelter | Medical</strong>
              </div>
              <div>
                <small>Transparency layer</small>
                <strong>Track every donation through delivery</strong>
              </div>
              <div>
                <small>Rapid response mode</small>
                <strong>Support flood, fire, cyclone, and local crisis drives</strong>
              </div>
            </div>
            <div className="ops-grid">
              <article>
                <span>Donors</span>
                <strong>List inventory</strong>
              </article>
              <article>
                <span>Recipients</span>
                <strong>Raise requests</strong>
              </article>
              <article>
                <span>Logistics</span>
                <strong>Dispatch shipments</strong>
              </article>
              <article>
                <span>Admin</span>
                <strong>See everything</strong>
              </article>
            </div>
          </div>
        </div>

        <div className="home-roles">
          {roleCards.map((card, index) => (
            <article
              key={card.title}
              className="section-card home-role slide-in"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="home-role__index">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>

        <div className="home-banner section-card">
          <div>
            <span className="eyebrow">Built for relief teams</span>
          </div>
          <button className="secondary-btn focus-outline" onClick={() => onNavigate('contact')}>
            Contact Operations
          </button>
        </div>
      </section>

      <style>{`
        .home-page {
          padding: 34px 0 48px;
        }

        .home-hero {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 28px;
          padding: 34px;
          border-radius: var(--radius-xl);
          background:
            radial-gradient(circle at top left, rgba(14, 165, 233, 0.18), transparent 26%),
            radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.18), transparent 24%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 255, 0.94));
          border: 1px solid rgba(37, 99, 235, 0.1);
        }

        .home-hero__copy {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .home-hero__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.2rem, 2vw, 1.5rem);
          line-height: 1.35;
          font-weight: 700;
          max-width: 760px;
          color: #172554;
        }

        .home-hero__actions,
        .home-hero__stats {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .home-stat {
          min-width: 170px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(239, 246, 255, 0.92));
          border: 1px solid rgba(14, 165, 233, 0.14);
        }

        .home-stat strong {
          font-size: 1.4rem;
          color: #1d4ed8;
        }

        .home-stat span {
          color: var(--text-soft);
        }

        .home-hero__board {
          padding: 24px;
          background:
            linear-gradient(180deg, rgba(59, 130, 246, 0.12), rgba(249, 115, 22, 0.08)),
            rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          gap: 18px;
          border: 1px solid rgba(59, 130, 246, 0.12);
        }

        .ops-flow {
          display: grid;
          gap: 12px;
        }

        .ops-flow div,
        .ops-grid article {
          padding: 14px 16px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(148, 163, 184, 0.18);
        }

        .ops-flow small,
        .ops-grid span {
          display: block;
          color: var(--text-faint);
          margin-bottom: 6px;
        }

        .ops-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .home-roles {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-top: 28px;
        }

        .home-role {
          padding: 24px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(250, 245, 255, 0.92));
          border: 1px solid rgba(168, 85, 247, 0.1);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .home-role:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 36px rgba(168, 85, 247, 0.12);
        }

        .home-role__index {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.16), rgba(37, 99, 235, 0.16));
          color: #7c3aed;
          font-family: 'Space Grotesk', sans-serif;
          margin-bottom: 18px;
        }

        .home-role h3 {
          margin-bottom: 10px;
        }

        .home-role p {
          color: var(--text-soft);
          line-height: 1.7;
        }

        .home-banner {
          margin: 28px 0 20px;
          padding: 26px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          background: linear-gradient(135deg, #0f766e, #2563eb 58%, #f97316);
          border-color: transparent;
        }

        .home-banner .eyebrow {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.18);
          color: white;
        }

        .home-banner .secondary-btn {
          background: white;
          color: #1d4ed8;
          box-shadow: none;
        }

        @media (max-width: 1024px) {
          .home-hero,
          .home-roles {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .home-page {
            padding-top: 18px;
          }

          .home-hero {
            padding: 20px;
          }

          .ops-grid {
            grid-template-columns: 1fr;
          }

          .home-banner {
            padding: 20px;
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}

export default HomePage;

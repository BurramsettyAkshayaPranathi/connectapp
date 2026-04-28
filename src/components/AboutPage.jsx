import React from 'react';

const workflow = [
  ['Admin', 'Creates emergency drives, monitors donor activity, reviews requests, and ensures delivery transparency.'],
  ['Donor', 'Lists supplies like food, clothing, hygiene kits, or shelter materials and follows status until distribution.'],
  ['Recipient', 'Requests essentials with quantity, urgency, and delivery location so support reaches the right household.'],
  ['Logistics Coordinator', 'Converts available inventory into dispatched shipments and tracks last-mile movement.']
];

function AboutPage() {
  return (
    <>
      <section className="about-page page-shell fade-in">
        <div className="about-head">
          <span className="eyebrow">Platform Overview</span>
          <h1 className="page-title">A donation platform designed to support relief work clearly and efficiently.</h1>
          <p className="page-copy">
            This platform is built for emergency response and day-to-day welfare drives. It helps organize donation intake,
            recipient need collection, transport coordination, and administrative oversight in one shared workflow.
          </p>
        </div>

        <div className="about-layout">
          <article className="section-card about-story">
            <h2>What the project solves</h2>
            <p>
              During floods, fires, storms, or local hardship, help often exists but coordination breaks down. Care Connect
              gives teams a structured workspace to match supplies with need and keep the process visible.
            </p>
            <p>
              Instead of treating donations as isolated entries, the platform supports the full flow: drive planning,
              donation listing, recipient requests, shipment tracking, and accountability reporting.
            </p>
          </article>

          <article className="section-card about-model">
            <h2>Role workflow</h2>
            <div className="about-model__grid">
              {workflow.map(([title, text]) => (
                <div key={title} className="about-model__item">
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <style>{`
        .about-page {
          padding: 34px 0 54px;
        }

        .about-head {
          max-width: 760px;
          margin-bottom: 26px;
        }

        .about-head h1 {
          font-size: clamp(2.2rem, 5vw, 4rem);
          margin: 18px 0 14px;
        }

        .about-layout {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 22px;
        }

        .about-story,
        .about-model {
          padding: 26px;
        }

        .about-story h2,
        .about-model h2 {
          margin-bottom: 14px;
          font-family: 'Space Grotesk', sans-serif;
        }

        .about-story p,
        .about-model__item p {
          color: var(--text-soft);
          line-height: 1.75;
        }

        .about-story p + p {
          margin-top: 14px;
        }

        .about-model__grid {
          display: grid;
          gap: 14px;
        }

        .about-model__item {
          padding: 16px 18px;
          border-radius: var(--radius-md);
          background: rgba(247, 242, 232, 0.88);
          border: 1px solid var(--line);
        }

        .about-model__item strong {
          display: block;
          margin-bottom: 8px;
        }

        @media (max-width: 900px) {
          .about-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

export default AboutPage;

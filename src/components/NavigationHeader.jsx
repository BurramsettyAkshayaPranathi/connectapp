import React from 'react';

function NavigationHeader({ currentPage, onNavigate, user, onLogout }) {
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'about', label: 'Operations Model' },
    { key: 'contact', label: 'Support' }
  ];

  return (
    <>
      <nav className="top-nav">
        <div className="page-shell top-nav__inner glass-panel">
          <button className="brand-mark focus-outline" onClick={() => onNavigate('home')}>
            <span className="brand-mark__badge">CC</span>
            <span>
              <strong>Care Connect</strong>
              <small>Relief Operations Platform</small>
            </span>
          </button>

          <div className="top-nav__links">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`top-nav__link focus-outline ${currentPage === item.key ? 'is-active' : ''}`}
                onClick={() => onNavigate(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="top-nav__actions">
            {user ? (
              <>
                <div className="top-nav__user">
                  <span>{user.name}</span>
                  <small>{String(user.role).toUpperCase()}</small>
                </div>
                <button className="ghost-btn focus-outline" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button className="primary-btn focus-outline" onClick={() => onNavigate('auth')}>
                Launch Workspace
              </button>
            )}
          </div>
        </div>
      </nav>

      <style>{`
        .top-nav {
          position: sticky;
          top: 0;
          z-index: 20;
          padding: 18px 0 0;
        }

        .top-nav__inner {
          border-radius: 999px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.94), rgba(240, 249, 255, 0.94));
          border: 1px solid rgba(37, 99, 235, 0.12);
        }

        .brand-mark {
          display: flex;
          align-items: center;
          gap: 12px;
          border: none;
          background: transparent;
          color: var(--text);
        }

        .brand-mark strong {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.05rem;
        }

        .brand-mark small {
          color: var(--text-faint);
          font-size: 0.76rem;
        }

        .brand-mark__badge {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: linear-gradient(135deg, #0f766e, #2563eb 55%, #f97316);
          color: white;
          font-weight: 800;
          box-shadow: 0 12px 28px rgba(37, 99, 235, 0.22);
        }

        .top-nav__links,
        .top-nav__actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .top-nav__link {
          border: none;
          background: transparent;
          color: var(--text-soft);
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 600;
        }

        .top-nav__link.is-active {
          background: linear-gradient(135deg, rgba(15, 118, 110, 0.14), rgba(37, 99, 235, 0.14));
          color: #0f4c81;
        }

        .top-nav__user {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .top-nav__user span {
          font-weight: 700;
        }

        .top-nav__user small {
          color: var(--text-faint);
          letter-spacing: 0.08em;
        }

        @media (max-width: 980px) {
          .top-nav__inner {
            border-radius: 28px;
            flex-wrap: wrap;
          }

          .top-nav__links {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }

          .top-nav__actions {
            margin-left: auto;
          }
        }

        @media (max-width: 640px) {
          .top-nav {
            padding-top: 10px;
          }

          .top-nav__inner {
            padding: 14px;
          }

          .top-nav__actions {
            width: 100%;
            justify-content: space-between;
          }

          .top-nav__user {
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}

export default NavigationHeader;

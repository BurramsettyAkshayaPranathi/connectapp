import React from 'react';

function DashboardShell({
  eyebrow,
  title,
  description,
  user,
  onLogout,
  modules,
  activeModule,
  onModuleChange,
  children,
  dashboardClassName = ''
}) {
  const activeModuleDetails = modules.find((module) => module.id === activeModule) || modules[0];

  return (
    <section className={`dashboard page-shell ${dashboardClassName}`.trim()}>
      <div className="dashboard-shell-layout">
        <aside className="dashboard-sidebar glass-panel">
          <div className="dashboard-sidebar__intro">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="page-title">{title}</h1>
            <p className="page-copy">{description}</p>
          </div>

          <div className="dashboard-sidebar__divider" />

          <nav className="dashboard-module-nav" aria-label="Dashboard modules">
            {modules.map((module) => (
              <button
                key={module.id}
                type="button"
                className={`dashboard-module-tab focus-outline ${activeModule === module.id ? 'is-active' : ''}`.trim()}
                onClick={() => onModuleChange(module.id)}
              >
                <span className="dashboard-module-tab__dot" aria-hidden="true" />
                <span className="dashboard-module-tab__label">{module.label}</span>
              </button>
            ))}
          </nav>

          <div className="dashboard-sidebar__footer section-card">
            <span className="dashboard-sidebar__footer-label">Focus</span>
            <p>{activeModuleDetails?.description || 'Move through the workspace modules.'}</p>
          </div>
        </aside>

        <div className="dashboard-module-content">
          <div className="dashboard-content-topbar">
            <div className="pill">{user.email}</div>
            <button className="ghost-btn focus-outline" onClick={onLogout}>Logout</button>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

export default DashboardShell;

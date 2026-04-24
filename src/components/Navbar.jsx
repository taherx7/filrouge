// components/Navbar.jsx
import { useState } from "react";

const styles = {
  navbar: {
    backgroundColor: '#1F4E79',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navTitle: { color: 'white', fontSize: '20px', fontWeight: 'bold' },
  navLinks: { display: 'flex', gap: '24px', alignItems: 'center' },
  navLink: { color: 'white', textDecoration: 'none', fontSize: '15px' },
  navLinkLogout: { color: '#FFEB9C', textDecoration: 'none', fontSize: '15px' },
  accountBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#2E75B6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  accountName: {
    color: 'white',
    fontSize: '15px',
    fontWeight: '500',
    marginRight: '8px'
  },
};

function Navbar() {
  return (
    <div style={styles.navbar}>
      <span style={styles.navTitle}>📋 Fil Rouge</span>

      {/* Right side */}
      <div style={styles.navLinks}>
        <div style={styles.accountBadge}>T</div>
        <span style={styles.accountName}>Taher</span>
        <a href="/projects" style={styles.navLink}>Projets</a>
        <a href="/tasks" style={styles.navLink}>Tâches</a>
        <a href="/assign" style={styles.navLink}>Affectation</a>
        <a href="/" style={styles.navLinkLogout}>Déconnexion</a>
      </div>
    </div>
  );
}

export default Navbar;
// components/Navbar.jsx
import { useState } from "react";

const styles = {
  navbar: {
    backgroundColor: '#1F4E79',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
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
  bellBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    position: 'relative',
    padding: '4px 8px',
    lineHeight: 1,
  },
  bellBadge: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    backgroundColor: '#B91C1C',
    color: 'white',
    fontSize: '10px',
    fontWeight: 'bold',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inboxDropdown: {
    position: 'absolute',
    top: '52px',
    left: '0',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    width: '320px',
    zIndex: 100,
    border: '1px solid #e0e7ef',
    overflow: 'hidden',
  },
  inboxHeader: {
    padding: '14px 18px',
    fontWeight: '700',
    fontSize: '14px',
    color: '#1F4E79',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f7f9fc',
  },
  inboxEmpty: {
    padding: '20px 18px',
    color: '#aaa',
    fontSize: '13px',
    textAlign: 'center'
  },
  inboxItem: {
    padding: '14px 18px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  inboxMeta: { display: 'flex', flexDirection: 'column', gap: '2px' },
  inboxDe: { fontSize: '13px', fontWeight: '600', color: '#333' },
  inboxProjet: { fontSize: '12px', color: '#777' },
  inboxActions: { display: 'flex', gap: '8px' },
  inboxBtn: {
    border: 'none',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    flex: 1,
  },
  inboxStatutBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
};

function Navbar({ inbox, pendingCount, repondreInbox, invitStatutStyle }) {
  const [inboxOpen, setInboxOpen] = useState(false);

  return (
    <div style={styles.navbar}>
      <span style={styles.navTitle}>📋 Fil Rouge</span>

      {/* 🔔 Inbox */}
      <div style={{ position: 'relative' }}>
        <button style={styles.bellBtn} onClick={() => setInboxOpen(!inboxOpen)}>
          🔔
          {pendingCount > 0 && (
            <span style={styles.bellBadge}>{pendingCount}</span>
          )}
        </button>

        {inboxOpen && (
          <div style={styles.inboxDropdown}>
            <div style={styles.inboxHeader}>Invitations reçues</div>

            {inbox.length === 0 && (
              <div style={styles.inboxEmpty}>Aucune invitation.</div>
            )}

            {inbox.map(inv => (
              <div key={inv.id} style={styles.inboxItem}>
                <div style={styles.inboxMeta}>
                  <span style={styles.inboxDe}>De : {inv.de}</span>
                  <span style={styles.inboxProjet}>📁 {inv.projet}</span>
                </div>

                {inv.statut === 'en attente' ? (
                  <div style={styles.inboxActions}>
                    <button
                      style={{ ...styles.inboxBtn, backgroundColor: '#C6EFCE', color: '#276221' }}
                      onClick={() => repondreInbox(inv.id, 'acceptée')}
                    >
                      Accepter
                    </button>

                    <button
                      style={{ ...styles.inboxBtn, backgroundColor: '#FFE0E0', color: '#B91C1C' }}
                      onClick={() => repondreInbox(inv.id, 'refusée')}
                    >
                      Refuser
                    </button>
                  </div>
                ) : (
                  <span
                    style={{
                      ...styles.inboxStatutBadge,
                      backgroundColor: invitStatutStyle(inv.statut).bg,
                      color: invitStatutStyle(inv.statut).text,
                    }}
                  >
                    {inv.statut}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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
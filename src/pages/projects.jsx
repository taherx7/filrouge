import { useState, useEffect } from 'react'

const currentUser = "taher"

function Projects() {
  const [projets, setProjets] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')

  const [inboxOpen, setInboxOpen] = useState(false)
  const [inbox, setInbox] = useState([
    { id: 1, de: 'prof@fsb.tn', projet: 'Fil Rouge', statut: 'en attente' },
  ])

  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then(res => res.json())
      .then(data => setProjets(data))
  }, [])

  const mesProjets = projets.filter(p => p.proprietaire === currentUser)
  const projetsCollabores = projets.filter(p => p.proprietaire !== currentUser)

  const pendingCount = inbox.filter(i => i.statut === 'en attente').length

  const repondreInbox = (id, reponse) => {
    setInbox(inbox.map(i => i.id === id ? { ...i, statut: reponse } : i))
  }

  const invitStatutStyle = (s) => {
    if (s === 'en attente') return { bg: '#FEF3C7', text: '#92400E' }
    if (s === 'acceptée') return { bg: '#C6EFCE', text: '#276221' }
    return { bg: '#FFE0E0', text: '#B91C1C' }
  }

  const handleAjouter = (e) => {
    e.preventDefault()
    if (!nom) return
    fetch("http://localhost:5000/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, description, proprietaire: currentUser })
    })
      .then(res => res.json())
      .then(newProject => {
        setProjets(prev => [...prev, newProject])
        setNom('')
        setDescription('')
        setShowForm(false)
      })
  }

  const statutColor = (statut) => {
    if (statut === 'En cours') return '#FFEB9C'
    if (statut === 'Terminé') return '#C6EFCE'
    return '#BDD7EE'
  }

  const statutTextColor = (statut) => {
    if (statut === 'En cours') return '#9C5700'
    if (statut === 'Terminé') return '#276221'
    return '#1F4E79'
  }

  const ProjetCard = ({ projet, showOwner }) => (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>{projet.nom}</h2>
        <span style={{
          ...styles.badge,
          backgroundColor: statutColor(projet.statut),
          color: statutTextColor(projet.statut),
        }}>
          {projet.statut}
        </span>
      </div>
      {showOwner && projet.proprietaire && (
        <span style={styles.ownerTag}>👤 {projet.proprietaire}</span>
      )}
      <p style={styles.cardDesc}>{projet.description}</p>
      <a href="/tasks" style={styles.btnVoir}>Voir les tâches →</a>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.inboxWrapper}>
        <button style={styles.bellBtn} onClick={() => setInboxOpen(!inboxOpen)}>
          🔔 Invitations
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
                    >Accepter</button>
                    <button
                      style={{ ...styles.inboxBtn, backgroundColor: '#FFE0E0', color: '#B91C1C' }}
                      onClick={() => repondreInbox(inv.id, 'refusée')}
                    >Refuser</button>
                  </div>
                ) : (
                  <span style={{
                    ...styles.inboxStatutBadge,
                    backgroundColor: invitStatutStyle(inv.statut).bg,
                    color: invitStatutStyle(inv.statut).text,
                  }}>
                    {inv.statut}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Mes projets</h2>
              <p style={styles.sectionSub}>Projets que vous avez créés et gérez vous-même</p>
            </div>
            <button style={styles.btnAjouter} onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Annuler' : '+ Nouveau Projet'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleAjouter} style={styles.form}>
              <input
                style={styles.input}
                type="text"
                placeholder="Nom du projet"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button style={styles.btnSubmit} type="submit">Créer le projet</button>
            </form>
          )}

          {mesProjets.length === 0 ? (
            <div style={styles.empty}>Aucun projet personnel. Créez-en un !</div>
          ) : (
            <div style={styles.grid}>
              {mesProjets.map(p => <ProjetCard key={p.id} projet={p} showOwner={false} />)}
            </div>
          )}
        </div>

        <div style={styles.divider} />

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Projets collaborés</h2>
              <p style={styles.sectionSub}>Projets auxquels vous avez été invité</p>
            </div>
          </div>

          {projetsCollabores.length === 0 ? (
            <div style={styles.empty}>Aucun projet collaboré pour l'instant.</div>
          ) : (
            <div style={styles.grid}>
              {projetsCollabores.map(p => <ProjetCard key={p.id} projet={p} showOwner={true} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f4f8', padding: '20px' },
  inboxWrapper: {
    maxWidth: '900px', margin: '0 auto 20px auto',
    display: 'flex', justifyContent: 'flex-end', position: 'relative'
  },
  bellBtn: {
    backgroundColor: 'white', border: '1px solid #ddd', cursor: 'pointer',
    fontSize: '14px', position: 'relative', padding: '8px 16px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', gap: '8px', color: '#1F4E79', fontWeight: 'bold'
  },
  bellBadge: {
    backgroundColor: '#B91C1C', color: 'white', fontSize: '10px', fontWeight: 'bold',
    width: '18px', height: '18px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  inboxDropdown: {
    position: 'absolute', top: '45px', right: '0', backgroundColor: 'white',
    borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    width: '320px', zIndex: 100, border: '1px solid #e0e7ef', overflow: 'hidden',
  },
  inboxHeader: {
    padding: '14px 18px', fontWeight: '700', fontSize: '14px',
    color: '#1F4E79', borderBottom: '1px solid #eee', backgroundColor: '#f7f9fc',
  },
  inboxEmpty: { padding: '20px 18px', color: '#aaa', fontSize: '13px', textAlign: 'center' },
  inboxItem: {
    padding: '14px 18px', borderBottom: '1px solid #f0f0f0',
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  inboxMeta: { display: 'flex', flexDirection: 'column', gap: '2px' },
  inboxDe: { fontSize: '13px', fontWeight: '600', color: '#333' },
  inboxProjet: { fontSize: '12px', color: '#777' },
  inboxActions: { display: 'flex', gap: '8px' },
  inboxBtn: {
    border: 'none', borderRadius: '8px', padding: '6px 14px',
    fontSize: '12px', fontWeight: '700', cursor: 'pointer', flex: 1,
  },
  inboxStatutBadge: {
    padding: '4px 12px', borderRadius: '20px',
    fontSize: '12px', fontWeight: '700', alignSelf: 'flex-start',
  },
  content: { maxWidth: '900px', margin: '0 auto' },
  section: { marginBottom: '8px' },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '20px',
  },
  sectionTitle: { color: '#1F4E79', margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700' },
  sectionSub: { margin: 0, fontSize: '13px', color: '#888' },
  divider: { borderTop: '2px dashed #d0dce8', margin: '36px 0' },
  btnAjouter: {
    backgroundColor: '#1F4E79', color: 'white', border: 'none',
    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', flexShrink: 0,
  },
  form: {
    backgroundColor: 'white', padding: '24px', borderRadius: '12px',
    marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' },
  btnSubmit: {
    backgroundColor: '#2E75B6', color: 'white', border: 'none',
    padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' },
  card: {
    backgroundColor: 'white', borderRadius: '12px', padding: '24px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '10px',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#1F4E79', margin: 0, fontSize: '18px' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  ownerTag: { fontSize: '12px', color: '#888' },
  cardDesc: { color: '#666', fontSize: '14px', margin: 0 },
  btnVoir: { color: '#2E75B6', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' },
  empty: {
    textAlign: 'center', color: '#999', padding: '32px', backgroundColor: 'white',
    borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', fontSize: '14px',
  },
}

export default Projects
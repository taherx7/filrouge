import { useState } from 'react'
import { useEffect } from 'react'

const CURRENT_USER_ID = 1



const membres = [
  { id: 1, nom: 'Taher', initiales: 'TH', couleur: '#1F4E79' },
  { id: 2, nom: 'Mohsen', initiales: 'MO', couleur: '#276221' },
  { id: 3, nom: 'Ali', initiales: 'AL', couleur: '#7B3F00' },
]

// ownerId: who created the project
const projetsInfo = {
  'Fil Rouge': { ownerId: 2 },   // created by Mohsen — Taher is a collaborator
  'Projet IA': { ownerId: 1 },   // created by Taher — he is the owner
}

const initialTaches = [
  { id: 1, titre: 'Maquettes UI/UX', projet: 'Fil Rouge', priorite: 'Haute', statut: 'En cours', assigneeId: 1 },
  { id: 2, titre: 'Développement API REST', projet: 'Fil Rouge', priorite: 'Haute', statut: 'À faire', assigneeId: null },
  { id: 3, titre: 'Rédaction user stories', projet: 'Fil Rouge', priorite: 'Moyenne', statut: 'Terminé', assigneeId: 2 },
  { id: 4, titre: 'Collecte du dataset', projet: 'Projet IA', priorite: 'Moyenne', statut: 'À faire', assigneeId: null },
  { id: 5, titre: 'Entraînement du modèle', projet: 'Projet IA', priorite: 'Basse', statut: 'À faire', assigneeId: 3 },
  { id: 6, titre: 'Tests unitaires', projet: 'Fil Rouge', priorite: 'Haute', statut: 'À faire', assigneeId: null },
]

function AssignTasks() {
  const [taches, setTaches] = useState([])
  const [filtreProjet, setFiltreProjet] = useState('Tous')
  const [filtreMembre, setFiltreMembre] = useState('Tous')
  const [toast, setToast] = useState(null)

  const [emailInvite, setEmailInvite] = useState('')
  const [projetInvite, setProjetInvite] = useState('Fil Rouge')
  const [invitations, setInvitations] = useState([
    { id: 1, email: 'sara@example.com', projet: 'Fil Rouge', statut: 'en attente' },
  ])

  const [projets, setProjets] = useState([])
  const projetsDisponibles = projets.filter(p => p !== 'Tous')


useEffect(() => {
  // LOAD TASKS
  fetch('http://localhost:5000/tasks')
    .then(res => res.json())
    .then(data => {
      const formattedTasks = data.map(t => ({
        id: t.id,
        titre: t.title,
        projet: t.projet,
        priorite: t.priority,
        statut: t.status,
        assigneeId:
          membres.find(m => m.nom === t.assigned_to)?.id || null
      }))
      setTaches(formattedTasks)
    })

  // LOAD PROJECTS
  fetch('http://localhost:5000/projects')
    .then(res => res.json())
    .then(data => {
      const noms = data.map(p => p.nom)
      setProjets(['Tous', ...noms])
    })

}, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const tachesFiltrees = taches.filter(t => {
    const okProjet = filtreProjet === 'Tous' || t.projet === filtreProjet
    const okMembre = filtreMembre === 'Tous'
      ? true
      : filtreMembre === 'Non assigné'
        ? t.assigneeId === null
        : t.assigneeId === Number(filtreMembre)
    return okProjet && okMembre
  })

const assigner = (tacheId, membreId) => {
  const membre = membres.find(m => m.id === membreId)

  fetch(`http://localhost:5000/tasks/${tacheId}/assign`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assignee: membre.nom })
  }).then(() => {
    setTaches(taches.map(t =>
      t.id === tacheId ? { ...t, assigneeId: membreId } : t
    ))
    showToast(`"${membre.nom}" assigné`)
  })
}

const meLAssigner = (tacheId) => {
  const me = membres.find(m => m.id === CURRENT_USER_ID)

  fetch(`http://localhost:5000/tasks/${tacheId}/assign`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assignee: me.nom })
  }).then(() => {
    setTaches(taches.map(t =>
      t.id === tacheId ? { ...t, assigneeId: CURRENT_USER_ID } : t
    ))
    showToast('Assignée à vous')
  })
}

const desassigner = (tacheId) => {
  fetch(`http://localhost:5000/tasks/${tacheId}/unassign`, {
    method: 'PUT'
  }).then(() => {
    setTaches(taches.map(t =>
      t.id === tacheId ? { ...t, assigneeId: null } : t
    ))
  })
}

  const getMembre = (id) => membres.find(m => m.id === id)

  const isOwner = (projetNom) => projetsInfo[projetNom]?.ownerId === CURRENT_USER_ID

  const handleInviter = (e) => {
  e.preventDefault()

  fetch('http://localhost:5000/invitations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: emailInvite,
      projet: projetInvite
    })
  }).then(() => {
    showToast(`Invitation envoyée à ${emailInvite}`)
    setEmailInvite('')
  })
}

  const annulerInvitation = (id) => setInvitations(invitations.filter(i => i.id !== id))

  const statutColor = (s) => {
    if (s === 'En cours') return { bg: '#FFEB9C', text: '#9C5700' }
    if (s === 'Terminé') return { bg: '#C6EFCE', text: '#276221' }
    return { bg: '#BDD7EE', text: '#1F4E79' }
  }

  const prioriteColor = (p) => {
    if (p === 'Haute') return { bg: '#FFE0E0', text: '#B91C1C' }
    if (p === 'Basse') return { bg: '#E0F2E9', text: '#166534' }
    return { bg: '#FEF3C7', text: '#92400E' }
  }

  const invitStatutStyle = (s) => {
    if (s === 'en attente') return { bg: '#FEF3C7', text: '#92400E' }
    if (s === 'acceptée') return { bg: '#C6EFCE', text: '#276221' }
    return { bg: '#FFE0E0', text: '#B91C1C' }
  }

  const chargeParMembre = membres.map(m => ({
    ...m,
    count: taches.filter(t => t.assigneeId === m.id).length,
  }))

  const nonAssignees = taches.filter(t => t.assigneeId === null).length

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <h1 style={styles.title}>Affectation des tâches</h1>
          {nonAssignees > 0 && (
            <span style={styles.alertBadge}>
              {nonAssignees} tâche{nonAssignees > 1 ? 's' : ''} non assignée{nonAssignees > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* CHARGE PAR MEMBRE */}
        <div style={styles.chargeGrid}>
          {chargeParMembre.map(m => (
            <div key={m.id} style={styles.chargeCard}>
              <div style={{ ...styles.avatar, backgroundColor: m.couleur }}>{m.initiales}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.chargeName}>{m.nom}</div>
                <div style={styles.chargeCount}>{m.count} tâche{m.count !== 1 ? 's' : ''}</div>
                <div style={styles.chargebar}>
                  <div style={{ ...styles.chargebarFill, width: `${Math.min(m.count * 25, 100)}%`, backgroundColor: m.couleur }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INVITER */}
        <div style={styles.inviteSection}>
          <div style={styles.inviteSectionHeader}>
            <h2 style={styles.inviteTitle}>Inviter un collaborateur</h2>
            <p style={styles.inviteSub}>L'invitation sera envoyée dans la boîte de réception du destinataire.</p>
          </div>
          <form onSubmit={handleInviter} style={styles.inviteForm}>
            <input style={styles.inviteInput} type="email" placeholder="Email du collaborateur" value={emailInvite} onChange={e => setEmailInvite(e.target.value)} />
            <select style={styles.inviteSelect} value={projetInvite} onChange={e => setProjetInvite(e.target.value)}>
              {projetsDisponibles.map(p => <option key={p}>{p}</option>)}
            </select>
            <button style={styles.inviteBtn} type="submit">Envoyer l'invitation</button>
          </form>
          {invitations.length > 0 && (
            <div style={styles.inviteList}>
              <div style={styles.inviteListTitle}>Invitations envoyées</div>
              {invitations.map(inv => {
                const s = invitStatutStyle(inv.statut)
                return (
                  <div key={inv.id} style={styles.inviteRow}>
                    <span style={styles.inviteEmail}>✉️ {inv.email}</span>
                    <span style={styles.inviteProjetTag}>📁 {inv.projet}</span>
                    <span style={{ ...styles.inviteStatut, backgroundColor: s.bg, color: s.text }}>{inv.statut}</span>
                    {inv.statut === 'en attente' && (
                      <button style={styles.annulerBtn} onClick={() => annulerInvitation(inv.id)}>Annuler</button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* LÉGENDE */}
        <div style={styles.legendeRow}>
          <span style={styles.legendeItem}><span style={{ ...styles.legendeDot, backgroundColor: '#2E75B6' }} /> Projet dont vous êtes propriétaire → assignez librement</span>
          <span style={styles.legendeItem}><span style={{ ...styles.legendeDot, backgroundColor: '#7B3F00' }} /> Projet collaboré → prenez une tâche pour vous</span>
        </div>

        {/* FILTRES */}
        <div style={styles.filtresRow}>
          <div style={styles.filtreGroup}>
            <label style={styles.filtreLabel}>Projet</label>
            <select style={styles.select} value={filtreProjet} onChange={e => setFiltreProjet(e.target.value)}>
              {projets.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={styles.filtreGroup}>
            <label style={styles.filtreLabel}>Membre</label>
            <select style={styles.select} value={filtreMembre} onChange={e => setFiltreMembre(e.target.value)}>
              <option value="Tous">Tous</option>
              <option value="Non assigné">Non assigné</option>
              {membres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
            </select>
          </div>
        </div>

        {/* TABLEAU */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Tâche</th>
                <th style={styles.th}>Projet</th>
                <th style={styles.th}>Priorité</th>
                <th style={styles.th}>Statut</th>
                <th style={styles.th}>Assigné à</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tachesFiltrees.map(tache => {
                const s = statutColor(tache.statut)
                const p = prioriteColor(tache.priorite)
                const membre = getMembre(tache.assigneeId)
                const owner = isOwner(tache.projet)
                const isMe = tache.assigneeId === CURRENT_USER_ID

                return (
                  <tr key={tache.id} style={{
                    ...styles.tr,
                    borderLeft: `3px solid ${owner ? '#2E75B6' : '#7B3F00'}`,
                  }}>
                    <td style={styles.td}>
                      <span style={{ color: '#1F4E79', fontWeight: '600', fontSize: '14px' }}>{tache.titre}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontSize: '13px', color: '#555' }}>📁 {tache.projet}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: p.bg, color: p.text }}>{tache.priorite}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: s.bg, color: s.text }}>{tache.statut}</span>
                    </td>
                    <td style={styles.td}>
                      {membre ? (
                        <div style={styles.membreCell}>
                          <div style={{ ...styles.avatarSm, backgroundColor: membre.couleur }}>{membre.initiales}</div>
                          <span style={{ fontSize: '14px' }}>{membre.nom}</span>
                        </div>
                      ) : (
                        <span style={styles.nonAssigne}>— non assigné</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {owner ? (
                        // OWNER: full dropdown to assign anyone
                        <select
                          style={styles.selectAssign}
                          value={tache.assigneeId || ''}
                          onChange={e => {
                            const val = e.target.value
                            if (val === '') desassigner(tache.id)
                            else assigner(tache.id, Number(val))
                          }}
                        >
                          <option value="">— Choisir</option>
                          {membres.map(m => (
                            <option key={m.id} value={m.id}>{m.nom}</option>
                          ))}
                        </select>
                      ) : (
                        // COLLABORATOR: can only take the task for themselves
                        isMe ? (
                          <div style={styles.assignedToMeCell}>
                            <span style={styles.assignedToMeLabel}>✓ Assignée à moi</span>
                            <button style={styles.desassignerBtn} onClick={() => desassigner(tache.id)}>
                              Libérer
                            </button>
                          </div>
                        ) : tache.assigneeId !== null ? (
                          <span style={styles.assignedOther}>Assignée à {getMembre(tache.assigneeId)?.nom}</span>
                        ) : (
                          <button style={styles.meLAssignerBtn} onClick={() => meLAssigner(tache.id)}>
                            + Me l'assigner
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                )
              })}
              {tachesFiltrees.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#999', fontSize: '14px' }}>
                    Aucune tâche trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
  content: { maxWidth: '960px', margin: '0 auto', padding: '32px 16px' },
  pageHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  title: { color: '#1F4E79', margin: 0 },
  alertBadge: {
    backgroundColor: '#FFE0E0', color: '#B91C1C',
    padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700',
  },
  chargeGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px', marginBottom: '24px',
  },
  chargeCard: {
    backgroundColor: 'white', borderRadius: '12px', padding: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
    display: 'flex', alignItems: 'center', gap: '12px',
  },
  avatar: {
    width: '38px', height: '38px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: 'bold', fontSize: '13px', flexShrink: 0,
  },
  chargeName: { fontWeight: '600', fontSize: '14px', color: '#1F4E79' },
  chargeCount: { fontSize: '12px', color: '#777', marginBottom: '4px' },
  chargebar: { width: '100%', height: '5px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' },
  chargebarFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s' },
  inviteSection: {
    backgroundColor: 'white', borderRadius: '12px', padding: '24px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)', marginBottom: '24px',
  },
  inviteSectionHeader: { marginBottom: '16px' },
  inviteTitle: { color: '#1F4E79', margin: '0 0 4px 0', fontSize: '17px', fontWeight: '700' },
  inviteSub: { margin: 0, fontSize: '13px', color: '#888' },
  inviteForm: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' },
  inviteInput: {
    flex: 2, minWidth: '200px', padding: '10px 14px',
    borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px',
  },
  inviteSelect: {
    flex: 1, minWidth: '140px', padding: '10px 14px',
    borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px',
    backgroundColor: 'white', color: '#1F4E79',
  },
  inviteBtn: {
    backgroundColor: '#1F4E79', color: 'white', border: 'none',
    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap',
  },
  inviteList: { borderTop: '1px solid #eee', paddingTop: '16px' },
  inviteListTitle: { fontSize: '12px', fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' },
  inviteRow: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 0', borderBottom: '1px solid #f5f5f5', flexWrap: 'wrap',
  },
  inviteEmail: { fontSize: '14px', color: '#333', flex: 1, minWidth: '160px' },
  inviteProjetTag: { fontSize: '13px', color: '#777' },
  inviteStatut: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  annulerBtn: {
    background: 'none', border: '1px solid #ddd', borderRadius: '8px',
    padding: '4px 12px', fontSize: '12px', color: '#999', cursor: 'pointer',
  },
  legendeRow: {
    display: 'flex', gap: '24px', flexWrap: 'wrap',
    marginBottom: '16px', fontSize: '13px', color: '#555',
  },
  legendeItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  legendeDot: { width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block', flexShrink: 0 },
  filtresRow: { display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' },
  filtreGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
  filtreLabel: { fontSize: '12px', color: '#777', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
  select: {
    padding: '8px 14px', borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '14px', backgroundColor: 'white', cursor: 'pointer', color: '#1F4E79',
  },
  tableWrapper: {
    backgroundColor: 'white', borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)', overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f7f9fc' },
  th: {
    padding: '13px 16px', textAlign: 'left', fontSize: '12px',
    color: '#777', fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: '0.05em', borderBottom: '1px solid #eee',
  },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '14px 16px', verticalAlign: 'middle' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  membreCell: { display: 'flex', alignItems: 'center', gap: '8px' },
  avatarSm: {
    width: '28px', height: '28px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: 'bold', fontSize: '11px', flexShrink: 0,
  },
  nonAssigne: { color: '#aaa', fontSize: '13px', fontStyle: 'italic' },
  selectAssign: {
    padding: '7px 12px', borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '13px', backgroundColor: '#f7f9fc', cursor: 'pointer',
    color: '#1F4E79', fontWeight: '600',
  },
  meLAssignerBtn: {
    backgroundColor: '#EEF4FB', color: '#1F4E79',
    border: '1.5px solid #2E75B6', borderRadius: '8px',
    padding: '6px 14px', fontSize: '13px', fontWeight: '700',
    cursor: 'pointer', whiteSpace: 'nowrap',
  },
  assignedToMeCell: { display: 'flex', alignItems: 'center', gap: '8px' },
  assignedToMeLabel: { fontSize: '13px', color: '#276221', fontWeight: '600' },
  desassignerBtn: {
    background: 'none', border: '1px solid #ddd', borderRadius: '8px',
    padding: '4px 10px', fontSize: '12px', color: '#999', cursor: 'pointer',
  },
  assignedOther: { fontSize: '13px', color: '#aaa', fontStyle: 'italic' },
  toast: {
    position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
    backgroundColor: '#1F4E79', color: 'white',
    padding: '12px 28px', borderRadius: '24px',
    fontSize: '14px', fontWeight: '600',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 999,
  },
}

export default AssignTasks
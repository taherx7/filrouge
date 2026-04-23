import { useState } from 'react'

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

const prioriteColor = (priorite) => {
  if (priorite === 'Haute') return { bg: '#FFE0E0', text: '#B91C1C' }
  if (priorite === 'Basse') return { bg: '#E0F2E9', text: '#166534' }
  return { bg: '#FEF3C7', text: '#92400E' }
}

function TaskCard({ tache, onChangerStatut, onSupprimer }) {
  const p = prioriteColor(tache.priorite)
  return (
    <div style={styles.card}>
      <div style={styles.cardLeft}>
        <button
          style={{
            ...styles.checkBtn,
            backgroundColor: tache.statut === 'Terminé' ? '#C6EFCE' : 'white',
            borderColor: tache.statut === 'Terminé' ? '#276221' : '#ddd',
            color: tache.statut === 'Terminé' ? '#276221' : '#ccc',
          }}
          onClick={() => onChangerStatut(tache.id)}
          title="Changer le statut"
        >
          {tache.statut === 'Terminé' ? '✓' : tache.statut === 'En cours' ? '▶' : '○'}
        </button>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.cardTop}>
          <span style={{
            ...styles.cardTitre,
            textDecoration: tache.statut === 'Terminé' ? 'line-through' : 'none',
            color: tache.statut === 'Terminé' ? '#999' : '#1F4E79',
          }}>
            {tache.titre}
          </span>
          <div style={styles.badges}>
            <span style={{ ...styles.badge, backgroundColor: p.bg, color: p.text }}>
              {tache.priorite}
            </span>
            <span style={{
              ...styles.badge,
              backgroundColor: statutColor(tache.statut),
              color: statutTextColor(tache.statut),
            }}>
              {tache.statut}
            </span>
          </div>
        </div>
        <div style={styles.cardMeta}>
          {tache.projet && <span style={styles.metaTag}>📁 {tache.projet}</span>}
          {tache.assignee && <span style={styles.metaTag}>👤 {tache.assignee}</span>}
        </div>
      </div>

      {onSupprimer && (
        <button
          style={styles.deleteBtn}
          onClick={() => onSupprimer(tache.id)}
          title="Supprimer"
        >
          ✕
        </button>
      )}
    </div>
  )
}

function SectionFiltres({ taches, filtre, setFiltre }) {
  const counts = {
    'Tous': taches.length,
    'À faire': taches.filter(t => t.statut === 'À faire').length,
    'En cours': taches.filter(t => t.statut === 'En cours').length,
    'Terminé': taches.filter(t => t.statut === 'Terminé').length,
  }
  return (
    <div style={styles.filtres}>
      {['Tous', 'À faire', 'En cours', 'Terminé'].map(f => (
        <button
          key={f}
          onClick={() => setFiltre(f)}
          style={{
            ...styles.filtreBtn,
            backgroundColor: filtre === f ? '#1F4E79' : 'white',
            color: filtre === f ? 'white' : '#1F4E79',
            borderColor: '#1F4E79',
          }}
        >
          {f}
          <span style={{
            ...styles.filtreBadge,
            backgroundColor: filtre === f ? 'rgba(255,255,255,0.25)' : '#e8f0f8',
            color: filtre === f ? 'white' : '#1F4E79',
          }}>{counts[f]}</span>
        </button>
      ))}
    </div>
  )
}

function Tasks() {
  // Tasks assigned to Taher from other projects (read-only, no delete)
  const [tachesAssignees, setTachesAssignees] = useState([
    { id: 1, titre: 'Analyse des besoins', projet: 'Fil Rouge', priorite: 'Haute', statut: 'Terminé', assignee: 'Taher' },
    { id: 2, titre: 'Maquettes UI/UX', projet: 'Fil Rouge', priorite: 'Haute', statut: 'En cours', assignee: 'Taher' },
    { id: 3, titre: 'Développement API REST', projet: 'Fil Rouge', priorite: 'Haute', statut: 'À faire', assignee: 'Taher' },
  ])

  // Tasks Taher creates for his personal project
  const [tachesPersonnelles, setTachesPersonnelles] = useState([
    { id: 101, titre: 'Collecte du dataset', projet: 'Projet IA', priorite: 'Moyenne', statut: 'À faire', assignee: 'Moi' },
    { id: 102, titre: 'Entraînement du modèle', projet: 'Projet IA', priorite: 'Basse', statut: 'À faire', assignee: 'Moi' },
  ])

  const [filtreAssignees, setFiltreAssignees] = useState('Tous')
  const [filtrePersonnelles, setFiltrePersonnelles] = useState('Tous')

  const [showForm, setShowForm] = useState(false)
  const [titre, setTitre] = useState('')
  const [projet, setProjet] = useState('')
  const [priorite, setPriorite] = useState('Moyenne')

  const handleAjouter = (e) => {
    e.preventDefault()
    if (!titre) return
    const nouvelle = {
      id: Date.now(),
      titre,
      projet,
      priorite,
      statut: 'À faire',
      assignee: 'Moi',
    }
    setTachesPersonnelles([...tachesPersonnelles, nouvelle])
    setTitre('')
    setProjet('')
    setPriorite('Moyenne')
    setShowForm(false)
  }

  const changerStatutAssignee = (id) => {
    const ordre = ['À faire', 'En cours', 'Terminé']
    setTachesAssignees(tachesAssignees.map(t =>
      t.id === id ? { ...t, statut: ordre[(ordre.indexOf(t.statut) + 1) % ordre.length] } : t
    ))
  }

  const changerStatutPersonnelle = (id) => {
    const ordre = ['À faire', 'En cours', 'Terminé']
    setTachesPersonnelles(tachesPersonnelles.map(t =>
      t.id === id ? { ...t, statut: ordre[(ordre.indexOf(t.statut) + 1) % ordre.length] } : t
    ))
  }

  const supprimerPersonnelle = (id) => {
    setTachesPersonnelles(tachesPersonnelles.filter(t => t.id !== id))
  }

  const filtrer = (liste, filtre) =>
    filtre === 'Tous' ? liste : liste.filter(t => t.statut === filtre)

  return (
    <div style={styles.container}>

{/* NAVBAR */}
<div style={styles.navbar}>
  <span style={styles.navTitle}>📋 Fil Rouge</span>
  <div style={styles.navLinks}>
    <div style={styles.accountBadge}>T</div>
    <span style={styles.accountName}>Taher</span>
    <a href="/projects" style={styles.navLink}>Projets</a>
    <a href="/tasks" style={styles.navLink}>Tâches</a>
    <a href="/assign" style={styles.navLink}>Affectation</a>
    <a href="/" style={styles.navLinkLogout}>Déconnexion</a>
  </div>
</div>

      {/* CONTENU */}
      <div style={styles.content}>

        {/* ── SECTION 1 : TÂCHES ASSIGNÉES ── */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Mes tâches assignées</h2>
              <p style={styles.sectionSub}>Tâches que d'autres membres vous ont affectées</p>
            </div>
          </div>

          <SectionFiltres
            taches={tachesAssignees}
            filtre={filtreAssignees}
            setFiltre={setFiltreAssignees}
          />

          <div style={styles.liste}>
            {filtrer(tachesAssignees, filtreAssignees).length === 0
              ? <div style={styles.empty}>Aucune tâche dans cette catégorie.</div>
              : filtrer(tachesAssignees, filtreAssignees).map(t => (
                <TaskCard
                  key={t.id}
                  tache={t}
                  onChangerStatut={changerStatutAssignee}
                  onSupprimer={null}
                />
              ))
            }
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={styles.divider} />

        {/* ── SECTION 2 : MON PROJET PERSONNEL ── */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Mon projet personnel</h2>
              <p style={styles.sectionSub}>Tâches que vous créez et gérez vous-même</p>
            </div>
            <button style={styles.btnAjouter} onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Annuler' : '+ Nouvelle tâche'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleAjouter} style={styles.form}>
              <input
                style={styles.input}
                type="text"
                placeholder="Titre de la tâche"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Projet (ex: Projet IA)"
                value={projet}
                onChange={(e) => setProjet(e.target.value)}
              />
              <select
                style={styles.input}
                value={priorite}
                onChange={(e) => setPriorite(e.target.value)}
              >
                <option value="Haute">Haute priorité</option>
                <option value="Moyenne">Moyenne priorité</option>
                <option value="Basse">Basse priorité</option>
              </select>
              <button style={styles.btnSubmit} type="submit">Créer la tâche</button>
            </form>
          )}

          <SectionFiltres
            taches={tachesPersonnelles}
            filtre={filtrePersonnelles}
            setFiltre={setFiltrePersonnelles}
          />

          <div style={styles.liste}>
            {filtrer(tachesPersonnelles, filtrePersonnelles).length === 0
              ? <div style={styles.empty}>Aucune tâche personnelle. Créez-en une !</div>
              : filtrer(tachesPersonnelles, filtrePersonnelles).map(t => (
                <TaskCard
                  key={t.id}
                  tache={t}
                  onChangerStatut={changerStatutPersonnelle}
                  onSupprimer={supprimerPersonnelle}
                />
              ))
            }
          </div>
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
  },
  navbar: {
    backgroundColor: '#1F4E79',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navTitle: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px',
  },
  navLinkLogout: {
    color: '#FFEB9C',
    textDecoration: 'none',
    fontSize: '15px',
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  section: {
    marginBottom: '8px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  sectionTitle: {
    color: '#1F4E79',
    margin: '0 0 4px 0',
    fontSize: '20px',
    fontWeight: '700',
  },
  sectionSub: {
    margin: 0,
    fontSize: '13px',
    color: '#888',
  },
  divider: {
    borderTop: '2px dashed #d0dce8',
    margin: '36px 0',
  },
  btnAjouter: {
    backgroundColor: '#1F4E79',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    flexShrink: 0,
  },
  form: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px',
  },
  btnSubmit: {
    backgroundColor: '#2E75B6',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
  },
  filtres: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  filtreBtn: {
    border: '1.5px solid',
    padding: '7px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  filtreBadge: {
    borderRadius: '10px',
    padding: '1px 7px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  liste: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    padding: '32px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '18px 20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  cardLeft: {
    flexShrink: 0,
  },
  checkBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '2px solid',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  cardBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  },
  cardTitre: {
    fontSize: '16px',
    fontWeight: '600',
  },
  badges: {
    display: 'flex',
    gap: '6px',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  cardMeta: {
    display: 'flex',
    gap: '12px',
  },
  metaTag: {
    fontSize: '13px',
    color: '#666',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#ccc',
    cursor: 'pointer',
    fontSize: '16px',
    flexShrink: 0,
    padding: '4px 8px',
    borderRadius: '6px',
  },
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
  marginRight: '8px',
},
}

export default Tasks

import { useState, useEffect } from 'react'

const user = JSON.parse(localStorage.getItem('user'))
const currentUser = user?.name

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
  const p = prioriteColor(tache.priority)
  return (
    <div style={styles.card}>
      <div style={styles.cardLeft}>
        <button
          style={{
            ...styles.checkBtn,
            backgroundColor: tache.status === 'Terminé' ? '#C6EFCE' : 'white',
            borderColor: tache.status === 'Terminé' ? '#276221' : '#ddd',
            color: tache.status === 'Terminé' ? '#276221' : '#ccc',
          }}
          onClick={() => onChangerStatut(tache.id, tache.status)}
          title="Changer le statut"
        >
          {tache.status === 'Terminé' ? '✓' : tache.status === 'En cours' ? '▶' : '○'}
        </button>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.cardTop}>
          <span style={{
            ...styles.cardTitre,
            textDecoration: tache.status === 'Terminé' ? 'line-through' : 'none',
            color: tache.status === 'Terminé' ? '#999' : '#1F4E79',
          }}>
            {tache.title}
          </span>
          <div style={styles.badges}>
            <span style={{ ...styles.badge, backgroundColor: p.bg, color: p.text }}>
              {tache.priority}
            </span>
            <span style={{
              ...styles.badge,
              backgroundColor: statutColor(tache.status),
              color: statutTextColor(tache.status),
            }}>
              {tache.status}
            </span>
          </div>
        </div>
        <div style={styles.cardMeta}>
          {tache.projet && <span style={styles.metaTag}>📁 {tache.projet}</span>}
          {tache.assigned_to && <span style={styles.metaTag}>👤 {tache.assigned_to}</span>}
        </div>
      </div>

      {onSupprimer && (
        <button style={styles.deleteBtn} onClick={() => onSupprimer(tache.id)} title="Supprimer">
          ✕
        </button>
      )}
    </div>
  )
}

function SectionFiltres({ taches, filtre, setFiltre }) {
  const counts = {
    'Tous': taches.length,
    'À faire': taches.filter(t => t.status === 'À faire').length,
    'En cours': taches.filter(t => t.status === 'En cours').length,
    'Terminé': taches.filter(t => t.status === 'Terminé').length,
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
  const [taches, setTaches] = useState([])
  const [mesProjets, setMesProjets] = useState([])
  const [filtreAssignees, setFiltreAssignees] = useState('Tous')
  const [filtrePersonnelles, setFiltrePersonnelles] = useState('Tous')
  const [showForm, setShowForm] = useState(false)
  const [titre, setTitre] = useState('')
  const [projectId, setProjectId] = useState('')
  const [priorite, setPriorite] = useState('Moyenne')

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then(res => res.json())
      .then(data => setTaches(data))

    fetch(`http://localhost:5000/projects?proprietaire=${currentUser}`)
      .then(res => res.json())
      .then(data => {
        setMesProjets(data)
        if (data.length > 0) setProjectId(data[0].id)
      })
  }, [])
const mesProjetIds = new Set(mesProjets.map(p => p.id))

 const tachesAssignees = taches.filter(t => t.assigned_to?.toLowerCase() === currentUser.toLowerCase())
const tachesPersonnelles = taches.filter(t => mesProjetIds.has(t.project_id))

  const changerStatut = (id, statusActuel) => {
    const ordre = ['À faire', 'En cours', 'Terminé']
    const newStatus = ordre[(ordre.indexOf(statusActuel) + 1) % ordre.length]
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).then(() => {
      setTaches(taches.map(t => t.id === id ? { ...t, status: newStatus } : t))
    })
  }

  const supprimerTache = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })
      .then(() => setTaches(taches.filter(t => t.id !== id)))
  }

  const handleAjouter = (e) => {
    e.preventDefault()
    if (!titre || !projectId) return
    fetch("http://localhost:5000/tasks", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titre, project_id: projectId, priority: priorite, assigned_to: currentUser })
    })
      .then(res => res.json())
      .then(newTask => {
        const projet = mesProjets.find(p => p.id === parseInt(projectId))
        setTaches(prev => [...prev, { ...newTask, projet: projet?.nom }])
        setTitre('')
        setPriorite('Moyenne')
        setShowForm(false)
      })
  }

  const filtrer = (liste, filtre) =>
    filtre === 'Tous' ? liste : liste.filter(t => t.status === filtre)

  return (
    <div style={styles.container}>
      <div style={styles.content}>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Mes tâches assignées</h2>
              <p style={styles.sectionSub}>Tâches que d'autres membres vous ont affectées</p>
            </div>
          </div>
          <SectionFiltres taches={tachesAssignees} filtre={filtreAssignees} setFiltre={setFiltreAssignees} />
          <div style={styles.liste}>
            {filtrer(tachesAssignees, filtreAssignees).length === 0
              ? <div style={styles.empty}>Aucune tâche assignée.</div>
              : filtrer(tachesAssignees, filtreAssignees).map(t => (
                <TaskCard key={t.id} tache={t} onChangerStatut={changerStatut} onSupprimer={null} />
              ))
            }
          </div>
        </div>

        <div style={styles.divider} />

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
              <select
                style={styles.input}
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                {mesProjets.length === 0
                  ? <option>Aucun projet disponible</option>
                  : mesProjets.map(p => (
                    <option key={p.id} value={p.id}>{p.nom}</option>
                  ))
                }
              </select>
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

          <SectionFiltres taches={tachesPersonnelles} filtre={filtrePersonnelles} setFiltre={setFiltrePersonnelles} />
          <div style={styles.liste}>
            {filtrer(tachesPersonnelles, filtrePersonnelles).length === 0
              ? <div style={styles.empty}>Aucune tâche personnelle. Créez-en une !</div>
              : filtrer(tachesPersonnelles, filtrePersonnelles).map(t => (
                <TaskCard key={t.id} tache={t} onChangerStatut={changerStatut} onSupprimer={supprimerTache} />
              ))
            }
          </div>
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
  content: { maxWidth: '900px', margin: '0 auto', padding: '32px 16px' },
  section: { marginBottom: '8px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  sectionTitle: { color: '#1F4E79', margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700' },
  sectionSub: { margin: 0, fontSize: '13px', color: '#888' },
  divider: { borderTop: '2px dashed #d0dce8', margin: '36px 0' },
  btnAjouter: { backgroundColor: '#1F4E79', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', flexShrink: 0 },
  form: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' },
  btnSubmit: { backgroundColor: '#2E75B6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  filtres: { display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' },
  filtreBtn: { border: '1.5px solid', padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' },
  filtreBadge: { borderRadius: '10px', padding: '1px 7px', fontSize: '12px', fontWeight: 'bold' },
  liste: { display: 'flex', flexDirection: 'column', gap: '12px' },
  empty: { textAlign: 'center', color: '#999', padding: '32px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '14px' },
  cardLeft: { flexShrink: 0 },
  checkBtn: { width: '32px', height: '32px', borderRadius: '50%', border: '2px solid', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  cardBody: { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' },
  cardTitre: { fontSize: '16px', fontWeight: '600' },
  badges: { display: 'flex', gap: '6px' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  cardMeta: { display: 'flex', gap: '12px' },
  metaTag: { fontSize: '13px', color: '#666' },
  deleteBtn: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '16px', flexShrink: 0, padding: '4px 8px', borderRadius: '6px' },
}

export default Tasks
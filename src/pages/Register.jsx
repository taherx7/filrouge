import { useState } from 'react'

function Register() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('etudiant')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Nom:', nom, 'Email:', email, 'Role:', role)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Fil Rouge</h1>
        <p style={styles.subtitle}>Créer votre compte</p>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="Nom complet"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            style={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="etudiant">Étudiant</option>
            <option value="chef_projet">Chef de projet</option>
            <option value="encadrant">Encadrant pédagogique</option>
          </select>

          <button style={styles.button} type="submit">
            Créer mon compte
          </button>
        </form>

        <p style={styles.link}>
          Déjà un compte ? <a href="/">Se connecter</a>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    color: '#1F4E79',
    marginBottom: '8px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    marginBottom: '24px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1F4E79',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  link: {
    textAlign: 'center',
    marginTop: '16px',
    color: '#888',
    fontSize: '14px',
  }
}

export default Register
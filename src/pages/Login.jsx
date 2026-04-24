import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

const handleSubmit = (e) => {
  e.preventDefault()
  fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        alert(data.message)
      } else {
        localStorage.setItem('user', JSON.stringify(data))
        window.location.href = '/projects'
      }
    })
}

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Fil Rouge</h1>
        <p style={styles.subtitle}>Connectez-vous à votre espace</p>

        <form onSubmit={handleSubmit}>
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
          <button style={styles.button} type="submit">
            Se connecter
          </button>
        </form>

        <p style={styles.link}>
          Pas encore de compte ? <a href="/register">S'inscrire</a>
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

export default Login
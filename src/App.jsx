import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Projects from './pages/projects'
import Tasks from './pages/tasks'
import AssignTasks from './pages/AssignTasks'
import MainLayout from './components/MainLayout'

function App() {
  // ⚠️ For now, put your navbar data here (temporary)
  const inbox = [];
  const pendingCount = 0;

  const repondreInbox = (id, rep) => {
    console.log(id, rep);
  };

  const invitStatutStyle = (statut) => {
    return { bg: "#eee", text: "#333" };
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* ❌ Pages WITHOUT navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Pages WITH navbar */}
        <Route
          element={
            <MainLayout
              inbox={inbox}
              pendingCount={pendingCount}
              repondreInbox={repondreInbox}
              invitStatutStyle={invitStatutStyle}
            />
          }
        >
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/assign" element={<AssignTasks />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
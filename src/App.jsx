import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Projects from './pages/projects'
import Tasks from './pages/tasks'
import AssignTasks from './pages/AssignTasks'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/assign" element={<AssignTasks />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
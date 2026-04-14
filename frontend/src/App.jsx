import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Tasks from './pages/Tasks';
import Resources from './pages/Resources';
import ProtectedRoute from './components/ProtectedRoute';
import Authentication from './pages/Authentication';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<Authentication />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:slug" element={<ProjectDetails />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/resources" element={<Resources />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
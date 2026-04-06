import { Link, Outlet } from 'react-router-dom';

function Layout() {
    return (
        <div className="min-h-screen bg-base-200">
            {/* Navbar */}
            <div className="navbar bg-base-100 shadow-lg">
                <div className="flex-1">
                    <Link to="/" className="btn btn-ghost text-xl">
                        Project Manager
                    </Link>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li><Link to="/">Dashboard</Link></li>
                        <li><Link to="/projects">Projects</Link></li>
                        <li><Link to="/tasks">Tasks</Link></li>
                        <li><Link to="/resources">Resources</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                </div>
            </div>

            {/* Page Content */}
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
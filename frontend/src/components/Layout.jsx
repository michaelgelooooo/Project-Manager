import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Layout() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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

                        {user ? (
                            <li>
                                <details>
                                    <summary>{user.username}</summary>
                                    <ul className="bg-base-100 rounded-t-none p-2">
                                        <li><a onClick={handleLogout}>Logout</a></li>
                                    </ul>
                                </details>
                            </li>
                        ) : (
                            <li><Link to="/login">Login</Link></li>
                        )}
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
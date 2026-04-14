import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const tabs = [
    { name: 'DASHBOARD', to: '/', prefix: '/' },
    { name: 'PROJECTS', to: '/projects', prefix: '/projects' },
    { name: 'TASKS', to: '/tasks', prefix: '/tasks' },
    { name: 'RESOURCES', to: '/resources', prefix: '/resources' },
];

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (prefix) => {
        if (prefix === '/') return location.pathname === '/';
        return location.pathname.startsWith(prefix);
    };

    return (
        <div className="navbar bg-base-100 px-4 sm:px-16 py-4 fixed top-0 left-0 z-50">

            <div className="navbar-start">
                <Link
                    to="/"
                    className="text-2xl sm:text-4xl font-bold text-secondary hover:text-primary transform hover:scale-105 transition-all duration-150 ease-in-out transition-color"
                    style={{ fontFamily: "'Bungee Shade', sans-serif" }}
                >
                    MOMENTUM
                </Link>
            </div>

            <div className="navbar-center hidden sm:flex">
                <div role="tablist" className="tabs-lg tabs-box bg-base-100 font-semibold rounded-full border-2 border-secondary space-x-1">
                    {tabs.map(({ name, to, prefix }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`tab rounded-full transform transition-all duration-150 ease-in ${isActive(prefix)
                                    ? 'tab-active bg-secondary text-base-100'
                                    : 'text-secondary hover:bg-primary hover:text-base-100'
                                }`}
                        >
                            {name}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="navbar-end">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="text-2xl sm:text-4xl text-secondary hover:text-primary cursor-pointer transform hover:scale-110 transition-all duration-300 ease-in-out">
                            <i className="fas fa-circle-user" />
                        </label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 mt-2">
                            <li><span className="font-semibold px-3 py-1">{user.username}</span></li>
                            <li><a onClick={handleLogout} className="cursor-pointer">Logout</a></li>
                        </ul>
                    </div>
                ) : (
                    <Link to="/login" className="text-2xl sm:text-4xl text-secondary hover:text-primary cursor-pointer transform hover:scale-110 transition-all duration-300 ease-in-out">
                        <i className="fas fa-circle-user" />
                    </Link>
                )}
            </div>

        </div>
    );
}

export default Navbar;
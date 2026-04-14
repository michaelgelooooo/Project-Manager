import { Link, useLocation } from 'react-router-dom';

const tabs = [
    { name: 'DASHBOARD', to: '/', prefix: '/', icon: 'fa-tv' },
    { name: 'PROJECTS', to: '/projects', prefix: '/projects', icon: 'fa-folder-open' },
    { name: 'TASKS', to: '/tasks', prefix: '/tasks', icon: 'fa-clipboard-list' },
    { name: 'RESOURCES', to: '/resources', prefix: '/resources', icon: 'fa-book-open' },
];

function Dock() {
    const location = useLocation();

    const isActive = (prefix) => {
        if (prefix === '/') return location.pathname === '/';
        return location.pathname.startsWith(prefix);
    };

    return (
        <div className="dock sm:hidden bg-base-100 border-none">
            {tabs.map(({ name, to, prefix, icon }) => (
                <Link
                    key={to}
                    to={to}
                    className={isActive(prefix) ? 'dock-active text-secondary' : 'text-secondary/50'}
                >
                    <i className={`fas ${icon}`} />
                    <span className="dock-label text-[10px]">{name}</span>
                </Link>
            ))}
        </div>
    );
}

export default Dock;
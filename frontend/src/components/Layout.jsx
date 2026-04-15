import { Outlet } from 'react-router-dom';
import Navbar from './UI/Navbar';
import Dock from './UI/Dock';

function Layout() {
    return (
        <div className='bg-base-300 min-h-screen'>
            <Navbar />
            <main className="px-4 sm:px-16 pt-16 sm:pt-24 pb-20 sm:pb-0">
                <Outlet />
            </main>

            <Dock />
        </div>
    );
}

export default Layout;
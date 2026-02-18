import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children, title, subtitle }) => {
    return (
        <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 ml-20 flex flex-col">
                <Topbar title={title} subtitle={subtitle} />
                <main className="flex-1 overflow-auto dark:text-white">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;

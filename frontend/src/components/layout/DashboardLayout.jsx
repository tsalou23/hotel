import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout({ activeView, setActiveView, title, subtitle, stats, children,menuItems=[] }) {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background">
            <Sidebar activeView={activeView} setActiveView={setActiveView} stats={stats} menuItems={menuItems} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header title={title} subtitle={subtitle} stats={stats} activeView={activeView} setActiveView={setActiveView} />
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

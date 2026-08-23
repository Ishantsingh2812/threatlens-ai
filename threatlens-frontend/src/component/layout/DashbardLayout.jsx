import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950">

      <Sidebar />

      <main className="ml-64 min-h-screen">

        <Navbar />

        <section className="p-6">
          {children}
        </section>

      </main>

    </div>
  );
}

export default DashboardLayout;

import AdminSidebar from "@/components/sidebar";

function layout({ children } : { children: React.ReactNode }) {
  return (
    <div className="bg-white">
        <AdminSidebar />
        {children}
    </div>
  )
}

export default layout
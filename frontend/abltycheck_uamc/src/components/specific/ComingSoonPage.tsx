import { Sidebar } from "../layout/sidebar";
import { Construction } from "lucide-react";
import { useLocation } from "react-router-dom"; // 👈 Corregido a react-router-dom

const titles: Record<string, string> = {
    "/materiales": "Material de Estudio",
};

export function ComingSoonPage() {
    const location = useLocation();
    const title = titles[location.pathname] || "Próximamente";

    return (
        <div className="flex h-screen bg-[#F8F9FA] font-['Inter',sans-serif]">
            <Sidebar />
            <main className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-[#F28224]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Construction className="w-10 h-10 text-[#F28224]" />
                    </div>
                    <h1 className="text-3xl text-[#1D1D1B] mb-3" style={{ fontWeight: 700 }}>
                        {title}
                    </h1>
                    <p className="text-[#64748B] text-lg">
                        Esta sección estará disponible próximamente. ¡Estamos trabajando en ello! 🚧
                    </p>
                </div>
            </main>
        </div>
    );
}
import { Sidebar } from "../components/layout/sidebar";
import { HardHat, Wrench } from "lucide-react";
import { motion } from "framer-motion";

export function AdminSubirMaterialPage() {
    return (
        <div className="flex h-screen bg-[#F8F9FA] font-['Inter',sans-serif]">
            <Sidebar isAdmin />

            <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-lg w-full text-center bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100"
                >
                    <div className="w-24 h-24 bg-[#F28224]/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <HardHat className="w-12 h-12 text-[#F28224]" />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-sm border border-gray-100"
                        >
                            <Wrench className="w-5 h-5 text-[#64748B]" />
                        </motion.div>
                    </div>

                    <h1 className="text-3xl font-bold text-[#1D1D1B] mb-4">
                        Próximamente en V3 🚀
                    </h1>

                    <p className="text-[#64748B] mb-8 leading-relaxed">
                        El módulo de gestión y subida de material de estudio está actualmente en los planos de construcción. El equipo está preparando los cimientos para esta característica.
                    </p>

                    <div className="inline-flex items-center gap-2 text-sm font-bold text-[#F28224] bg-[#F28224]/10 px-5 py-2.5 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F28224] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F28224]"></span>
            </span>
                        Zona de Obras
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
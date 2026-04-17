import { Sidebar } from "../components/layout/sidebar";
import { User, Link2, LogOut, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../config/axiosConfig";

interface UsuarioSettings {
    nombre: string;
    biografia: string;
    fotoUrl: string;
}

export function SettingsPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<UsuarioSettings>({
        nombre: "",
        biografia: "",
        fotoUrl: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mensajeExito, setMensajeExito] = useState(false);

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const response = await api.get('/usuarios/perfil');
                setFormData({
                    nombre: response.data.nombre || "",
                    biografia: response.data.biografia || "",
                    fotoUrl: response.data.fotoUrl || "",
                });
            } catch (error) {
                console.error("Error al cargar configuración", error);
            } finally {
                setLoading(false);
            }
        };
        cargarPerfil();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // 👈 AQUÍ ESTÁ LA MAGIA REAL. Enviamos el PUT al backend
            await api.put('/usuarios/perfil', formData);

            setMensajeExito(true);
            setTimeout(() => {
                setMensajeExito(false);
                // Opcional: Forzar recarga para que el Sidebar vea la nueva foto inmediatamente
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Error al guardar cambios", error);
            alert("Hubo un error al actualizar tu perfil.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        navigate("/");
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-[#F8F9FA] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28224]"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8F9FA] font-['Inter',sans-serif]">
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-8 relative">
                <div className="max-w-xl mx-auto">
                    <h1 className="text-3xl text-[#1D1D1B] mb-2" style={{ fontWeight: 700 }}>Configuración ⚙️</h1>
                    <p className="text-[#64748B] mb-8">Actualiza tu información personal</p>

                    <AnimatePresence>
                        {mensajeExito && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute top-8 right-8 bg-[#DCFCE7] text-[#15803D] px-6 py-4 rounded-2xl flex items-center gap-3 shadow-lg border border-[#86EFAC] z-50"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-semibold">¡Cambios guardados con éxito!</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="bg-white rounded-3xl shadow-sm p-8 mb-6 border border-gray-100">
                        <div className="space-y-6">

                            <div>
                                <label className="block text-sm text-[#1D1D1B] mb-2" style={{ fontWeight: 500 }}>URL de Foto de Perfil</label>
                                <div className="relative">
                                    <Link2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                                    <input
                                        type="url"
                                        name="fotoUrl"
                                        value={formData.fotoUrl}
                                        onChange={handleChange}
                                        placeholder="https://ejemplo.com/mi-foto.jpg"
                                        className="w-full pl-14 pr-5 py-4 bg-[#F8F9FA] border-2 border-transparent rounded-2xl focus:border-[#F28224] focus:bg-white focus:outline-none transition-all text-[#1D1D1B]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-[#1D1D1B] mb-2" style={{ fontWeight: 500 }}>Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-5 py-4 bg-[#F8F9FA] border-2 border-transparent rounded-2xl focus:border-[#F28224] focus:bg-white focus:outline-none transition-all text-[#1D1D1B]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-[#1D1D1B] mb-2" style={{ fontWeight: 500 }}>Acerca de mí</label>
                                <textarea
                                    name="biografia"
                                    value={formData.biografia}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-5 py-4 bg-[#F8F9FA] border-2 border-transparent rounded-2xl focus:border-[#F28224] focus:bg-white focus:outline-none transition-all resize-none text-[#1D1D1B]"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full py-4 bg-[#F28224] hover:bg-[#D97120] text-white rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-[#F28224]/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center"
                                style={{ fontWeight: 600 }}
                            >
                                {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Guardar Cambios"}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full py-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mb-8"
                        style={{ fontWeight: 600 }}
                    >
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </main>
        </div>
    );
}
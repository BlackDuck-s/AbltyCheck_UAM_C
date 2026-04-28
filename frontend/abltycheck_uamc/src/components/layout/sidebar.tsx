import { NavLink, useNavigate } from "react-router-dom";
import {
    BarChart3,
    BookOpen,
    Settings,
    LogOut,
    User,
    Shield,
    ChevronLeft,
    ChevronRight,
    Users,
    FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../config/axiosConfig.ts";

interface SidebarProps {
    isAdmin?: boolean;
}

interface NavItem {
    to: string;
    icon: typeof BarChart3;
    label: string;
    badge?: string;
}

// Interfaz para saber qué datos esperar del backend
interface SidebarProfile {
    nombre: string | null;
    matricula: string;
    fotoUrl?: string | null;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [userData, setUserData] = useState<SidebarProfile | null>(null);
    const navigate = useNavigate();

    // Efecto para ir por los datos del usuario en cuanto el Sidebar se pinta
    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                const response = await api.get('/usuarios/perfil');
                setUserData(response.data);
            } catch (error) {
                console.error("Error al cargar datos del Sidebar:", error);
            }
        };
        fetchSidebarData();
    }, []);

    // Lógica segura por si los datos aún no cargan o vienen nulos
    const nombreSeguro = userData?.nombre || "Cargando...";
    const matriculaSegura = userData?.matricula || "---";

    const avatarContent = userData?.fotoUrl ? (
        <img src={userData.fotoUrl} alt="Avatar" className="w-full h-full object-cover" />
    ) : userData?.nombre ? (
        userData.nombre.charAt(0).toUpperCase()
    ) : (
        <User className="w-6 h-6 text-white" />
    );

    const handleLogout = () => {
        // ¡Súper importante! Borrar el token para cerrar sesión de verdad
        localStorage.removeItem('jwt_token');
        navigate("/");
    };

    const mainLinks: NavItem[] = isAdmin
        ? [
            { to: "/admin", icon: Shield, label: "Panel Admin" },
            { to: "/admin/crowdsourcing", icon: Users, label: "Aprobar Reactivos", badge: "Pendientes" },
            { to: "/admin/stats", icon: BarChart3, label: "Estadísticas" },
            { to: "/admin/materiales", icon: BookOpen, label: "Subir Material" },
            { to: "/admin/reactivos", icon: BookOpen, label: "Gestor de Reactivos" }
        ]
        : [
            { to: "/profile", icon: User, label: "Perfil" },
            { to: "/progress", icon: BarChart3, label: "Progreso" },
            { to: "/questions", icon: BookOpen, label: "Practicar" },
            { to: "/crowdsourcing", icon: Users, label: "Crowdsourcing" },
            { to: "/materiales", icon: FileText, label: "Material de Estudio", badge: "Nuevo" },
        ];

    const bottomLinks: NavItem[] = [
        { to: "/settings", icon: Settings, label: "Configuración" },
    ];

    return (
        <aside
            className={`bg-white border-r border-gray-200/50 flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-72"
            }`}
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#F28224] to-[#D97120] rounded-2xl flex items-center justify-center">
                            <span className="text-white" style={{ fontWeight: 700 }}>A</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#1D1D1B]" style={{ fontWeight: 600 }}>AbltyCheck</span>
                            <span className="text-[10px] text-[#F28224] -mt-0.5" style={{ fontWeight: 600, letterSpacing: "0.05em" }}>UAM-C</span>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F28224] to-[#D97120] rounded-2xl flex items-center justify-center mx-auto">
                        <span className="text-white" style={{ fontWeight: 700 }}>A</span>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`w-8 h-8 rounded-xl bg-[#F8F9FA] hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] transition-colors ${collapsed ? "hidden" : ""}`}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
            </div>

            {/* Expand button when collapsed */}
            {collapsed && (
                <div className="flex justify-center py-3 border-b border-gray-100">
                    <button
                        onClick={() => setCollapsed(false)}
                        className="w-8 h-8 rounded-xl bg-[#F8F9FA] hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Profile Dinámico */}
            <div className={`p-6 ${collapsed ? "flex justify-center" : ""}`}>
                <div className={`flex items-center gap-3 ${collapsed ? "flex-col" : ""}`}>
                    <div className="w-12 h-12 bg-gradient-to-br from-[#F28224] to-[#D97120] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                        {/* Mostramos la inicial, el ícono o la FOTO */}
                        {typeof avatarContent === 'string' ? (
                            <span className="text-white font-bold text-xl">{avatarContent}</span>
                        ) : (
                            avatarContent
                        )}
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-[#1D1D1B] truncate" style={{ fontWeight: 600 }}>
                                {nombreSeguro}
                            </p>
                            <p className="text-sm text-[#64748B] truncate">{matriculaSegura}</p>
                            {isAdmin && (
                                <span
                                    className="inline-block mt-1 px-2 py-0.5 bg-[#F28224]/15 text-[#D97120] rounded-full text-xs"
                                    style={{ fontWeight: 500 }}
                                >
                                    Admin
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {mainLinks.map((link) => (
                    <NavLink
                        key={link.to + link.label}
                        to={link.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative ${collapsed ? "justify-center" : ""
                            } ${isActive
                                ? "bg-[#F28224]/10 text-[#D97120]"
                                : "text-[#64748B] hover:bg-[#F8F9FA] hover:text-[#1D1D1B]"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon
                                    className={`w-5 h-5 flex-shrink-0 ${isActive
                                        ? "text-[#F28224]"
                                        : "text-[#94A3B8] group-hover:text-[#64748B]"
                                    }`}
                                />
                                {!collapsed && (
                                    <span style={{ fontWeight: 500 }} className="flex-1">
                                        {link.label}
                                    </span>
                                )}
                                {!collapsed && link.badge && (
                                    <span
                                        className="px-2 py-0.5 bg-[#F28224] text-white rounded-full text-[10px] animate-pulse"
                                        style={{ fontWeight: 600 }}
                                    >
                                        {link.badge}
                                    </span>
                                )}
                                {collapsed && link.badge && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#F28224] rounded-full" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom: Settings + Logout */}
            <div className="px-4 pb-2 space-y-1 border-t border-gray-100 pt-3">
                {!isAdmin &&
                    bottomLinks.map((link) => (
                        <NavLink
                            key={link.to + link.label}
                            to={link.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${collapsed ? "justify-center" : ""
                                } ${isActive
                                    ? "bg-[#F28224]/10 text-[#D97120]"
                                    : "text-[#64748B] hover:bg-[#F8F9FA] hover:text-[#1D1D1B]"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon
                                        className={`w-5 h-5 flex-shrink-0 ${isActive
                                            ? "text-[#F28224]"
                                            : "text-[#94A3B8] group-hover:text-[#64748B]"
                                        }`}
                                    />
                                    {!collapsed && (
                                        <span style={{ fontWeight: 500 }}>{link.label}</span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}

                {/* Botón de Cerrar Sesión Actualizado */}
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[#64748B] hover:bg-[#FCA5A5]/10 hover:text-[#991B1B] transition-all w-full ${collapsed ? "justify-center" : ""
                    }`}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && (
                        <span style={{ fontWeight: 500 }}>Cerrar Sesión</span>
                    )}
                </button>
            </div>
        </aside>
    );
}
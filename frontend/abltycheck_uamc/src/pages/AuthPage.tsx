import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Hash, Eye, EyeOff, User } from "lucide-react";
import api from "../config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios"; // Importamos el tipo de error correcto

interface AuthPageProps {
    onLoginSuccess: (rol: 'ALUMNO' | 'ADMIN') => void;
}

export function AuthPage({ onLoginSuccess }: AuthPageProps) {
    const navigate = useNavigate(); // 👈 Inicializamos el hook aquí

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [loginData, setLoginData] = useState({ matricula: "", password: "" });
    const [registerData, setRegisterData] = useState({
        matricula: "", nombre: "", email: "", password: "", confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                const response = await api.post('/auth/login', {
                    matricula: loginData.matricula, password: loginData.password
                });
                const { token, rol } = response.data;
                localStorage.setItem('jwt_token', token);
                onLoginSuccess(rol as 'ALUMNO' | 'ADMIN');

                // 👈 Usamos el navigate para ir al perfil
                navigate("/profile");

            } else {
                if (registerData.password !== registerData.confirmPassword) {
                    setError("Las contraseñas no coinciden");
                    setLoading(false);
                    return;
                }
                await api.post('/auth/register', {
                    matricula: registerData.matricula,
                    nombre: registerData.nombre,
                    email: registerData.email,
                    password: registerData.password,
                    rol: 'ALUMNO'
                });
                alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
                setIsLogin(true);
            }
        } catch (err) {
            // 👈 Tipamos el error correctamente en lugar de usar 'any'
            const axiosError = err as AxiosError<{ mensaje: string }>;
            setError(axiosError.response?.data?.mensaje || 'Credenciales inválidas o error de conexión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-['Inter',sans-serif] bg-uam-bg">
            <div className="hidden lg:flex w-1/2 bg-[#1D1D1B] relative overflow-hidden items-center justify-center">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 900" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="waveOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#F08200" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#F08200" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="waveRed" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#CD032E" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#CD032E" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="waveBlue" x1="0%" y1="50%" x2="100%" y2="50%">
                            <stop offset="0%" stopColor="#0072CE" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#0072CE" stopOpacity="0.08" />
                        </linearGradient>
                    </defs>

                    <motion.path
                        initial={{ d: "M0,180 C150,80 350,280 500,180 C650,80 750,230 800,180 L800,900 L0,900 Z" }}
                        animate={{ d: ["M0,180 C150,80 350,280 500,180 C650,80 750,230 800,180 L800,900 L0,900 Z", "M0,230 C150,130 350,230 500,160 C650,90 750,280 800,230 L800,900 L0,900 Z", "M0,180 C150,80 350,280 500,180 C650,80 750,230 800,180 L800,900 L0,900 Z"] }}
                        fill="url(#waveOrange)" transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.path
                        initial={{ d: "M0,320 C200,250 400,400 600,310 C700,270 750,370 800,320 L800,900 L0,900 Z" }}
                        animate={{ d: ["M0,320 C200,250 400,400 600,310 C700,270 750,370 800,320 L800,900 L0,900 Z", "M0,300 C200,280 400,360 600,330 C700,300 750,350 800,300 L800,900 L0,900 Z", "M0,320 C200,250 400,400 600,310 C700,270 750,370 800,320 L800,900 L0,900 Z"] }}
                        fill="url(#waveRed)" transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.path
                        initial={{ d: "M0,460 C180,400 380,520 560,450 C680,410 760,490 800,460 L800,900 L0,900 Z" }}
                        animate={{ d: ["M0,460 C180,400 380,520 560,450 C680,410 760,490 800,460 L800,900 L0,900 Z", "M0,480 C180,430 380,490 560,470 C680,440 760,500 800,480 L800,900 L0,900 Z", "M0,460 C180,400 380,520 560,450 C680,410 760,490 800,460 L800,900 L0,900 Z"] }}
                        fill="url(#waveBlue)" transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    />
                </svg>

                <div className="relative z-10 text-center px-12">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: "spring" }} className="mb-8">
                        <div className="w-28 h-28 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/10">
                            <div className="flex flex-col items-center">
                                <span className="text-5xl leading-none">🐾</span>
                                <span className="text-white/60 text-[9px] mt-1 font-medium">PANTERA</span>
                            </div>
                        </div>
                        <h1 className="text-5xl text-white mb-1 font-bold">AbltyCheck</h1>
                        <p className="text-uam-orange text-lg mb-4 font-semibold tracking-widest">UAM-C</p>
                        <p className="text-white/70 text-lg max-w-sm mx-auto">Plataforma de práctica para estudiantes de Ingeniería</p>
                    </motion.div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
                <motion.div key={isLogin ? "login" : "register"} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-lg">
                    <h2 className="text-3xl text-uam-text mb-2 font-bold">{isLogin ? "¡Bienvenido de vuelta!" : "Crear cuenta"}</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        {isLogin ? "Ingresa con tu Matrícula Universitaria" : "Regístrate con tu información institucional de la UAM Cuajimalpa"}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-uam-text mb-2 font-medium">Matrícula Universitaria</label>
                            <div className="relative">
                                <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" required value={isLogin ? loginData.matricula : registerData.matricula}
                                       onChange={(e) => {
                                           const val = e.target.value.replace(/\D/g, '');
                                           // 👈 Usamos if/else en vez de ternarios
                                           if (isLogin) {
                                               setLoginData({ ...loginData, matricula: val });
                                           } else {
                                               setRegisterData({ ...registerData, matricula: val });
                                           }
                                       }}
                                       placeholder="Ej. 2193000000"
                                       className="w-full pl-14 pr-5 py-4 bg-uam-bg border-2 border-gray-100 rounded-2xl focus:border-uam-orange focus:bg-white focus:outline-none transition-all text-lg font-sans text-uam-text"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm text-uam-text mb-2 font-medium">Nombre Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="text" required value={registerData.nombre} onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                                               placeholder="Ej. Edgar Morales"
                                               className="w-full pl-14 pr-5 py-4 bg-uam-bg border-2 border-gray-100 rounded-2xl focus:border-uam-orange focus:bg-white focus:outline-none transition-all text-lg font-sans text-uam-text"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-uam-text mb-2 font-medium">Correo Institucional</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="email" required value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                               placeholder="correo@alumnos.uam.mx"
                                               className="w-full pl-14 pr-5 py-4 bg-uam-bg border-2 border-gray-100 rounded-2xl focus:border-uam-orange focus:bg-white focus:outline-none transition-all text-lg font-sans text-uam-text"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm text-uam-text mb-2 font-medium">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type={showPassword ? "text" : "password"} required value={isLogin ? loginData.password : registerData.password}
                                       onChange={(e) => {
                                           // 👈 Usamos if/else en vez de ternarios
                                           if (isLogin) {
                                               setLoginData({ ...loginData, password: e.target.value });
                                           } else {
                                               setRegisterData({ ...registerData, password: e.target.value });
                                           }
                                       }}
                                       placeholder="••••••••"
                                       className="w-full pl-14 pr-14 py-4 bg-uam-bg border-2 border-gray-100 rounded-2xl focus:border-uam-orange focus:bg-white focus:outline-none transition-all text-lg font-sans text-uam-text"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-sm text-uam-text mb-2 font-medium">Confirmar contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type={showConfirm ? "text" : "password"} required value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                           placeholder="••••••••"
                                           className="w-full pl-14 pr-14 py-4 bg-uam-bg border-2 border-gray-100 rounded-2xl focus:border-uam-orange focus:bg-white focus:outline-none transition-all text-lg font-sans text-uam-text"
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-uam-red text-sm text-center font-semibold bg-red-50 py-3 rounded-xl border border-red-200">
                                {error}
                            </motion.div>
                        )}

                        <button type="submit" disabled={loading} className="w-full py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-lg font-bold disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer">
                            {loading ? "Procesando..." : (isLogin ? "Iniciar Sesión" : "Crear Cuenta")}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-uam-orange hover:opacity-80 transition-colors font-medium cursor-pointer">
                            {isLogin ? "¿No tienes cuenta? Regístrate aquí 👉" : "👈 Ya tengo cuenta, iniciar sesión"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
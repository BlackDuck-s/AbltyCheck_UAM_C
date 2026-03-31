export interface Opcion { texto: string; esCorrecta: boolean; }
export interface Reactivo { id?: string; enunciado: string; areaConocimiento: string; dificultad: string; autorId: string; opciones: Opcion[]; }
export interface Evaluacion { id?: string; titulo: string; area: string; autorId: string; estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'; preguntas: Reactivo[]; }
export interface Usuario { id?: string; matricula: string; email: string; rol: 'ALUMNO' | 'MODERADOR'; }
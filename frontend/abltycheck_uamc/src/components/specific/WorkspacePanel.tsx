import { CheckCircle2, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Option {
    id: string; // Usaremos el texto mismo como ID por simplicidad
    text: string;
}

interface WorkspacePanelProps {
    question: string;
    options: Option[];
    isLastQuestion: boolean; // Para saber si el botón debe decir "Siguiente" o "Finalizar"
    isSubmitting: boolean;   // Para deshabilitar botones mientras el backend califica
    onNext: (selectedText: string) => void;
}

export function WorkspacePanel({
                                   question,
                                   options,
                                   isLastQuestion,
                                   isSubmitting,
                                   onNext,
                               }: WorkspacePanelProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleNextClick = () => {
        if (selectedOption) {
            onNext(selectedOption); // Le pasamos la respuesta seleccionada al padre
            setSelectedOption(null); // Reseteamos la selección para la siguiente pregunta
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm p-8 h-full flex flex-col">
            {/* Question */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-[#1D1D1B] mb-4">Selecciona tu respuesta</h3>
                <p className="text-[#334155] leading-relaxed font-medium">{question}</p>
            </div>

            {/* Options */}
            <div className="flex-1 space-y-3 mb-6 overflow-y-auto">
                {options.map((option) => {
                    const isSelected = selectedOption === option.id;

                    return (
                        <button
                            key={option.id}
                            onClick={() => setSelectedOption(option.id)}
                            disabled={isSubmitting}
                            className={`
                                w-full text-left px-6 py-4 rounded-2xl border-2 transition-all duration-200
                                ${!isSubmitting && "hover:border-[#F28224]/50 hover:bg-[#F28224]/5"}
                                ${isSelected && "border-[#F28224] bg-[#F28224]/10 shadow-sm shadow-[#F28224]/10"}
                                ${!isSelected && "border-gray-100 bg-white"}
                                ${isSubmitting && "cursor-not-allowed opacity-70"}
                            `}
                        >
                            <div className="flex items-center gap-4">
                                {/* Radio Circle */}
                                <div
                                    className={`
                                        w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                                        ${isSelected ? "border-[#F28224] bg-[#F28224]" : "border-gray-300"}
                                    `}
                                >
                                    {isSelected && (
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    )}
                                </div>

                                {/* Option Text */}
                                <span
                                    className={`
                                        font-medium text-lg leading-relaxed
                                        ${isSelected ? "text-[#1D1D1B] font-bold" : "text-[#475569]"}
                                    `}
                                >
                                    {option.text}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                    onClick={handleNextClick}
                    disabled={!selectedOption || isSubmitting}
                    className={`
                        flex-1 py-4 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-lg
                        ${selectedOption && !isSubmitting
                        ? "bg-[#F28224] hover:bg-[#D97120] text-white hover:shadow-lg hover:shadow-[#F28224]/25 hover:-translate-y-0.5 active:translate-y-0"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }
                    `}
                >
                    {isSubmitting ? (
                        "Calificando..."
                    ) : isLastQuestion ? (
                        "Finalizar Evaluación"
                    ) : (
                        <>
                            Siguiente Pregunta <ChevronRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
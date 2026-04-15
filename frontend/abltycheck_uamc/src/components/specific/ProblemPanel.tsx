import { BookOpen, Clock } from "lucide-react";

interface ProblemPanelProps {
    title: string;
    difficulty?: string;
    topic: string;
    timeEstimate?: string;
    description: string;
}

export function ProblemPanel({
                                 title,
                                 difficulty = "Media",
                                 topic,
                                 timeEstimate = "3 min",
                                 description,
                             }: ProblemPanelProps) {

    const getDifficultyColor = () => {
        switch (difficulty?.toLowerCase()) {
            case "fácil":
                return "bg-[#5C9631]/10 text-[#5C9631] border-[#5C9631]/20";
            case "difícil":
                return "bg-[#CD1027]/10 text-[#CD1027] border-[#CD1027]/20";
            default: // Media
                return "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20";
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm p-8 h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#1D1D1B] mb-3 leading-tight">{title}</h2>
                    <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getDifficultyColor()}`}>
              {difficulty}
            </span>
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#1675BB]/10 text-[#1675BB] border border-[#1675BB]/20 uppercase tracking-wider">
              {topic}
            </span>
                        <div className="flex items-center gap-1.5 text-[#64748B] ml-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">{timeEstimate}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description / Enunciado */}
            <div className="mb-6 bg-[#F8F9FA] p-6 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                    <BookOpen className="w-5 h-5 text-[#F28224]" />
                    <h3 className="text-lg font-bold text-[#1D1D1B]">Enunciado del Problema</h3>
                </div>
                <p className="text-[#334155] leading-relaxed text-lg whitespace-pre-line font-medium">
                    {description}
                </p>
            </div>
        </div>
    );
}
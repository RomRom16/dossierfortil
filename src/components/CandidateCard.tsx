import { User, FileText, Phone, Mail, ChevronRight } from 'lucide-react';
import type { Candidate } from '../lib/api';

type Props = {
    candidate: Candidate;
    onClick: () => void;
};

export function CandidateCard({ candidate, onClick }: Props) {
    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-slate-100 transition-all cursor-pointer relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-600 font-bold text-lg shadow-inner">
                        {candidate.full_name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors">
                            {candidate.full_name}
                        </h3>
                        <div className="flex flex-col gap-1 mt-1">
                            {candidate.email && (
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <Mail className="w-3.5 h-3.5" />
                                    {candidate.email}
                                </div>
                            )}
                            {candidate.phone && (
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <Phone className="w-3.5 h-3.5" />
                                    {candidate.phone}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400 group-hover:text-orange-500 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">{candidate.dossier_count || 0}</span>
                    <span className="text-gray-400">dossiers</span>
                </div>
                <span className="text-xs text-gray-400">
                    Ajouté le {new Date(candidate.created_at).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
}

import { Briefcase, Calendar, Wrench, MapPin } from 'lucide-react';
import type { ProfileWithDetails } from '../lib/api';

type Props = {
    profile: ProfileWithDetails;
};

export function DossierCard({ profile }: Props) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{profile.full_name}</h3>
                        <p className="text-orange-600 font-medium text-sm mt-1">{profile.job_title}</p>
                    </div>
                    <span className="text-xs text-gray-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        Mis à jour le {new Date(profile.updated_at).toLocaleDateString()}
                    </span>
                </div>

                {profile.candidate_description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 bg-slate-50 p-3 rounded-lg italic border-l-2 border-orange-300">
                        "{profile.candidate_description}"
                    </p>
                )}

                <div className="space-y-3">
                    {/* Top Expertise */}
                    {profile.general_expertises.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {profile.general_expertises.slice(0, 5).map(exp => (
                                <span key={exp.id} className="text-xs font-medium px-2 py-1 bg-orange-50 text-orange-700 rounded-md border border-orange-100">
                                    {exp.expertise}
                                </span>
                            ))}
                            {profile.general_expertises.length > 5 && (
                                <span className="text-xs text-gray-400 px-2 py-1">+ {profile.general_expertises.length - 5}</span>
                            )}
                        </div>
                    )}

                    {/* Recent Experience */}
                    {profile.experiences.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2 pt-2 border-t border-slate-50">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span>Dernière exp: </span>
                            <span className="font-semibold">{profile.experiences[0].company}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { ArrowLeft, Printer, Building, Calendar, Award, Wrench, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiGetProfileDetails, type ProfileWithDetails } from '../lib/api';

type Props = {
    profileId: string;
    onBack: () => void;
};

export function DossierView({ profileId, onBack }: Props) {
    const { user } = useAuth();
    const [profile, setProfile] = useState<ProfileWithDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && profileId) {
            loadProfile();
        }
    }, [user, profileId]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await apiGetProfileDetails(user!, profileId);
            setProfile(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Chargement du dossier...</div>;
    if (!profile) return <div className="p-8 text-center text-red-500">Dossier introuvable</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Action Bar (Hidden on print) */}
            <div className="flex justify-between items-center mb-6 print:hidden">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </button>
                <button
                    onClick={handlePrint}
                    className="btn-primary flex items-center gap-2"
                >
                    <Printer className="w-4 h-4" />
                    Imprimer / PDF
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 print:shadow-none print:border-none">
                {/* Header */}
                <div className="p-8 md:p-12 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Briefcase className="w-32 h-32" />
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{profile.full_name}</h1>
                        <div className="flex flex-wrap gap-4 items-center">
                            <p className="text-xl text-orange-400 font-semibold">{profile.job_title || 'Expert'}</p>
                            <span className="w-2 h-2 rounded-full bg-slate-600 hidden md:block"></span>
                            <div className="flex flex-wrap gap-2 text-slate-300">
                                {(profile.roles || []).map((role, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Sidebar */}
                    <div className="w-full md:w-80 bg-slate-50 p-8 border-r border-slate-100 space-y-12">
                        {/* Expertises */}
                        {(profile.general_expertises || []).length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Award className="w-4 h-4 text-orange-500" />
                                    Compétences Clés
                                </h3>
                                <div className="space-y-3">
                                    {profile.general_expertises.map(exp => (
                                        <div key={exp.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-medium text-slate-700">
                                            {exp.expertise}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tools */}
                        {(profile.tools || []).length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Wrench className="w-4 h-4 text-orange-500" />
                                    Outils & Tech
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.tools.map(tool => (
                                        <span key={tool.id} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-semibold">
                                            {tool.tool_name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {(profile.educations || []).length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Award className="w-4 h-4 text-orange-500" />
                                    Formation
                                </h3>
                                <div className="space-y-4">
                                    {profile.educations.map(edu => (
                                        <div key={edu.id}>
                                            <p className="font-bold text-slate-800 text-sm leading-tight">{edu.degree_or_certification}</p>
                                            <p className="text-slate-500 text-xs mt-1">{edu.institution}</p>
                                            <p className="text-orange-600 font-bold text-xs mt-1">{edu.year}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-8 md:p-12 bg-white space-y-12">
                        {/* Summary */}
                        {profile.candidate_description && (
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Profil</h2>
                                <div className="text-slate-600 leading-relaxed text-lg italic border-l-4 border-orange-500 pl-6">
                                    {profile.candidate_description}
                                </div>
                            </div>
                        )}

                        {/* Experiences */}
                        {(profile.experiences || []).length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                    <Briefcase className="w-6 h-6 text-orange-500" />
                                    Expériences Professionnelles
                                </h2>
                                <div className="relative space-y-12 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100 ml-3">
                                    {profile.experiences.map((exp) => (
                                        <div key={exp.id} className="relative pl-8 group">
                                            <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-slate-100 border-2 border-white ring-2 ring-orange-500 z-10"></div>

                                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                                                <div>
                                                    <h4 className="text-xl font-bold text-slate-900">{exp.job_title}</h4>
                                                    <div className="flex items-center gap-2 text-orange-600 font-semibold mt-1">
                                                        <Building className="w-4 h-4" />
                                                        {exp.company}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-sm font-medium whitespace-nowrap">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(exp.start_date).toLocaleDateString()} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Présent'}
                                                </div>
                                            </div>

                                            <div className="space-y-4 text-slate-600">
                                                {exp.project && (
                                                    <p className="font-medium text-slate-800">Projet : {exp.project}</p>
                                                )}
                                                {exp.responsibilities && (
                                                    <div className="whitespace-pre-line leading-relaxed">
                                                        {exp.responsibilities}
                                                    </div>
                                                )}
                                                {exp.technical_environment && (
                                                    <div className="pt-4 border-t border-slate-50">
                                                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Environnement Technique</h5>
                                                        <p className="text-sm font-medium text-slate-700">{exp.technical_environment}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, FileText, Calendar, Mail, Phone, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiGetCandidateDetails, type CandidateWithProfiles } from '../lib/api';
import { DossierCard } from './DossierCard';

type Props = {
    candidateId: string;
    onBack: () => void;
    onCreateDossier: (name: string) => void;
};

export function CandidateDetails({ candidateId, onBack, onCreateDossier }: Props) {
    const { user } = useAuth();
    const [data, setData] = useState<CandidateWithProfiles | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && candidateId) loadDetails();
    }, [user, candidateId]);

    const loadDetails = async () => {
        try {
            setLoading(true);
            const res = await apiGetCandidateDetails(user!, candidateId);
            setData(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Chargement du profil...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Candidat introuvable</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour aux candidats
            </button>

            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 relative">
                    <div className="absolute -bottom-10 left-8">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-3xl font-bold text-orange-600">
                            {data.full_name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
                <div className="pt-12 px-8 pb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{data.full_name}</h1>
                            <p className="text-gray-500 mt-1 flex items-center gap-4">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Ajouté le {new Date(data.created_at).toLocaleDateString()}
                                </span>
                            </p>
                        </div>
                        <button
                            onClick={() => onCreateDossier(data.full_name)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Nouveau Dossier
                        </button>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                                <p className="text-gray-900 font-medium">{data.email || 'Non renseigné'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Téléphone</p>
                                <p className="text-gray-900 font-medium">{data.phone || 'Non renseigné'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Dossiers</p>
                                <p className="text-gray-900 font-medium">{data.profiles.length} actifs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dossiers List */}
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-500" />
                Dossiers de compétences
            </h2>

            {data.profiles.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">Aucun dossier créé pour ce candidat.</p>
                    <button onClick={() => onCreateDossier(data.full_name)} className="text-orange-600 font-medium mt-2 hover:underline">
                        Créer le premier dossier
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {data.profiles.map(p => (
                        <DossierCard key={p.id} profile={p} />
                    ))}
                </div>
            )}
        </div>
    );
}

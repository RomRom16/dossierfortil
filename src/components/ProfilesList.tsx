import { useState, useEffect } from 'react';
import { ArrowLeft, Briefcase, Calendar, Award, Wrench } from 'lucide-react';
import { supabase, Profile, Experience, Education, GeneralExpertise, Tool } from '../lib/supabase';

type ProfileWithDetails = Profile & {
  general_expertises: GeneralExpertise[];
  tools: Tool[];
  experiences: Experience[];
  educations: Education[];
};

type Props = {
  onBack: () => void;
};

export default function ProfilesList({ onBack }: Props) {
  const [profiles, setProfiles] = useState<ProfileWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const profilesWithDetails = await Promise.all(
        (profilesData || []).map(async profile => {
          const [expertisesRes, toolsRes, experiencesRes, educationsRes] = await Promise.all([
            supabase
              .from('general_expertises')
              .select('*')
              .eq('profile_id', profile.id)
              .order('created_at', { ascending: true }),
            supabase
              .from('tools')
              .select('*')
              .eq('profile_id', profile.id)
              .order('created_at', { ascending: true }),
            supabase
              .from('experiences')
              .select('*')
              .eq('profile_id', profile.id)
              .order('start_date', { ascending: false }),
            supabase
              .from('educations')
              .select('*')
              .eq('profile_id', profile.id)
              .order('year', { ascending: false }),
          ]);

          return {
            ...profile,
            general_expertises: expertisesRes.data || [],
            tools: toolsRes.data || [],
            experiences: experiencesRes.data || [],
            educations: educationsRes.data || [],
          };
        })
      );

      setProfiles(profilesWithDetails);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Erreur lors du chargement des profils');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-xl text-slate-600">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Retour au formulaire
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">
            Profils enregistrés ({profiles.length})
          </h1>

          {profiles.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              Aucun profil enregistré pour le moment
            </div>
          ) : (
            <div className="space-y-8">
              {profiles.map(profile => (
                <div
                  key={profile.id}
                  className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      {profile.job_title}
                    </h2>
                    {profile.candidate_description && (
                      <p className="text-slate-600 leading-relaxed">
                        {profile.candidate_description}
                      </p>
                    )}
                    <p className="text-sm text-slate-400 mt-2">
                      Créé le {new Date(profile.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  {profile.general_expertises.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Briefcase size={20} />
                        Expertises générales
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        {profile.general_expertises.map(exp => (
                          <li key={exp.id}>{exp.expertise}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {profile.tools.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Wrench size={20} />
                        Outils et technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.tools.map(tool => (
                          <span
                            key={tool.id}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {tool.tool_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.experiences.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Calendar size={20} />
                        Expériences professionnelles
                      </h3>
                      <div className="space-y-4">
                        {profile.experiences.map(exp => (
                          <div
                            key={exp.id}
                            className="pl-4 border-l-4 border-blue-500 bg-slate-50 p-4 rounded-r"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-slate-800">{exp.company}</h4>
                              <span className="text-sm text-slate-500">
                                {formatDate(exp.start_date)} -{' '}
                                {exp.end_date ? formatDate(exp.end_date) : 'Présent'}
                              </span>
                            </div>

                            {exp.project && (
                              <p className="text-slate-700 font-medium mb-2">
                                Projet: {exp.project}
                              </p>
                            )}

                            {exp.context && (
                              <p className="text-slate-600 mb-3">{exp.context}</p>
                            )}

                            {exp.responsibilities && (
                              <div className="mb-2">
                                <p className="text-sm font-medium text-slate-700 mb-1">
                                  Responsabilités:
                                </p>
                                <p className="text-sm text-slate-600">{exp.responsibilities}</p>
                              </div>
                            )}

                            {exp.technical_environment && (
                              <div>
                                <p className="text-sm font-medium text-slate-700 mb-1">
                                  Environnement technique:
                                </p>
                                <p className="text-sm text-slate-600">{exp.technical_environment}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.educations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Award size={20} />
                        Diplômes et certifications
                      </h3>
                      <div className="space-y-2">
                        {profile.educations.map(edu => (
                          <div
                            key={edu.id}
                            className="flex justify-between items-center p-3 bg-slate-50 rounded"
                          >
                            <div>
                              <p className="font-medium text-slate-800">
                                {edu.degree_or_certification}
                              </p>
                              {edu.institution && (
                                <p className="text-sm text-slate-600">{edu.institution}</p>
                              )}
                            </div>
                            {edu.year && (
                              <span className="text-slate-500 font-medium">{edu.year}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

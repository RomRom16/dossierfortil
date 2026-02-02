import { useState } from 'react';
import { Plus, Trash2, Save, List, User, Briefcase, GraduationCap, Wrench, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

type ExperienceForm = {
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  job_title: string;
  sector: string;
  project: string;
  responsibilities: string;
  technical_environment: string;
};

type EducationForm = {
  degree: string;
  year: string;
  institution: string;
};

type FormData = {
  full_name: string;
  roles: string[];
  candidate_description: string;
  general_expertises: string[];
  tools: string[];
  experiences: ExperienceForm[];
  educations: EducationForm[];
};

const initialExperience: ExperienceForm = {
  company: '',
  location: '',
  start_date: '',
  end_date: '',
  job_title: '',
  sector: '',
  project: '',
  responsibilities: '',
  technical_environment: '',
};

const initialEducation: EducationForm = {
  degree: '',
  year: '',
  institution: '',
};

type Props = {
  onViewProfiles: () => void;
};

export default function ProfileForm({ onViewProfiles }: Props) {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    roles: [''],
    candidate_description: '',
    general_expertises: [''],
    tools: [''],
    experiences: [{ ...initialExperience }],
    educations: [{ ...initialEducation }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAddItem = (field: 'roles' | 'general_expertises' | 'tools') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleRemoveItem = (field: 'roles' | 'general_expertises' | 'tools', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (field: 'roles' | 'general_expertises' | 'tools', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleAddExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { ...initialExperience }],
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const handleExperienceChange = (index: number, field: keyof ExperienceForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      educations: [...prev.educations, { ...initialEducation }],
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (index: number, field: keyof EducationForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          full_name: formData.full_name,
          roles: formData.roles.filter(r => r.trim()),
          candidate_description: formData.candidate_description,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      const profileId = profile.id;

      const expertisesData = formData.general_expertises
        .filter(e => e.trim())
        .map(expertise => ({
          profile_id: profileId,
          expertise: expertise.trim(),
        }));

      if (expertisesData.length > 0) {
        const { error: expertisesError } = await supabase
          .from('general_expertises')
          .insert(expertisesData);
        if (expertisesError) throw expertisesError;
      }

      const toolsData = formData.tools
        .filter(t => t.trim())
        .map(tool => ({
          profile_id: profileId,
          tool_name: tool.trim(),
        }));

      if (toolsData.length > 0) {
        const { error: toolsError } = await supabase.from('tools').insert(toolsData);
        if (toolsError) throw toolsError;
      }

      const experiencesData = formData.experiences
        .filter(exp => exp.company.trim() && exp.start_date)
        .map(exp => ({
          profile_id: profileId,
          company: exp.company.trim(),
          location: exp.location.trim(),
          start_date: exp.start_date,
          end_date: exp.end_date || null,
          job_title: exp.job_title.trim(),
          sector: exp.sector.trim(),
          project: exp.project.trim(),
          responsibilities: exp.responsibilities.trim(),
          technical_environment: exp.technical_environment.trim(),
        }));

      if (experiencesData.length > 0) {
        const { error: experiencesError } = await supabase
          .from('experiences')
          .insert(experiencesData);
        if (experiencesError) throw experiencesError;
      }

      const educationsData = formData.educations
        .filter(edu => edu.degree.trim())
        .map(edu => ({
          profile_id: profileId,
          degree: edu.degree.trim(),
          institution: edu.institution.trim(),
          year: edu.year ? parseInt(edu.year) : null,
        }));

      if (educationsData.length > 0) {
        const { error: educationsError } = await supabase
          .from('educations')
          .insert(educationsData);
        if (educationsError) throw educationsError;
      }

      setMessage({ type: 'success', text: 'Profil créé avec succès!' });
      setFormData({
        full_name: '',
        roles: [''],
        candidate_description: '',
        general_expertises: [''],
        tools: [''],
        experiences: [{ ...initialExperience }],
        educations: [{ ...initialEducation }],
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la création du profil' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-blue-100">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#262626]">Formulaire de Profil Professionnel</h1>
            <button
              type="button"
              onClick={onViewProfiles}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <List size={20} />
              Voir les profils
            </button>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-6 h-6 text-[#FF6D00]" />
                <h2 className="text-2xl font-semibold text-[#262626] border-b-2 border-[#FF6D00] pb-2">
                  Informations personnelles
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#262626] mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, full_name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                  placeholder="Ex: Roméo Probst"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#262626] mb-2">
                  Rôles
                </label>
                {formData.roles.map((role, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={role}
                      onChange={e => handleItemChange('roles', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                      placeholder="Ex: AMOA / Chef de projet / Business Analyst / Développeur"
                    />
                    {formData.roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('roles', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddItem('roles')}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un rôle
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#262626] mb-2">
                  Description du profil
                </label>
                <textarea
                  value={formData.candidate_description}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, candidate_description: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                  placeholder="Décrivez votre profil professionnel et vos aspirations..."
                />
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-6 h-6 text-[#FF6D00]" />
                <h2 className="text-2xl font-semibold text-[#262626] border-b-2 border-[#FF6D00] pb-2">
                  Expertises
                </h2>
              </div>
              {formData.general_expertises.map((expertise, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={expertise}
                    onChange={e => handleItemChange('general_expertises', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                    placeholder="Ex: Analyse et formalisation des besoins métiers"
                  />
                  {formData.general_expertises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('general_expertises', index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddItem('general_expertises')}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Ajouter une expertise
              </button>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Wrench className="w-6 h-6 text-[#FF6D00]" />
                <h2 className="text-2xl font-semibold text-[#262626] border-b-2 border-[#FF6D00] pb-2">
                  Outils et technologies
                </h2>
              </div>
              {formData.tools.map((tool, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tool}
                    onChange={e => handleItemChange('tools', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                    placeholder="Ex: JavaScript, React, Node.js"
                  />
                  {formData.tools.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('tools', index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddItem('tools')}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Ajouter un outil
              </button>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-6 h-6 text-[#FF6D00]" />
                <h2 className="text-2xl font-semibold text-[#262626] border-b-2 border-[#FF6D00] pb-2">
                  Expériences professionnelles
                </h2>
              </div>
              {formData.experiences.map((experience, expIndex) => (
                <div key={expIndex} className="p-6 bg-blue-50/50 rounded-lg space-y-4 relative border border-blue-200">
                  {formData.experiences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(expIndex)}
                      className="absolute top-4 right-4 px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}

                  <h3 className="font-semibold text-lg text-blue-800">
                    Expérience {expIndex + 1}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#262626] mb-2">
                        Entreprise *
                      </label>
                      <input
                        type="text"
                        value={experience.company}
                        onChange={e =>
                          handleExperienceChange(expIndex, 'company', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                        placeholder="Ex: Eurométropole de Strasbourg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#262626] mb-2">
                        Localisation
                      </label>
                      <input
                        type="text"
                        value={experience.location}
                        onChange={e =>
                          handleExperienceChange(expIndex, 'location', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                        placeholder="Ex: Strasbourg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#262626] mb-2">
                        Poste occupé
                      </label>
                      <input
                        type="text"
                        value={experience.job_title}
                        onChange={e =>
                          handleExperienceChange(expIndex, 'job_title', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                        placeholder="Ex: Chef de projet SI / Développeur"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#262626] mb-2">
                        Secteur
                      </label>
                      <input
                        type="text"
                        value={experience.sector}
                        onChange={e =>
                          handleExperienceChange(expIndex, 'sector', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                        placeholder="Ex: Administration publique – Collectivité territoriale"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#262626] mb-2">
                        Date de début *
                      </label>
                      <input
                        type="date"
                        value={experience.start_date}
                        onChange={e =>
                          handleExperienceChange(expIndex, 'start_date', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#262626] mb-2">
                        Date de fin
                      </label>
                      <input
                        type="date"
                        value={experience.end_date}
                        onChange={e =>
                          handleExperienceChange(expIndex, 'end_date', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Projet
                    </label>
                    <input
                      type="text"
                      value={experience.project}
                      onChange={e =>
                        handleExperienceChange(expIndex, 'project', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                      placeholder="Nom du projet"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Responsabilités
                    </label>
                    <textarea
                      value={experience.responsibilities}
                      onChange={e =>
                        handleExperienceChange(expIndex, 'responsibilities', e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                      placeholder="Décrivez vos responsabilités dans ce poste..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Environnement technique
                    </label>
                    <textarea
                      value={experience.technical_environment}
                      onChange={e =>
                        handleExperienceChange(expIndex, 'technical_environment', e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                      placeholder="Ex: Java, Spring Boot, PostgreSQL, Docker, Kubernetes..."
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddExperience}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Ajouter une expérience
              </button>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-6 h-6 text-[#FF6D00]" />
                <h2 className="text-2xl font-semibold text-[#262626] border-b-2 border-[#FF6D00] pb-2">
                  Diplômes et certifications
                </h2>
              </div>
              {formData.educations.map((education, index) => (
                <div key={index} className="p-4 bg-blue-50/30 rounded-lg space-y-4 relative border border-blue-200">
                  {formData.educations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="absolute top-4 right-4 px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#262626] mb-2">
                        Diplôme
                      </label>
                      <input
                        type="text"
                        value={education.degree}
                        onChange={e =>
                          handleEducationChange(index, 'degree', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                        placeholder="Ex: Master en Informatique"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#262626] mb-2">
                        Année
                      </label>
                      <input
                        type="number"
                        value={education.year}
                        onChange={e => handleEducationChange(index, 'year', e.target.value)}
                        className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                        placeholder="2020"
                        min="1950"
                        max="2100"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-[#262626] mb-2">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={education.institution}
                        onChange={e =>
                          handleEducationChange(index, 'institution', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30"
                        placeholder="Nom de l'établissement"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddEducation}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Ajouter un diplôme/certification
              </button>
            </section>

            <div className="flex justify-end pt-6 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Save size={20} />
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer le profil'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

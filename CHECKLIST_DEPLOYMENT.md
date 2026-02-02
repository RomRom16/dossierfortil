# Checklist de Déploiement - Authentification Microsoft

## Phase 1 : Configuration locale

- [ ] Compte Supabase créé
- [ ] Clés Supabase copiées (URL + anon key)
- [ ] Fichier .env.local créé
- [ ] npm install exécuté
- [ ] npm run dev - pas d'erreur
- [ ] Page login visible sans erreur

## Phase 2 : Configuration Azure

- [ ] App Azure créée (portal.azure.com)
- [ ] Redirect URI configurée dans Azure
- [ ] Client ID copié
- [ ] Tenant ID copié
- [ ] Secret client créé et copié

## Phase 3 : Configuration Supabase

- [ ] Azure activé dans Supabase (Authentification > Fournisseurs)
- [ ] Client ID rempli
- [ ] Tenant ID rempli
- [ ] Client Secret rempli
- [ ] Changements enregistrés

## Phase 4 : Tests locaux

- [ ] npm run typecheck - OK
- [ ] npm run lint - OK
- [ ] npm run build - OK
- [ ] Clic sur "Connexion Microsoft" fonctionne
- [ ] Redirection vers Microsoft OK
- [ ] Retour au dashboard OK
- [ ] Email s'affiche
- [ ] Déconnexion fonctionne
- [ ] Access sans login = redirect /login

## Phase 5 : Avant déploiement

- [ ] Variables d'env configurées en production
- [ ] CORS configuré dans Supabase
- [ ] URL de callback mise à jour
- [ ] RLS activé dans Supabase
- [ ] Test sur domaine de production

## Phase 6 : Déploiement

- [ ] Repo GitHub créé
- [ ] Vercel/Netlify connecté
- [ ] Variables d'env ajoutées
- [ ] Build automatique OK
- [ ] Test sur domaine de production

## Après déploiement

- [ ] Page de login charge
- [ ] Connexion Microsoft OK
- [ ] Dashboard s'affiche
- [ ] Logout OK
- [ ] Session conservée après rechargement
- [ ] HTTPS activé
- [ ] Pas d'erreur console

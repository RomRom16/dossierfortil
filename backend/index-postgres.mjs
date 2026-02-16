import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'crypto';

const app = express();

// Database connection
const sql = neon(process.env.DATABASE_URL || '');

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// --- INIT DB ---
async function initDatabase() {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        full_name TEXT
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('business_manager','admin')),
        PRIMARY KEY (user_id, role),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS candidates (
        id TEXT PRIMARY KEY,
        manager_id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        FOREIGN KEY (manager_id) REFERENCES users(id)
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        manager_id TEXT NOT NULL,
        candidate_id TEXT,
        full_name TEXT NOT NULL,
        roles TEXT,
        job_title TEXT,
        candidate_description TEXT,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        FOREIGN KEY (manager_id) REFERENCES users(id),
        FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS general_expertises (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL,
        expertise TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS tools (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL,
        tool_name TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS experiences (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT,
        start_date TEXT,
        end_date TEXT,
        job_title TEXT,
        sector TEXT,
        context TEXT,
        project TEXT,
        expertises TEXT,
        tools_used TEXT,
        responsibilities TEXT,
        technical_environment TEXT,
        created_at TIMESTAMP NOT NULL,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS educations (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL,
        degree_or_certification TEXT NOT NULL,
        institution TEXT,
        year INTEGER,
        created_at TIMESTAMP NOT NULL,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
      )
    `;

        console.log('✅ Database tables initialized');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
}

// Initialize database on startup
initDatabase();

const now = () => new Date().toISOString();

// --- Utility Functions ---
async function parseCvWithAI(text) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.warn('[CV AI] OPENAI_API_KEY not defined. Using minimal parsing.');
        const firstLine = text.split('\n').find(line => line.trim()) ?? 'Candidat';
        return {
            full_name: firstLine.trim(),
            roles: [],
            candidate_description: '',
            general_expertises: [],
            tools: [],
            experiences: [],
            educations: [],
        };
    }

    const body = {
        model: process.env.OPENAI_CV_MODEL || 'gpt-4-turbo-preview',
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content:
                    'Tu es un assistant qui extrait des informations structurées à partir de CV texte. ' +
                    'Tu dois retourner UNIQUEMENT un JSON valide, sans texte additionnel, au format suivant : ' +
                    '{ "full_name": string, "roles": string[], "candidate_description": string, "general_expertises": string[], "tools": string[], "experiences": [{ "company": string, "location": string, "start_date": string, "end_date": string, "job_title": string, "sector": string, "project": string, "responsibilities": string, "technical_environment": string }], "educations": [{ "degree_or_certification": string, "year": string, "institution": string }] }.',
            },
            {
                role: 'user',
                content: `Voici le texte brut d'un CV. Extrait et structure les informations selon le format demandé.\n\n"""${text}"""`,
            },
        ],
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[CV AI] OpenAI API Error:', response.status, errorText);
        throw new Error('Error calling CV analysis service');
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error('Empty response from AI service');
    }

    try {
        return JSON.parse(content);
    } catch (e) {
        console.error('[CV AI] JSON parsing error:', e, content);
        throw new Error('Invalid JSON response from AI service');
    }
}

// --- Authentication Middleware ---
function authMiddleware(req, res, next) {
    const userId = req.headers['x-user-id'];
    const userEmail = req.headers['x-user-email'];
    const userName = req.headers['x-user-name'];

    if (!userId || !userEmail) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    req.user = { id: userId, email: userEmail, full_name: userName || '' };
    next();
}

// --- Ensure User Exists ---
async function ensureUser(user) {
    const existing = await sql`SELECT * FROM users WHERE id = ${user.id}`;
    if (existing.length === 0) {
        await sql`
      INSERT INTO users (id, email, full_name)
      VALUES (${user.id}, ${user.email}, ${user.full_name || ''})
    `;
    }
}

// ======================
// ROUTES
// ======================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: now() });
});

// Get user roles
app.get('/api/user/roles', authMiddleware, async (req, res) => {
    try {
        await ensureUser(req.user);
        const roles = await sql`
      SELECT role FROM user_roles WHERE user_id = ${req.user.id}
    `;
        res.json(roles.map(r => r.role));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Get all candidates
app.get('/api/candidates', authMiddleware, async (req, res) => {
    try {
        await ensureUser(req.user);

        const roles = await sql`
      SELECT role FROM user_roles WHERE user_id = ${req.user.id}
    `;
        const rolesList = roles.map(r => r.role);

        let candidates;
        if (rolesList.includes('admin')) {
            candidates = await sql`
        SELECT * FROM candidates ORDER BY created_at DESC
      `;
        } else {
            candidates = await sql`
        SELECT * FROM candidates 
        WHERE manager_id = ${req.user.id} 
        ORDER BY created_at DESC
      `;
        }

        res.json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Create candidate
app.post('/api/candidates', authMiddleware, async (req, res) => {
    try {
        await ensureUser(req.user);

        const { full_name, email, phone } = req.body;
        if (!full_name) {
            return res.status(400).json({ error: 'full_name requis' });
        }

        const id = randomUUID();
        const timestamp = now();

        await sql`
      INSERT INTO candidates (id, manager_id, full_name, email, phone, created_at, updated_at)
      VALUES (${id}, ${req.user.id}, ${full_name}, ${email || null}, ${phone || null}, ${timestamp}, ${timestamp})
    `;

        const candidate = await sql`SELECT * FROM candidates WHERE id = ${id}`;
        res.json(candidate[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Get candidate details with profiles
app.get('/api/candidates/:id', authMiddleware, async (req, res) => {
    try {
        await ensureUser(req.user);

        const candidate = await sql`SELECT * FROM candidates WHERE id = ${req.params.id}`;
        if (candidate.length === 0) {
            return res.status(404).json({ error: 'Candidat introuvable' });
        }

        const roles = await sql`
      SELECT role FROM user_roles WHERE user_id = ${req.user.id}
    `;
        const rolesList = roles.map(r => r.role);

        if (!rolesList.includes('admin') && candidate[0].manager_id !== req.user.id) {
            return res.status(403).json({ error: 'Accès interdit' });
        }

        const profiles = await sql`
      SELECT * FROM profiles 
      WHERE candidate_id = ${req.params.id} 
      ORDER BY created_at DESC
    `;

        // Get roles for each profile
        const profilesWithRoles = await Promise.all(
            profiles.map(async (p) => {
                const rolesText = p.roles || '';
                return {
                    ...p,
                    roles: rolesText ? rolesText.split(',').map(r => r.trim()) : []
                };
            })
        );

        res.json({
            ...candidate[0],
            profiles: profilesWithRoles
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Update candidate
app.put('/api/candidates/:id', authMiddleware, async (req, res) => {
    try {
        const { full_name, email, phone } = req.body || {};
        const candidate = await sql`SELECT * FROM candidates WHERE id = ${req.params.id}`;

        if (candidate.length === 0) {
            return res.status(404).json({ error: 'Candidat introuvable' });
        }

        const roles = await sql`
      SELECT role FROM user_roles WHERE user_id = ${req.user.id}
    `;
        const rolesList = roles.map(r => r.role);

        if (!rolesList.includes('admin') && candidate[0].manager_id !== req.user.id) {
            return res.status(403).json({ error: 'Accès interdit' });
        }

        const updatedAt = now();
        await sql`
      UPDATE candidates 
      SET full_name = COALESCE(${full_name}, full_name),
          email = ${email},
          phone = ${phone},
          updated_at = ${updatedAt}
      WHERE id = ${req.params.id}
    `;

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Delete candidate
app.delete('/api/candidates/:id', authMiddleware, async (req, res) => {
    try {
        const candidate = await sql`SELECT * FROM candidates WHERE id = ${req.params.id}`;

        if (candidate.length === 0) {
            return res.status(404).json({ error: 'Candidat introuvable' });
        }

        const roles = await sql`
      SELECT role FROM user_roles WHERE user_id = ${req.user.id}
    `;
        const rolesList = roles.map(r => r.role);

        if (!rolesList.includes('admin') && candidate[0].manager_id !== req.user.id) {
            return res.status(403).json({ error: 'Accès interdit' });
        }

        await sql`DELETE FROM candidates WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Create profile/dossier
app.post('/api/profiles', authMiddleware, async (req, res) => {
    try {
        await ensureUser(req.user);

        const { candidate_id, full_name, roles, job_title, candidate_description } = req.body;

        if (!full_name) {
            return res.status(400).json({ error: 'full_name requis' });
        }

        const id = randomUUID();
        const timestamp = now();
        const rolesText = Array.isArray(roles) ? roles.join(', ') : '';

        await sql`
      INSERT INTO profiles (
        id, manager_id, candidate_id, full_name, roles, job_title, 
        candidate_description, created_at, updated_at
      )
      VALUES (
        ${id}, ${req.user.id}, ${candidate_id || null}, ${full_name}, 
        ${rolesText}, ${job_title || null}, ${candidate_description || null}, 
        ${timestamp}, ${timestamp}
      )
    `;

        const profile = await sql`SELECT * FROM profiles WHERE id = ${id}`;
        res.json(profile[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Delete profile
app.delete('/api/profiles/:id', authMiddleware, async (req, res) => {
    try {
        const profile = await sql`SELECT * FROM profiles WHERE id = ${req.params.id}`;

        if (profile.length === 0) {
            return res.status(404).json({ error: 'Profil introuvable' });
        }

        const roles = await sql`
      SELECT role FROM user_roles WHERE user_id = ${req.user.id}
    `;
        const rolesList = roles.map(r => r.role);

        if (!rolesList.includes('admin') && profile[0].manager_id !== req.user.id) {
            return res.status(403).json({ error: 'Accès interdit' });
        }

        await sql`DELETE FROM profiles WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Parse CV with AI
app.post('/api/parse-cv', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'text requis' });
        }

        const parsed = await parseCvWithAI(text);
        res.json(parsed);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Erreur serveur' });
    }
});

// Export for Vercel serverless
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

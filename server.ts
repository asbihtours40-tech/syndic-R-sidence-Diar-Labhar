import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// AI Route: Reformulate & Structure an Incident report
app.post('/api/ai/draft-incident', async (req, res) => {
  try {
    const { rawDescription, category, location, urgency } = req.body;

    if (!ai) {
      // High-grade fallback
      return res.json({
        title: `Signalement - ${category || 'Parties communes'} (${location || 'Non précisé'})`,
        category: category || 'parties_communes',
        location: location || 'Parties communes',
        urgency: urgency || 'normale',
        description: `Constat signalé par le résident :\n\n${rawDescription || 'Défaut constaté nécessitant une intervention.'}\n\nRecommandation : inspection sur place et transmission au prestataire concerné.`,
        suggestedAction: "Inspection par le gardien / transmission au prestataire contractuel.",
      });
    }

    const prompt = `Tu es un gestionnaire expert de syndic de copropriété en France.
Un résident a saisi les notes brutes suivantes pour un problème dans l'immeuble :
- Catégorie choisie: ${category || 'Non spécifiée'}
- Localisation indiquée: ${location || 'Non spécifiée'}
- Urgence ressentie: ${urgency || 'normale'}
- Notes du résident: "${rawDescription || ''}"

Génère une fiche de signalement claire, polie, factuelle et professionnelle pour faciliter l'intervention du syndic ou du prestataire (plombier, ascensoriste, électricien, serrurier).
Réponds EXCLUSIVEMENT sous la forme d'un objet JSON strict avec les clés:
{
  "title": "Titre clair et concis (ex: Fuite d'eau au palier du 3e étage Bât B)",
  "category": "catégorie normalisée (ascenseur, plomberie, electricite, espaces_verts, securite_acces, parties_communes, nuisances, chauffage)",
  "location": "Localisation précisée et claire",
  "urgency": "basse" | "normale" | "urgente" | "critique",
  "description": "Texte détaillé, professionnel, structuré avec constats factuels et impact sur la copropriété",
  "suggestedAction": "Action immédiate préconisée pour le syndic ou le conseil syndical"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Gemini draft incident error:', error);
    return res.status(500).json({
      error: 'Erreur lors de la génération IA',
      fallback: true,
    });
  }
});

// AI Route: Drafting Syndic/Conseil Syndical reply or official resident letter
app.post('/api/ai/syndic-reply', async (req, res) => {
  try {
    const { incidentTitle, incidentDescription, currentStatus, contextNotes, role } = req.body;

    if (!ai) {
      return res.json({
        reply: `Bonjour,\n\nNous avons bien pris note de votre signalement concernant "${incidentTitle || 'cet incident'}".\nL'équipe technique a d'ores et déjà été mandatée pour une vérification et une intervention rapide au sein de la résidence.\n\nNous vous tiendrons informés dès la fin des travaux.\n\nBien cordialement,\nSyndic - IKRAM -\nRésidence Diar Labhar`,
      });
    }

    const prompt = `Tu es le gestionnaire de syndic professionnel d'une copropriété ou un membre du Conseil Syndical.
Rédige une réponse officielle, courtoise, rassurante et juridiquement appropriée pour un échange avec les résidents.
- Titre de l'incident: ${incidentTitle}
- Détails de l'incident: ${incidentDescription}
- Statut actuel: ${currentStatus}
- Consigne / directive du gestionnaire: ${contextNotes || 'Informer que le prestataire a été mandaté et que le devis est en cours de validation.'}
- Rôle de l'émetteur: ${role || 'Syndic'}

Rédige un message poli, empathique et précis (salutations, actions prises, délai indicatif, formule de politesse).
Réponds uniquement avec le texte du message prêt à être envoyé.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ reply: response.text });
  } catch (error) {
    console.error('Gemini syndic reply error:', error);
    return res.status(500).json({ error: 'Erreur lors de la génération' });
  }
});

// AI Route: Co-ownership Rules & Regulations Explainer (Règlement de copropriété)
app.post('/api/ai/copro-consult', async (req, res) => {
  try {
    const { question } = req.body;

    if (!ai) {
      return res.json({
        answer: "Le règlement de copropriété régit la jouissance des parties privatives et communes. En règle générale, les travaux affectant les parties communes ou l'aspect extérieur (fenêtres, climatiseurs, volets) nécessitent un accord préalable en Assemblée Générale (article 25). Pour les nuisances sonores, le respect de la tranquillité d'autrui est exigé de jour comme de nuit.",
      });
    }

    const prompt = `Tu es un conseiller juridique expert en droit de la copropriété en France (Loi du 10 juillet 1965 et décret de 1967).
Un résident ou membre du conseil syndical te pose la question suivante concernant la vie et la gestion de la copropriété :
"${question}"

Fournis une réponse claire, pédagogique, bienveillante et juridiquement exacte en 3 à 4 paragraphes concis :
1. Principe général selon le droit et la pratique des règlements de copropriété
2. Distinction parties privatives vs parties communes si applicable
3. Démarche concrète recommandée (échange amiable, accord en AG, déclaration syndic)
Reste neutre, professionnel et constructif.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ answer: response.text });
  } catch (error) {
    console.error('Gemini copro consult error:', error);
    return res.status(500).json({ error: 'Erreur lors de la consultation' });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CoproLink server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

export type Locale = 'fr' | 'en'

export const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.dashboard': 'Tableau de bord',
    'nav.characters': 'Personnages',
    'nav.scripts': 'Scripts',
    'nav.videos': 'Vidéos',
    'nav.settings': 'Paramètres',
    'nav.pricing': 'Tarifs',
    'nav.login': 'Connexion',
    'nav.signup': 'Inscription',
    'nav.logout': 'Déconnexion',

    // Auth
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.login': 'Se connecter',
    'auth.signup': "S'inscrire",
    'auth.forgotPassword': 'Mot de passe oublié ?',
    'auth.noAccount': 'Pas encore de compte ?',
    'auth.hasAccount': 'Déjà un compte ?',
    'auth.googleLogin': 'Continuer avec Google',
    'auth.orContinueWith': 'ou continuer avec',

    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.welcome': 'Bienvenue sur DuckFactory',
    'dashboard.characters': 'Personnages',
    'dashboard.scripts': 'Scripts générés',
    'dashboard.videos': 'Vidéos produites',
    'dashboard.published': 'Publications',
    'dashboard.createCharacter': 'Créer un personnage',
    'dashboard.generateScript': 'Générer des scripts',

    // Characters
    'characters.title': 'Mes Personnages',
    'characters.create': 'Créer un personnage',
    'characters.name': 'Nom',
    'characters.personality': 'Personnalité',
    'characters.voice': 'Voix',
    'characters.catchphrase': 'Catchphrase',
    'characters.empty': 'Aucun personnage. Créez le vôtre !',

    // Scripts
    'scripts.title': 'Mes Scripts',
    'scripts.new': 'Nouveau script',
    'scripts.generate': 'Générer le script',
    'scripts.generating': 'Génération en cours...',
    'scripts.topic': 'Sujet du script',
    'scripts.format': 'Format',
    'scripts.tone': 'Ton',
    'scripts.audience': 'Audience',
    'scripts.duration': 'Durée cible',
    'scripts.result': 'Script généré',
    'scripts.hook': 'Accroche',
    'scripts.body': 'Corps',
    'scripts.punchline': 'Punchline',
    'scripts.edit': 'Éditer',
    'scripts.delete': 'Supprimer',
    'scripts.generateVoice': 'Générer la voix',
    'scripts.empty': 'Aucun script. Générez des scripts pour votre personnage !',
    'scripts.status.draft': 'Brouillon',
    'scripts.status.ready': 'Prêt',
    'scripts.status.used': 'Utilisé',

    // Voice
    'voice.generate':      '🎤 Générer la voix',
    'voice.generating':    'Génération en cours...',
    'voice.player.title':  'Voix Cancan',
    'voice.error':         'Erreur lors de la génération de la voix.',
    'voice.success':       'Voix générée avec succès !',

    // Videos
    'videos.title': 'Mes Vidéos',
    'videos.generate': 'Générer la vidéo',
    'videos.download': 'Télécharger',
    'videos.publish': 'Publier sur YouTube',
    'videos.status.pending': 'En attente',
    'videos.status.processing': 'En cours',
    'videos.status.completed': 'Terminé',
    'videos.status.failed': 'Erreur',
    'videos.empty': 'Aucune vidéo. Générez votre première vidéo !',

    // Landing
    'landing.hero.title': 'DuckFactory',
    'landing.hero.tagline': 'Studio IA de production de contenus viraux',
    'landing.hero.subtitle': 'Créez votre personnage IA et produisez des vidéos virales automatiquement.',
    'landing.hero.cta': 'Commencer gratuitement',
    'landing.hero.demo': 'Voir la démo',

    // Pricing
    'pricing.title': 'Tarifs',
    'pricing.free': 'Gratuit',
    'pricing.creator': 'Créateur',
    'pricing.pro': 'Pro',
    'pricing.agency': 'Agence',
    'pricing.perMonth': '/mois',
    'pricing.getStarted': 'Commencer',

    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Éditer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.confirm': 'Confirmer',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.noResults': 'Aucun résultat',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.characters': 'Characters',
    'nav.scripts': 'Scripts',
    'nav.videos': 'Videos',
    'nav.settings': 'Settings',
    'nav.pricing': 'Pricing',
    'nav.login': 'Login',
    'nav.signup': 'Sign up',
    'nav.logout': 'Logout',

    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.login': 'Sign in',
    'auth.signup': 'Sign up',
    'auth.forgotPassword': 'Forgot password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.googleLogin': 'Continue with Google',
    'auth.orContinueWith': 'or continue with',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome to DuckFactory',
    'dashboard.characters': 'Characters',
    'dashboard.scripts': 'Scripts generated',
    'dashboard.videos': 'Videos produced',
    'dashboard.published': 'Publications',
    'dashboard.createCharacter': 'Create a character',
    'dashboard.generateScript': 'Generate scripts',

    // Characters
    'characters.title': 'My Characters',
    'characters.create': 'Create a character',
    'characters.name': 'Name',
    'characters.personality': 'Personality',
    'characters.voice': 'Voice',
    'characters.catchphrase': 'Catchphrase',
    'characters.empty': 'No characters yet. Create yours!',

    // Scripts
    'scripts.title': 'My Scripts',
    'scripts.new': 'New script',
    'scripts.generate': 'Generate script',
    'scripts.generating': 'Generating...',
    'scripts.topic': 'Script topic',
    'scripts.format': 'Format',
    'scripts.tone': 'Tone',
    'scripts.audience': 'Audience',
    'scripts.duration': 'Target duration',
    'scripts.result': 'Generated script',
    'scripts.hook': 'Hook',
    'scripts.body': 'Body',
    'scripts.punchline': 'Punchline',
    'scripts.edit': 'Edit',
    'scripts.delete': 'Delete',
    'scripts.generateVoice': 'Generate voice',
    'scripts.empty': 'No scripts yet. Generate scripts for your character!',
    'scripts.status.draft': 'Draft',
    'scripts.status.ready': 'Ready',
    'scripts.status.used': 'Used',

    // Voice
    'voice.generate':      '🎤 Generate voice',
    'voice.generating':    'Generating...',
    'voice.player.title':  'Cancan Voice',
    'voice.error':         'Voice generation failed.',
    'voice.success':       'Voice generated successfully!',

    // Videos
    'videos.title': 'My Videos',
    'videos.generate': 'Generate video',
    'videos.download': 'Download',
    'videos.publish': 'Publish on YouTube',
    'videos.status.pending': 'Pending',
    'videos.status.processing': 'Processing',
    'videos.status.completed': 'Completed',
    'videos.status.failed': 'Failed',
    'videos.empty': 'No videos yet. Generate your first video!',

    // Landing
    'landing.hero.title': 'DuckFactory',
    'landing.hero.tagline': 'AI Studio for Viral Content Production',
    'landing.hero.subtitle': 'Create your AI character and produce viral videos automatically.',
    'landing.hero.cta': 'Start for free',
    'landing.hero.demo': 'Watch demo',

    // Pricing
    'pricing.title': 'Pricing',
    'pricing.free': 'Free',
    'pricing.creator': 'Creator',
    'pricing.pro': 'Pro',
    'pricing.agency': 'Agency',
    'pricing.perMonth': '/month',
    'pricing.getStarted': 'Get started',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.noResults': 'No results',
  },
} as const

export type TranslationKey = keyof typeof translations.fr

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] ?? key
}

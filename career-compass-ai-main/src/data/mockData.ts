// Mock data for the dashboard
export const mockAnalysis = {
  profil: {
    nom: "Mohamed Ben Ali",
    resume: "Étudiant en informatique passionné par le développement web et l'intelligence artificielle. Expérience en projets académiques et stages.",
    langues: ["Français (Natif)", "Anglais (B2)", "Arabe (Natif)"],
    contact: {
      email: "mohamed.benali@email.com",
      telephone: "+216 98 123 456",
      linkedin: "linkedin.com/in/mohamedbenali",
    },
  },
  score: 55,
  poste_vise: "Développeur Full Stack Junior",
  skills: [
    { nom: "HTML / CSS", niveau: 85, categorie: "Web" },
    { nom: "JavaScript", niveau: 70, categorie: "Web" },
    { nom: "React", niveau: 60, categorie: "Web" },
    { nom: "Python", niveau: 65, categorie: "IA" },
    { nom: "Photoshop", niveau: 75, categorie: "Multimedia" },
    { nom: "Git", niveau: 50, categorie: "DevOps" },
  ],
  missing_skills: [
    { nom: "TypeScript", priorite: "haute", type: "Outil technique" },
    { nom: "Node.js / Express", priorite: "haute", type: "Framework" },
    { nom: "PostgreSQL", priorite: "moyenne", type: "Outil technique" },
    { nom: "Docker", priorite: "moyenne", type: "DevOps" },
    { nom: "Tests unitaires", priorite: "haute", type: "Méthodologie" },
    { nom: "CI/CD", priorite: "basse", type: "DevOps" },
    { nom: "AWS / Cloud", priorite: "basse", type: "Certification" },
  ],
  recommandations: [
    { id: 1, texte: "Construire un portfolio avec 3 projets full-stack complets", fait: false },
    { id: 2, texte: "Obtenir une certification Node.js ou TypeScript", fait: false },
    { id: 3, texte: "Contribuer à un projet open-source pour montrer la collaboration", fait: false },
    { id: 4, texte: "Créer un projet personnel utilisant une API REST complète", fait: false },
    { id: 5, texte: "Pratiquer les entretiens techniques sur LeetCode/HackerRank", fait: false },
    { id: 6, texte: "Mettre à jour le profil LinkedIn avec les mots-clés du poste", fait: false },
  ],
  quiz: [
    {
      id: 1,
      question: "Quelle est la différence entre let, const et var en JavaScript ?",
      options: [
        "Aucune différence",
        "let et const ont un scope de bloc, var a un scope de fonction",
        "var est plus moderne que let",
        "const peut être réassigné",
      ],
      correct: 1,
      explication:
        "let et const sont block-scoped (introduits en ES6), tandis que var est function-scoped. const ne peut pas être réassigné après déclaration.",
    },
    {
      id: 2,
      question: "Qu'est-ce que le Virtual DOM dans React ?",
      options: [
        "Le DOM réel du navigateur",
        "Une copie légère du DOM en mémoire pour optimiser les rendus",
        "Un framework CSS",
        "Un outil de débogage",
      ],
      correct: 1,
      explication:
        "Le Virtual DOM est une représentation en mémoire du DOM réel. React compare les différences et met à jour uniquement les éléments modifiés.",
    },
    {
      id: 3,
      question: "Quel pattern est utilisé pour gérer l'état global dans React ?",
      options: [
        "MVC",
        "Observer",
        "Context API / Redux",
        "Singleton",
      ],
      correct: 2,
      explication:
        "Context API (natif React) et Redux sont les solutions les plus utilisées pour gérer l'état global dans une application React.",
    },
    {
      id: 4,
      question: "Qu'est-ce qu'une API RESTful ?",
      options: [
        "Une base de données",
        "Une architecture client-serveur utilisant HTTP avec des endpoints standardisés",
        "Un langage de programmation",
        "Un type de framework frontend",
      ],
      correct: 1,
      explication:
        "REST (Representational State Transfer) est un style d'architecture qui utilise les méthodes HTTP (GET, POST, PUT, DELETE) pour communiquer entre client et serveur.",
    },
    {
      id: 5,
      question: "Quelle commande Git permet de créer une nouvelle branche ?",
      options: [
        "git new branch",
        "git checkout -b nom-branche",
        "git create branch",
        "git branch --new",
      ],
      correct: 1,
      explication:
        "La commande `git checkout -b nom-branche` crée une nouvelle branche et bascule dessus. Alternativement, `git switch -c nom-branche` fait la même chose.",
    },
  ],
};

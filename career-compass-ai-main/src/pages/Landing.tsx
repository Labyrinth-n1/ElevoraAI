import { motion } from "framer-motion";
import { ArrowRight, Brain, Target, FileText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import heroImage from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: FileText,
    title: "Analyse CV Intelligente",
    description: "Uploadez votre CV et obtenez une analyse complète en quelques secondes grâce à l'IA.",
  },
  {
    icon: Target,
    title: "Score de Matching",
    description: "Comparez votre profil avec le poste visé et obtenez un score de compatibilité précis.",
  },
  {
    icon: Brain,
    title: "QCM d'Entraînement",
    description: "Préparez-vous avec des quiz personnalisés générés à partir de votre analyse.",
  },
  {
    icon: Sparkles,
    title: "Plan d'Action IA",
    description: "Recevez des recommandations stratégiques et un roadmap personnalisé.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="ELEVORA AI" className="w-[135px] h-[50px]" />
          </Link>
          <div className="flex items-center gap-3">
            
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90"
            >
              Commencer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 gradient-hero opacity-90" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="mb-6 inline-block rounded-full border border-emerald/30 bg-emerald/10 px-4 py-1.5 text-sm font-medium text-emerald-light">
                 Plateforme de Préparation Entretien IA
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight text-primary-foreground md:text-7xl"
            >
              Transformez votre CV en{" "}
              <span className="text-gradient">plan d'action</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-10 text-lg text-primary-foreground/70 md:text-xl"
            >
              Analyse IA, score de matching, quiz personnalisés et recommandations
              stratégiques pour décrocher le poste de vos rêves.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                to="/upload"
                className="group inline-flex items-center gap-2 rounded-xl gradient-accent px-8 py-4 text-base font-semibold text-accent-foreground shadow-glow transition-all hover:scale-105"
              >
                Analyser mon CV
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/20 px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10"
              >
                Voir un exemple
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="h-10 w-6 rounded-full border-2 border-primary-foreground/30 p-1">
            <div className="h-2 w-1.5 rounded-full bg-emerald mx-auto" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
              Tout ce qu'il vous faut pour{" "}
              <span className="text-gradient">réussir</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Une suite d'outils intelligents pour analyser, préparer et optimiser votre candidature.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl gradient-hero p-12 text-center md:p-20"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-emerald blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-emerald blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground md:text-5xl">
                Prêt à booster votre carrière ?
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/70">
                Rejoignez des milliers de candidats qui utilisent WorkAssist AI.
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 rounded-xl gradient-accent px-8 py-4 text-base font-semibold text-accent-foreground shadow-glow transition-all hover:scale-105"
              >
                Commencer gratuitement
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Elevora AI. Votre coach carrière intelligent.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

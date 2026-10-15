import {
  IconAI,
  IconCloud,
  IconCode,
  IconDB,
  IconServer,
  IconWrench,
} from "./icons";

const GROUPS = [
  {
    icon: IconCode,
    title: "Languages & Frontend",
    items: ["JavaScript", "Python", "React.js", "Next.js", "HTML5", "CSS3"],
  },
  {
    icon: IconServer,
    title: "Backend & APIs",
    items: ["Node.js", "Express.js", "FastAPI", "Spring Boot (Basic)", "REST APIs"],
  },
  {
    icon: IconDB,
    title: "Databases",
    items: ["MongoDB", "MySQL", "PostgreSQL", "Supabase"],
  },
  {
    icon: IconAI,
    title: "AI / ML",
    items: ["RAG", "LangChain", "LangGraph", "LangSmith", "Hugging Face", "Chatbots", "Clerk (Auth)"],
  },
  {
    icon: IconCloud,
    title: "Cloud & Monitoring",
    items: ["AWS S3", "EC2", "ECS", "Elastic Beanstalk", "Prometheus", "Grafana"],
  },
  {
    icon: IconWrench,
    title: "Tools",
    items: ["Git", "Docker", "Redis (Basic)", "Kafka (Basic)", "WordPress"],
  },
];

export function Skills() {
  return (
    <section id="skills" className="container-page section">
      <p className="t-body-sm-bold text-primary mb-3">Stack</p>
      <h2 className="t-display text-ink-deep mb-12">Technical skills</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {GROUPS.map((g) => (
          <div key={g.title} className="card-icon">
            <div className="w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center text-ink-deep mb-4">
              <g.icon />
            </div>
            <h3 className="t-subtitle-lg text-ink-deep mb-2">{g.title}</h3>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((i) => (
                <span
                  key={i}
                  className="t-caption-bold text-charcoal bg-surface-soft rounded-full px-2.5 py-1"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

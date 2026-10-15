export function About() {
  return (
    <section id="about" className="container-page section">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div>
          <p className="t-body-sm-bold text-primary mb-3">About</p>
          <h2 className="t-display text-ink-deep">
            Product-minded engineer, community builder.
          </h2>
        </div>
        <div className="space-y-5">
          <p className="t-subtitle text-charcoal">
            Software Engineer with 4 years of experience building web
            applications and backend systems using React.js, Next.js, Node.js,
            Express.js, Python, and cloud technologies.
          </p>
          <p className="t-body text-slate">
            Experienced in REST APIs, databases, authentication, monitoring, and
            deployment. Growing expertise in AI applications including RAG,
            chatbots, LangChain, and LangGraph. Active developer community
            organizer with experience hosting technical meetups and workshops in
            Peshawar.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="pill-tab">JavaScript</span>
            <span className="pill-tab">Python</span>
            <span className="pill-tab">React / Next.js</span>
            <span className="pill-tab">Node.js</span>
            <span className="pill-tab">AI / RAG</span>
          </div>
        </div>
      </div>
    </section>
  );
}

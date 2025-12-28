'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { siteConfig } from '@/config/site';
import Education from '@/components/Education';
import MinecraftLayout from '@/components/MinecraftLayout';

export default function AboutPage() {
  const [day, setDay] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    setDay(hour >= 6 && hour < 18);
  }, []);

  const handleDayChange = (isDay: boolean) => {
    setDay(isDay);
  };

  const themeClass = day ? '' : 'is-dark';
  const projectCount = siteConfig.projects?.length ?? 0;
  const skillCount = (siteConfig.skills ?? []).reduce(
    (total, category) => total + (category.skills?.length ?? 0),
    0,
  );

  const focusTokens = siteConfig.profile.focusAreas
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);

  const expertiseTokens = siteConfig.profile.expertise
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);

  const aboutNarrative = {
    intro:
      'I am Dinesh S, an aspiring AI Engineer, Machine Learning Enthusiast, and future-ready innovator currently pursuing my B.Tech in Artificial Intelligence & Data Science at DMI College of Engineering.',
    experiments:
      'Over the last few years I have built ML, DL, NLP, Agentic AI, Blockchain, Computer Vision, RAG, and Multilingual systems that constantly push me to learn, innovate, and craft meaningful, production-ready solutions.',
    mission:
      'My mission is to stay ahead of AI advancements, contribute to cutting-edge research, and design accessible tools that solve pressing societal challenges.',
    missionDetail:
      'I am particularly driven to impact agriculture, healthcare, cybersecurity, and digital trust by shipping pragmatic AI-first products.',
    belief:
      'Technology should be ethical, inclusive, and empowering — especially for underserved communities — and I design every workflow with that responsibility in mind.',
  };

  const innovationTracks = [
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Agentic AI',
    'Blockchain',
    'Computer Vision',
    'Retrieval-Augmented Generation',
    'Multilingual AI',
  ];

  const missionFields = ['Agriculture', 'Healthcare', 'Cybersecurity', 'Digital Trust'];

  const capabilitySections = [
    {
      title: 'Artificial Intelligence & Machine Learning',
      items: [
        'ML Algorithms (LR, SVM, KNN, Decision Trees, NB)',
        'Deep Learning foundations (DNNs, CNNs)',
        'Time Series forecasting (ARIMA)',
        'NLP stacks (TF-IDF, sentiment analysis)',
        'Retrieval-Augmented Generation pipelines',
        'Agentic AI systems for automated reasoning',
      ],
    },
    {
      title: 'Programming & Tools',
      items: [
        'Python (primary language, strong foundation)',
        'React & TypeScript (beginner, actively shipping)',
        'Streamlit & OpenCV for real-time computer vision apps',
        'Power BI dashboards and storytelling visuals',
        'VS Code as my main build + debug IDE',
      ],
    },
    {
      title: 'Cloud, VectorDB & Backend',
      items: [
        'Supabase for auth + data workflows',
        'ChromaDB for vector search & memory',
        'Twilio API for voice and SMS automations',
        'Hyperledger blockchain for marketplace systems',
      ],
    },
    {
      title: 'Data Science',
      items: [
        'EDA, data cleaning, and visual storytelling',
        'GeoPandas for geospatial analysis',
        'Time series analysis & forecasting',
        'Kaggle-style experimentation workflows',
      ],
    },
    {
      title: 'Web & Mobile Development',
      items: [
        'Modern UI systems — clean, futuristic, highly legible',
        'Full-stack builds for research-grade products',
        'Streamlit-based AI dashboards and assistants',
        'Mobile and web interfaces for AI copilots',
      ],
    },
  ];

  const programmingLanguages = [
    'Python (primary — ML, AI, CV, automation)',
    'JavaScript',
    'TypeScript (beginner, actively learning)',
    'HTML5 / CSS3',
    'SQL',
    'Java (basics)',
    'C (basics)',
    'R (intro level, data analysis)',
    'Bash / Shell scripting (basic usage)',
  ];

  const frameworkStacks = [
    {
      title: 'AI / ML / DL',
      items: [
        'Scikit-learn',
        'Pandas',
        'NumPy',
        'Matplotlib & Seaborn',
        'TensorFlow (basic) & Keras (basic)',
        'OpenCV for CV apps',
        'ARIMA / Statsmodels',
        'TF-IDF / NLTK / SpaCy',
        'Xenova Transformers (JS inference)',
        'HuggingFace Transformers',
        'ChromaDB for vector embeddings & RAG',
      ],
    },
    {
      title: 'Web & App Development',
      items: [
        'React & Next.js (basic usage)',
        'Streamlit dashboards',
        'Node.js & Express.js',
        'Tailwind CSS + Framer Motion',
        'React Native (basic prototypes)',
      ],
    },
    {
      title: 'Blockchain Stack',
      items: ['Hyperledger Fabric', 'Solidity (basics)', 'IPFS (file storage basics)'],
    },
    {
      title: 'Data Visualization',
      items: ['Power BI', 'Matplotlib', 'Seaborn', 'Plotly (basic)'],
    },
  ];

  const toolsAndPlatforms = [
    {
      title: 'Cloud & Deployments',
      items: ['Supabase', 'Firebase (auth + DB)', 'Netlify', 'Vercel', 'GitHub Pages', 'Google Cloud (basic usage)'],
    },
    {
      title: 'Model & Data Tools',
      items: ['Anaconda', 'Jupyter Notebook', 'Kaggle', 'Google Colab', 'ChromaDB', 'LangChain (basics)'],
    },
    {
      title: 'Dev Tools & Ops',
      items: ['VS Code', 'Git / GitHub', 'Postman', 'Docker (intro level)', 'Figma (UI basics)', 'Notion (project docs)'],
    },
  ];

  const quickStats = [
    {
      label: 'Projects shipped',
      value: `${projectCount}+`,
      meta: 'AI, ML & creative experiments',
      accent: 'text-yellow-400',
    },
    {
      label: 'Skills mastered',
      value: `${skillCount}+`,
      meta: 'Languages, frameworks & tools',
      accent: 'text-green-400',
    },
    {
      label: 'Collab mode',
      value: 'Always on',
      meta: siteConfig.profile.collaborations,
      accent: 'text-blue-400',
    },
    {
      label: 'Focus tracks',
      value: focusTokens.length ? `${focusTokens.length}` : 'Multi-domain',
      meta: focusTokens.join(' • ') || 'AI for social good',
      accent: 'text-purple-400',
    },
  ];

  return (
    <MinecraftLayout setDayOrNight={handleDayChange}>
      <div className="min-h-screen pt-20">
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className={`education-header-container p-6 mb-12 rounded-lg ${themeClass}`}>
              <div className="text-center">
                <h2 className="pixel-text text-4xl md:text-5xl text-yellow-400 mb-4">
                  🎮 ABOUT ME
                </h2>
                <div className="flex flex-wrap justify-center items-center gap-4">
                  <i className="nes-icon star is-large text-yellow-400"></i>
                  <p className="pixel-text text-green-400 text-lg">AI • ML • DATA INNOVATOR</p>
                  <i className="nes-icon trophy is-large text-yellow-400"></i>
                </div>
              </div>
            </div>

            {/* Hero + Stat Grid */}
            <div className="grid gap-8 lg:grid-cols-[1.6fr,1fr] mb-16">
              <div className={`nes-container is-rounded with-title relative overflow-hidden ${themeClass}`}>
                <p className="title">🚀 MAIN QUEST</p>
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-yellow-200/70 to-transparent pointer-events-none"></div>
                <div className="relative space-y-6">
                  <p className="pixel-text text-2xl text-yellow-400 leading-relaxed">
                    {siteConfig.profile.tagline}
                  </p>
                  <p className="text-base md:text-lg leading-relaxed">
                    {siteConfig.profile.summary}
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className={`nes-container is-rounded ${themeClass}`}>
                      <p className="pixel-text text-green-400 text-xs mb-2">EDUCATION</p>
                      <p className="text-sm leading-relaxed">{siteConfig.profile.education}</p>
                    </div>
                    <div className={`nes-container is-rounded ${themeClass}`}>
                      <p className="pixel-text text-blue-400 text-xs mb-2">EXPERTISE STACK</p>
                      <p className="text-sm leading-relaxed">{siteConfig.profile.expertise}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {focusTokens.map((token) => (
                      <span key={token} className="nes-badge">
                        <span className="is-primary">{token}</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/projects" className="nes-btn is-primary">
                      View Projects
                    </Link>
                    <Link href="/contact" className="nes-btn">
                      Say Hello
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {quickStats.map((stat) => (
                  <div key={stat.label} className={`nes-container is-rounded ${themeClass}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${stat.accent}`}>{stat.label}</p>
                    <div className="flex items-baseline justify-between">
                      <p className="pixel-text text-3xl">{stat.value}</p>
                      <i className="nes-icon coin is-large"></i>
                    </div>
                    <p className="text-xs mt-2 leading-relaxed">{stat.meta}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-grid-2col grid grid-cols-1 xl:grid-cols-[1.4fr,0.6fr] gap-8 mb-16">
              <div className={`about-container-padding nes-container is-rounded with-title ${themeClass}`}>
                <p className="title">🧠 SKILLS & EXPERTISE</p>
                <div className="mobile-spacing-y-4 space-y-4">
                  {capabilitySections.map((section) => (
                    <div key={section.title} className={`nes-container is-rounded ${themeClass}`}>
                      <p className="pixel-text about-text-sm text-sm text-yellow-400 mb-2">{section.title}</p>
                      <ul className="nes-list is-disc pl-6 space-y-1 about-text-sm text-sm md:columns-2 md:gap-8">
                        {section.items.map((item) => (
                          <li key={`${section.title}-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`about-container-padding nes-container is-rounded with-title ${themeClass}`}>
                <p className="title">🚀 MISSION & IMPACT</p>
                <div className="mobile-spacing-y-6 space-y-6">
                  <div className={`nes-container is-rounded ${themeClass}`}>
                    <p className="pixel-text about-text-sm text-sm text-green-400 mb-2">Mission Blueprint</p>
                    <p className="about-text-sm text-sm leading-relaxed">{aboutNarrative.mission}</p>
                    <p className="about-text-xs text-xs leading-relaxed mt-3 text-yellow-400">{aboutNarrative.missionDetail}</p>
                  </div>
                  <div className={`nes-container is-rounded ${themeClass}`}>
                    <p className="pixel-text about-text-sm text-sm text-purple-400 mb-2">Impact Fields</p>
                    <div className="mobile-gap-3 flex flex-wrap gap-3">
                      {missionFields.map((field) => (
                        <span key={field} className="nes-badge">
                          <span className="is-success">{field}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`nes-container is-rounded ${themeClass}`}>
                    <p className="pixel-text about-text-sm text-sm text-blue-400 mb-2">Innovation Tracks</p>
                    <div className="mobile-gap-3 flex flex-wrap gap-3">
                      {innovationTracks.map((track) => (
                        <span key={`mission-${track}`} className="nes-badge">
                          <span className="is-warning">{track}</span>
                        </span>
                      ))}
                    </div>
                    <p className="about-text-xs text-xs mt-4 leading-relaxed">{aboutNarrative.belief}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`nes-container with-title mb-16 ${themeClass}`}>
              <p className="title">💻 PROGRAMMING LANGUAGES</p>
              <div className="flex flex-wrap gap-3">
                {programmingLanguages.map((language) => (
                  <span key={language} className="nes-badge">
                    <span className="is-primary">{language}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="about-grid-2col grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <div className={`about-container-padding nes-container is-rounded with-title ${themeClass}`}>
                <p className="title">⚙️ FRAMEWORKS & LIBRARIES</p>
                <div className="mobile-spacing-y-4 space-y-4">
                  {frameworkStacks.map((stack) => (
                    <div key={stack.title} className={`nes-container is-rounded ${themeClass}`}>
                      <p className="pixel-text about-text-sm text-sm text-yellow-400 mb-2">{stack.title}</p>
                      <ul className="nes-list is-disc pl-6 space-y-1 about-text-sm text-sm md:columns-2 md:gap-8">
                        {stack.items.map((item) => (
                          <li key={`${stack.title}-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`about-container-padding nes-container is-rounded with-title ${themeClass}`}>
                <p className="title">🛠️ TOOLS & PLATFORMS</p>
                <div className="mobile-spacing-y-4 space-y-4">
                  {toolsAndPlatforms.map((stack) => (
                    <div key={stack.title} className={`nes-container is-rounded ${themeClass}`}>
                      <p className="pixel-text about-text-sm text-sm text-green-400 mb-2">{stack.title}</p>
                      <ul className="nes-list is-disc pl-6 space-y-1 about-text-sm text-sm md:columns-2 md:gap-8">
                        {stack.items.map((item) => (
                          <li key={`${stack.title}-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className={`nes-container is-rounded ${themeClass}`}>
                    <p className="pixel-text text-center about-text-sm text-sm text-blue-400 mb-2">
                      Explore everything in detail ↘
                    </p>
                    <Link href="/skills" className="nes-btn is-primary w-full justify-center flex">
                      Continue to /skills
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Expertise - Pixelated Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className={`nes-container with-title ${themeClass}`}>
                <p className="title">🤝 COLLABORATIONS</p>
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed">{siteConfig.profile.collaborations}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Project Openness</span>
                      <span className="pixel-text text-sm text-green-400">90%</span>
                    </div>
                    <div className="nes-progress">
                      <progress className="nes-progress" value="90" max="100"></progress>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`nes-container with-title ${themeClass}`}>
                <p className="title">🎮 HOBBIES & INTERESTS</p>
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed">{siteConfig.profile.hobbies}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="nes-badge">
                      <span className="is-primary">🎮 Gaming</span>
                    </span>
                    <span className="nes-badge">
                      <span className="is-success">📚 Sci-fi</span>
                    </span>
                    <span className="nes-badge">
                      <span className="is-warning">💻 Coding</span>
                    </span>
                    <span className="nes-badge">
                      <span className="is-error">🚀 Space</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className={`nes-container with-title ${themeClass}`}>
                <p className="title">🌟 PASSION LEVELS</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold">AI & Machine Learning</p>
                      <span className="pixel-text text-sm text-blue-400">95%</span>
                    </div>
                    <div className="nes-progress">
                      <progress className="nes-progress" value="95" max="100"></progress>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold">Data Science & Analytics</p>
                      <span className="pixel-text text-sm text-green-400">90%</span>
                    </div>
                    <div className="nes-progress">
                      <progress className="nes-progress" value="90" max="100"></progress>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold">Innovation & Creativity</p>
                      <span className="pixel-text text-sm text-purple-400">88%</span>
                    </div>
                    <div className="nes-progress">
                      <progress className="nes-progress" value="88" max="100"></progress>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <Education day={day} />
            </div>

            <div className={`nes-container is-rounded with-title is-centered ${themeClass}`}>
              <p className="title">🎯 FUN FACTS & BEYOND</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {siteConfig.profile.funFacts.map((fact, index) => (
                  <div
                    key={fact}
                    className={`nes-container is-rounded ${themeClass} education-gpa-card`}
                  >
                    <p className="text-sm text-center font-medium">{fact}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <div className={`nes-container is-rounded ${themeClass} education-info-card`}>
                  <div className="text-center space-y-4">
                    <p className="pixel-text text-2xl text-yellow-400">
                      🌟 LET'S CONNECT & BUILD SOMETHING AMAZING!
                    </p>
                    <p className="text-base md:text-lg leading-relaxed">
                      Whether it's AI projects, gaming innovations, or just a friendly chat about technology!
                    </p>
                    <div className="flex justify-center gap-4 mt-6">
                      <i className="nes-icon heart is-large text-red-400"></i>
                      <i className="nes-icon star is-large text-yellow-400"></i>
                      <i className="nes-icon trophy is-large text-green-400"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MinecraftLayout>
  );
}
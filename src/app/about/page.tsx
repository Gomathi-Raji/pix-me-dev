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

  const fallbackJourney = [
    {
      title: 'AI & Data Science Explorer',
      location: 'DMI College of Engineering',
      timeline: '2023 - Present',
      summary:
        'Pursuing B.Tech in AI & Data Science while crafting ML prototypes that solve everyday campus challenges.',
      highlights: [
        'Maintaining a strong GPA of 8.5 with practical capstones every semester',
        'Leading peer study circles focused on Python, ML, and data storytelling',
      ],
    },
    {
      title: 'Community Builder',
      location: 'Open-source & Hackathon floors',
      timeline: '2023 - Present',
      summary: 'Hosting workshops, sharing notebooks, and collaborating on AI-for-good concepts.',
      highlights: [
        'Facilitated fast-paced weekend sprints for budding ML engineers',
        'Delivered talks about generative AI safety & creative coding',
      ],
    },
    {
      title: 'Creative Technologist',
      location: 'Side quests & personal labs',
      timeline: 'Ongoing',
      summary: 'Experimenting with gaming-inspired UX, automation helpers, and storytelling through data.',
      highlights: [
        'Shipped playful interfaces like this Minecraft-inspired portfolio',
        'Mixing Free Fire strategies with AI decision-making research',
      ],
    },
  ];

  const journeyEntries = (siteConfig.work && siteConfig.work.length > 0
    ? siteConfig.work.map((experience) => ({
        title: experience.position,
        location: experience.company,
        timeline: `${experience.startDate} - ${experience.endDate || 'Present'}`,
        summary: experience.summary,
        highlights:
          experience.highlights && experience.highlights.length > 0
            ? experience.highlights
            : [experience.summary],
      }))
    : fallbackJourney);

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
              <div className={`nes-container with-title relative overflow-hidden ${themeClass}`}>
                <p className="title">🚀 MAIN QUEST</p>
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-yellow-200/70 to-transparent pointer-events-none"></div>
                <div className="relative space-y-6">
                  <p className="pixel-text text-2xl text-yellow-400 leading-relaxed">
                    {siteConfig.profile.tagline}
                  </p>
                  <p className="text-base md:text-lg leading-relaxed pixel-text">
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
                    <p className={`pixel-text text-sm ${stat.accent}`}>{stat.label}</p>
                    <div className="flex items-baseline justify-between">
                      <p className="pixel-text text-3xl">{stat.value}</p>
                      <i className="nes-icon coin is-large"></i>
                    </div>
                    <p className="text-xs mt-2 leading-relaxed">{stat.meta}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Overview */}
            <div className={`nes-container with-title is-centered mb-16 ${themeClass}`}>
              <p className="title">👋 PROFILE OVERVIEW</p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <p className="text-lg leading-relaxed pixel-text">
                    {aboutNarrative.intro}
                  </p>
                  <p className="text-base leading-relaxed">
                    {aboutNarrative.experiments}
                  </p>
                  <p className="text-base leading-relaxed">
                    {aboutNarrative.mission}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`nes-container is-rounded ${themeClass} education-info-card`}>
                      <p className="pixel-text text-center text-lg text-green-400">
                        Mission in action
                      </p>
                      <p className="text-sm leading-relaxed">{aboutNarrative.missionDetail}</p>
                    </div>
                    <div className={`nes-container is-rounded ${themeClass} education-gpa-card`}>
                      <p className="pixel-text text-center text-lg text-yellow-400">
                        Guiding belief
                      </p>
                      <p className="text-sm leading-relaxed">{aboutNarrative.belief}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {innovationTracks.map((track) => (
                      <span key={`overview-${track}`} className="nes-badge">
                        <span className="is-primary">{track}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className={`nes-container is-rounded ${themeClass} education-info-card`}>
                    <div className="flex items-center space-x-4">
                      <div className="logo-icon-box">
                        <i className="nes-icon trophy is-large text-yellow-400"></i>
                      </div>
                      <div>
                        <p className="pixel-text text-yellow-400 font-bold">EDUCATION</p>
                        <p className="text-sm">{siteConfig.profile.education}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`nes-container is-rounded ${themeClass} education-gpa-card`}>
                    <div className="flex items-center space-x-4">
                      <div className="logo-icon-box">
                        <i className="nes-icon heart is-large text-red-400"></i>
                      </div>
                      <div>
                        <p className="pixel-text text-green-400 font-bold">EXPERTISE</p>
                        <p className="text-sm">{siteConfig.profile.expertise}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`nes-container is-rounded ${themeClass} education-desc-card`}>
                    <div className="flex items-center space-x-4">
                      <div className="logo-icon-box">
                        <i className="nes-icon star is-large text-blue-400"></i>
                      </div>
                      <div>
                        <p className="pixel-text text-purple-400 font-bold">FOCUS AREAS</p>
                        <p className="text-sm">{siteConfig.profile.focusAreas}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quest Log + Core Themes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <div className={`nes-container with-title ${themeClass}`}>
                <p className="title">📜 QUEST LOG</p>
                <div className="space-y-6">
                  {journeyEntries.map((entry, index) => (
                    <div
                      key={`${entry.title}-${index}`}
                      className={`nes-container is-rounded ${themeClass}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="pixel-text text-sm text-yellow-400">
                          #{String(index + 1).padStart(2, '0')}
                        </p>
                        <span className="nes-badge">
                          <span className="is-warning">{entry.timeline}</span>
                        </span>
                      </div>
                      <h3 className="pixel-text text-lg text-green-400 mb-2">{entry.title}</h3>
                      <p className="text-xs uppercase tracking-wide mb-2">{entry.location}</p>
                      <p className="text-sm mb-3 leading-relaxed">{entry.summary}</p>
                      <ul className="nes-list is-disc pl-6 space-y-1 text-xs">
                        {entry.highlights.map((highlight, idx) => (
                          <li key={`${highlight}-${idx}`}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`nes-container with-title ${themeClass}`}>
                <p className="title">💡 CORE THEMES</p>
                <div className="space-y-6">
                  <div className={`nes-container is-rounded ${themeClass}`}>
                    <p className="pixel-text text-green-400 text-sm mb-3">Expertise Stack</p>
                    <ul className="nes-list is-disc pl-6 space-y-2 text-sm">
                      {expertiseTokens.map((token) => (
                        <li key={token}>{token}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={`nes-container is-rounded ${themeClass}`}>
                    <p className="pixel-text text-blue-400 text-sm mb-3">Focus Missions</p>
                    <div className="flex flex-wrap gap-3">
                      {focusTokens.map((token) => (
                        <span key={`focus-${token}`} className="nes-badge">
                          <span className="is-success">{token}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`nes-container is-rounded ${themeClass}`}>
                    <p className="pixel-text text-purple-400 text-sm mb-3">Hobbies + Recharge</p>
                    <p className="text-sm leading-relaxed">{siteConfig.profile.hobbies}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr,0.6fr] gap-8 mb-16">
              <div className={`nes-container with-title ${themeClass}`}>
                <p className="title">🧠 SKILLS & EXPERTISE</p>
                <div className="space-y-4">
                  {capabilitySections.map((section) => (
                    <div key={section.title} className={`nes-container is-rounded ${themeClass}`}>
                      <p className="pixel-text text-sm text-yellow-400 mb-2">{section.title}</p>
                      <ul className="nes-list is-disc pl-6 space-y-1 text-sm">
                        {section.items.map((item) => (
                          <li key={`${section.title}-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`nes-container with-title ${themeClass}`}>
                <p className="title">🚀 MISSION & IMPACT</p>
                <div className="space-y-6">
                  <div className={`nes-container is-rounded ${themeClass}`}>
                    <p className="pixel-text text-sm text-green-400 mb-2">Mission Blueprint</p>
                    <p className="text-sm leading-relaxed">{aboutNarrative.mission}</p>
                    <p className="text-xs leading-relaxed mt-3 text-yellow-400">{aboutNarrative.missionDetail}</p>
                  </div>
                  <div className={`nes-container is-rounded ${themeClass}`}>
                    <p className="pixel-text text-sm text-purple-400 mb-2">Impact Fields</p>
                    <div className="flex flex-wrap gap-3">
                      {missionFields.map((field) => (
                        <span key={field} className="nes-badge">
                          <span className="is-success">{field}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`nes-container is-rounded ${themeClass}`}>
                    <p className="pixel-text text-sm text-blue-400 mb-2">Innovation Tracks</p>
                    <div className="flex flex-wrap gap-3">
                      {innovationTracks.map((track) => (
                        <span key={`mission-${track}`} className="nes-badge">
                          <span className="is-warning">{track}</span>
                        </span>
                      ))}
                    </div>
                    <p className="text-xs mt-4 leading-relaxed">{aboutNarrative.belief}</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <div className={`nes-container with-title ${themeClass}`}>
                <p className="title">⚙️ FRAMEWORKS & LIBRARIES</p>
                <div className="space-y-4">
                  {frameworkStacks.map((stack) => (
                    <div key={stack.title} className={`nes-container is-rounded ${themeClass}`}>
                      <p className="pixel-text text-sm text-yellow-400 mb-2">{stack.title}</p>
                      <ul className="nes-list is-disc pl-6 space-y-1 text-sm">
                        {stack.items.map((item) => (
                          <li key={`${stack.title}-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`nes-container with-title ${themeClass}`}>
                <p className="title">🛠️ TOOLS & PLATFORMS</p>
                <div className="space-y-4">
                  {toolsAndPlatforms.map((stack) => (
                    <div key={stack.title} className={`nes-container is-rounded ${themeClass}`}>
                      <p className="pixel-text text-sm text-green-400 mb-2">{stack.title}</p>
                      <ul className="nes-list is-disc pl-6 space-y-1 text-sm">
                        {stack.items.map((item) => (
                          <li key={`${stack.title}-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className={`nes-container is-rounded ${themeClass}`}>
                    <p className="pixel-text text-center text-sm text-blue-400 mb-2">
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
                  <p className="pixel-text">{siteConfig.profile.collaborations}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="pixel-text text-sm">Project Openness</span>
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
                  <p className="pixel-text">{siteConfig.profile.hobbies}</p>
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
                      <p className="pixel-text text-sm">AI & Machine Learning</p>
                      <span className="pixel-text text-sm text-blue-400">95%</span>
                    </div>
                    <div className="nes-progress">
                      <progress className="nes-progress" value="95" max="100"></progress>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="pixel-text text-sm">Data Science & Analytics</p>
                      <span className="pixel-text text-sm text-green-400">90%</span>
                    </div>
                    <div className="nes-progress">
                      <progress className="nes-progress" value="90" max="100"></progress>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="pixel-text text-sm">Innovation & Creativity</p>
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

            <div className={`nes-container with-title is-centered ${themeClass}`}>
              <p className="title">🎯 FUN FACTS & BEYOND</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {siteConfig.profile.funFacts.map((fact, index) => (
                  <div
                    key={fact}
                    className={`nes-container is-rounded ${themeClass} education-gpa-card`}
                  >
                    <p className="pixel-text text-center font-medium">{fact}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <div className={`nes-container is-rounded ${themeClass} education-info-card`}>
                  <div className="text-center space-y-4">
                    <p className="pixel-text text-2xl text-yellow-400">
                      🌟 LET'S CONNECT & BUILD SOMETHING AMAZING!
                    </p>
                    <p className="pixel-text text-lg">
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
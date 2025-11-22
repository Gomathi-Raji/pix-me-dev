import { siteConfig } from "@/config/site";

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": siteConfig.profile.name,
    "jobTitle": "AI Enthusiast & Data Science Student",
    "description": siteConfig.profile.summary,
    "url": "https://your-portfolio-domain.com", // Replace with your actual domain
    "sameAs": [
      // Add your social media profiles here
      // "https://github.com/yourusername",
      // "https://linkedin.com/in/yourusername",
      // "https://twitter.com/yourusername"
    ],
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "Data Science",
      "Deep Learning",
      "Data Analysis",
      "AI in Healthcare",
      "AI in Education",
      "AI in Gaming"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "DMI College of Engineering",
      "description": "B.Tech in AI & Data Science"
    },
    "hasOccupation": {
      "@type": "Occupation",
      "name": "AI Engineer & Data Scientist",
      "occupationLocation": {
        "@type": "Country",
        "name": "India"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://your-portfolio-domain.com" // Replace with your actual domain
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://your-portfolio-domain.com/og-image.jpg", // Replace with your actual image URL
      "width": 1200,
      "height": 630
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteConfig.contact.phone || "",
      "email": siteConfig.contact.email,
      "contactType": "Professional"
    },
    "project": siteConfig.projects.map(project => ({
      "@type": "SoftwareApplication",
      "name": project.name,
      "description": project.description,
      // prefer the live URL and fallback to the repo URL if no liveUrl available
      "url": project.liveUrl || project.repoUrl || "",
      "applicationCategory": "Web Application",
      "operatingSystem": "Web Browser"
    })),
    // Flatten grouped skills into a single array of skill names
    "skill": siteConfig.skills.reduce((acc, group) => {
      acc.push(...group.skills.map(s => s.name));
      return acc;
    }, [] as string[]),
    "award": [
      "B.Tech in AI & Data Science - GPA: 8.5",
      "Pro Free Fire Gamer"
    ],
    "hobby": [
      "Gaming",
      "Sci-fi explorations",
      "Creative coding"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}
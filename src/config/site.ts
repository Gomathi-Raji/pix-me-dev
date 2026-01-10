export type SiteConfig = typeof siteConfig;
import { Contact } from '@/types/contact';
import { Education } from '@/types/education';
import { Profile } from '@/types/profile';
import { Project } from '@/types/project';
import skillData from '@/data/skills.json';
import profileData from '@/data/profile.json';
import educationData from '@/data/education.json';
import contactData from '@/data/contact.json';
import workData from '@/data/work.json';
import projectDate from '@/data/projects.json';

import type { Skill } from '@/types/skill';
import { Work } from '@/types/work';

const skills: Skill[] = JSON.parse(JSON.stringify(skillData)) as Skill[];
const profile: Profile = JSON.parse(JSON.stringify(profileData)) as Profile;
const education: Education[] = JSON.parse(JSON.stringify(educationData)) as Education[];
const contact: Contact = JSON.parse(JSON.stringify(contactData)) as Contact;
const work = JSON.parse(JSON.stringify(workData)) as Work[];
const projects: Project[] = JSON.parse(JSON.stringify(projectDate)) as Project[];


export const siteConfig = {
    name: `Portfolio - ${profile.name}`,
    description: "Showcasing my projects and skills",
    email: contact.email,
    profile: profile,
    skills: skills,
    education: education,
    work: work,
    projects: projects,
    contact: contact,
    testimonials: [
        {
            imageUrl:
                "https://media.licdn.com/dms/image/v2/D5603AQG-XEXs9m1V8w/profile-displayphoto-scale_200_200/B56Zi9i7PbHMAY-/0/1755526707768?e=1769644800&v=beta&t=F5A92ovGS4CadoI3QW-4UghAtSFUdQENXLukRn0C8nI",
            name: "Founder",
            title: "Zaymazone",
            praiseLine1: "Visionary leader with strong product clarity.",
            praiseLine2: "Supportive, fast-moving, and results-focused.",
        },
        {
            imageUrl:
                "https://media.licdn.com/dms/image/v2/D4D03AQGXI6pkngYTcg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1701062499738?e=1769644800&v=beta&t=HlXkHycQ-ssKaBb5mmPQlJ-SprkODyX21n4p1jHioCw",
            name: "Founder",
            title: "Thenam Software Solutions",
            praiseLine1: "Great at planning and shipping quality software.",
            praiseLine2: "Guides teams with clear direction and ownership.",
        },
        {
            imageUrl:
                "https://media.licdn.com/dms/image/v2/D5603AQFTS1Z73WIlCg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1720859777245?e=1769644800&v=beta&t=q0qHSrqslC9tmJK7WlVp1xsmYiJsP2ofNxTEVAPZIQI",
            name: "Founder",
            title: "Hexpertify.com",
            praiseLine1: "Sharp thinker with a strong execution mindset.",
            praiseLine2: "Always collaborative and open to new ideas.",
        },
        {
            imageUrl:
                "https://media.licdn.com/dms/image/v2/D4E03AQGOOFcDShIT8w/profile-displayphoto-scale_200_200/B4EZkdcTauKgAY-/0/1757135583612?e=1769644800&v=beta&t=VALumyyPsPDrvwrY1SAvu9Hn6VIoEZVwWegUm4yVCuc",
            name: "Team member",
            praiseLine1: "Reliable teammate who communicates clearly.",
            praiseLine2: "Helps unblock work and keeps momentum high.",
        },
        {
            imageUrl:
                "https://media.licdn.com/dms/image/v2/D5603AQFeEYSfMeT1JA/profile-displayphoto-scale_200_200/B56ZifUKkkG4AY-/0/1755019522650?e=1769644800&v=beta&t=UJRAgAVoN8OgijV_omDeG_7DaI6lgUekMUnYaugNiFo",
            name: "Team member",
            praiseLine1: "Consistent contributor with strong attention to detail.",
            praiseLine2: "Positive energy and great collaboration skills.",
        },
        {
            imageUrl:
                "https://media.licdn.com/dms/image/v2/D5603AQE_zzerleI-NQ/profile-displayphoto-shrink_200_200/B56ZX8mjLtGQAY-/0/1743699719869?e=1769644800&v=beta&t=sI_2y4bZjQE2UyBVbWwjaOqX71BMC7cPqkAhnnveQgw",
            name: "Founder",
            title: "GenXRverse",
            praiseLine1: "Innovative founder with a strong vision.",
            praiseLine2: "Builds with purpose and pushes for excellence.",
        },
    ],
};
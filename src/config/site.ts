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
};
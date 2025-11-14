export interface SkillItem {
    name: string;
    icon: string;
    library: string;
}

export interface Skill {
    title: string;
    skills: SkillItem[];
}
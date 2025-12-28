export interface Work {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    employmentType?: string;
    workMode?: string;
    location?: string;
    summary: string;
    highlights: string[];
    tags?: string[];
    links?: { label: string; url: string }[];
}
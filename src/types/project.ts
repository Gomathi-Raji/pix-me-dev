export interface Project {
    name: string;
    description: string;
    repoUrl?: string;
    playStoreUrl?: string;
    liveUrl?: string;
    image?: string;
    technologies?: string[];

    /** Optional richer content for the project details modal */
    longDescription?: string;
    highlights?: string[];
    media?: Array<
        | {
              type: 'image';
              src: string;
              alt?: string;
          }
        | {
              type: 'video';
              /** Can be a direct mp4/webm URL or a YouTube/Vimeo URL */
              src: string;
              title?: string;
          }
    >;
    links?: Array<{
        label: string;
        url: string;
    }>;

    /** Optional themed UI fields */
    badges?: Array<{
        label: string;
        variant?: 'primary' | 'success' | 'warning' | 'error' | 'default';
    }>;
    metrics?: Array<{
        label: string;
        value: string;
        variant?: 'primary' | 'success' | 'warning' | 'error' | 'default';
    }>;
}
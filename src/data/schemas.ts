import { z } from 'zod';

export const DeveloperSchema = z.object({
    name: z.string(),
    role: z.string(),
    email: z.string(),
    github: z.string(),
    linkedin: z.string(),
    tagline: z.string().optional()
});

export const JobExperienceSchema = z.object({
    id: z.string(),
    company: z.string(),
    role: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    bullets: z.array(z.string())
});

export const ResumeSchema = z.object({
    summary: z.array(z.string()),
    experience: z.array(JobExperienceSchema)
});

export const SkillSchema = z.object({
    id: z.string(),
    name: z.string(),
    iconUrl: z.string().optional(),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional()
});

export const SkillCategorySchema = z.object({
    categoryName: z.string(),
    skills: z.array(SkillSchema)
});

export const ProjectSchema = z.object({
    id: z.string(),
    title: z.string(),
    year: z.number(),
    displayOrder: z.number(),
    thumbnailUrl: z.string(),
    videoUrl: z.string().optional(),
    techStackIds: z.array(z.string()),
    description: z.object({
        problem: z.string(),
        solution: z.string()
    }),
    links: z.object({
        liveDemo: z.string().optional(),
        githubRepo: z.string().optional(),
        caseStudy: z.string().optional()
    })
});

export const TimelineEventSchema = z.object({
    year: z.number(),
    title: z.string(),
    description: z.string(),
    isMajorMilestone: z.boolean()
});

export const WorldTriggerSchema = z.object({
    id: z.string(),
    type: z.enum(["project", "harbor", "observatory", "reef", "collectible"]),
    coordinates: z.object({
        x: z.number(),
        z: z.number()
    }),
    triggerRadius: z.number()
});

export const PortfolioDataSchema = z.object({
    buildInfo: z.object({
        version: z.string(),
        buildDate: z.string(),
        commitHash: z.string()
    }),
    featureFlags: z.object({
        enableWhale: z.boolean().default(true),
        enableAudio: z.boolean().default(true),
        enableAnalytics: z.boolean().default(true),
        enableObservatory: z.boolean().default(true),
        enablePostProcessing: z.boolean().default(true)
    }).optional().default({
        enableWhale: true,
        enableAudio: true,
        enableAnalytics: true,
        enableObservatory: true,
        enablePostProcessing: true
    }),
    assetManifest: z.object({
        modelPath: z.string(),
        audioPath: z.string(),
        texturePath: z.string(),
        preloadPriority: z.array(z.string())
    }),
    developer: DeveloperSchema,
    resume: ResumeSchema,
    skills: z.array(SkillCategorySchema),
    projects: z.array(ProjectSchema),
    observatoryTimeline: z.array(TimelineEventSchema),
    worldTriggers: z.array(WorldTriggerSchema)
});

export type PortfolioData = z.infer<typeof PortfolioDataSchema>;

export const SaveDataSchema = z.object({
    version: z.number(),
    discoveredIslands: z.array(z.string()),
    collectedItems: z.array(z.string())
});

export type SaveData = z.infer<typeof SaveDataSchema>;

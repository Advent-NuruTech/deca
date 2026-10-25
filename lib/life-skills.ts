export const lifeSkillPaths = [
  {
    id: "calling",
    number: "01",
    title: "Discover your calling",
    summary: "Recognise the skills, experiences, and opportunities God has placed in your hands.",
    action: "Find your path",
  },
  {
    id: "training",
    number: "02",
    title: "Build life skills",
    summary: "Grow practical ability through faith-centred learning, mentoring, and hands-on training.",
    action: "Explore training",
  },
  {
    id: "livelihoods",
    number: "03",
    title: "Create sustainable livelihoods",
    summary: "Turn useful skills into dignified work, ethical enterprise, and greater self-reliance.",
    action: "Explore opportunities",
  },
  {
    id: "service",
    number: "04",
    title: "Serve & share hope",
    summary: "Use your work to meet real needs, strengthen communities, and point people to Christ.",
    action: "Get involved",
  },
] as const;

export type LifeSkillPathId = (typeof lifeSkillPaths)[number]["id"];

export type LifeSkillPath = { id: LifeSkillPathId; number: string; title: string; summary: string; action: string };
export type LifeSkillsSettings = { pathways: LifeSkillPath[]; skillAreas: string[]; interestRoles: string[] };

// The pathway IDs are stable, so these short explanations stay accurate when
// an administrator updates the editable title, summary, or call to action.
export const lifeSkillPathGuidance: Record<LifeSkillPathId, { for: string; impact: string }> = {
  calling: {
    for: "You want clarity on where your gifts and experience can make a difference.",
    impact: "You can identify a meaningful next step and use your strengths with confidence.",
  },
  training: {
    for: "You are ready to learn or practise a practical skill with support.",
    impact: "You can build confidence, serve your household, and open new opportunities.",
  },
  livelihoods: {
    for: "You are exploring ethical work, small enterprise, or greater self-reliance.",
    impact: "You can work toward steady income, stronger families, and more resilient communities.",
  },
  service: {
    for: "You are ready to use your skills to help others and share Christ's hope.",
    impact: "You can meet practical needs, strengthen relationships, and make hope visible in your community.",
  },
};

export const lifeSkillAreas = [
  "Business & entrepreneurship",
  "Carpentry & construction",
  "Mechanics & technical trades",
  "Agriculture & food production",
  "Technology & digital skills",
  "Health, care & community support",
  "Teaching, mentoring & ministry",
] as const;

export const interestRoles = ["Learn a skill", "Volunteer my skill", "Find mentorship", "Explore a livelihood opportunity", "Partner or support an initiative"] as const;

export const defaultLifeSkillsSettings: LifeSkillsSettings = {
  pathways: lifeSkillPaths.map((path) => ({ ...path })),
  skillAreas: [...lifeSkillAreas],
  interestRoles: [...interestRoles],
};

export function isLifeSkillPath(value: unknown): value is LifeSkillPathId {
  return typeof value === "string" && lifeSkillPaths.some((path) => path.id === value);
}

export function isLifeSkillArea(value: unknown): value is (typeof lifeSkillAreas)[number] {
  return typeof value === "string" && lifeSkillAreas.includes(value as (typeof lifeSkillAreas)[number]);
}

export function isInterestRole(value: unknown): value is (typeof interestRoles)[number] {
  return typeof value === "string" && interestRoles.includes(value as (typeof interestRoles)[number]);
}

function validList(value: unknown, maxItems: number, itemLength: number): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.length <= maxItems && value.every((item) => typeof item === "string" && item.trim().length > 0 && item.trim().length <= itemLength);
}

export function validateLifeSkillsSettings(value: unknown): LifeSkillsSettings | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const { pathways, skillAreas, interestRoles: roles } = value as Record<string, unknown>;
  if (!Array.isArray(pathways) || pathways.length !== lifeSkillPaths.length || !validList(skillAreas, 24, 90) || !validList(roles, 12, 100)) return null;
  const cleanPathways: LifeSkillPath[] = [];
  for (const base of lifeSkillPaths) {
    const candidate = pathways.find((item): item is Record<string, unknown> => !!item && typeof item === "object" && !Array.isArray(item) && (item as Record<string, unknown>).id === base.id);
    if (!candidate || typeof candidate.title !== "string" || !candidate.title.trim() || candidate.title.trim().length > 70 || typeof candidate.summary !== "string" || !candidate.summary.trim() || candidate.summary.trim().length > 180 || typeof candidate.action !== "string" || !candidate.action.trim() || candidate.action.trim().length > 40) return null;
    cleanPathways.push({ id: base.id, number: base.number, title: candidate.title.trim(), summary: candidate.summary.trim(), action: candidate.action.trim() });
  }
  return { pathways: cleanPathways, skillAreas: skillAreas.map((item) => item.trim()), interestRoles: roles.map((item) => item.trim()) };
}

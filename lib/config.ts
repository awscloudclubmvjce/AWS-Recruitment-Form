export const recruitmentConfig = {
  clubName: "AWS SBG Club",
  year: "2026",
  description:
    "A student community for learning cloud, building real projects, sharing ideas, and growing through technical and creative collaboration.",
  contactEmail: "awssbgclub@example.com",
  socialUrl: process.env.NEXT_PUBLIC_AWS_CLUB_SOCIAL_URL || "",
  domains: [
    {
      value: "TECH",
      title: "TECH TEAM",
      tagline: "BUILD. BREAK. REBUILD.",
      description:
        "Build projects, experiment with AWS, solve problems and turn ideas into working technology.",
    },
    {
      value: "PR",
      title: "PR TEAM",
      tagline: "CONNECT. CREATE. COMMUNICATE.",
      description:
        "Build the club's presence, manage communication, create content and connect with people.",
    },
  ],
} as const;

export const applicationStatuses = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
] as const;

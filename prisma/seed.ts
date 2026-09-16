import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const tools = [
  {
    name: "ChatGPT",
    slug: "chatgpt",
    tagline: "AI assistant for writing, coding, research, and more",
    description:
      "ChatGPT is an AI assistant that can help users write content, understand information, generate code, brainstorm ideas, and complete many everyday tasks.",
    category: "AI Assistants",
    pricing: "Freemium",
    websiteUrl: "https://chatgpt.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128",
    rating: 4.8,
    reviewCount: 1250,
    isTrending: true,
    isPopular: true,
    isNew: false,
    features: [
      "AI chat",
      "Code generation",
      "Writing assistance",
      "Image generation",
      "Research",
    ],
    useCases: [
      "Students",
      "Developers",
      "Content creators",
      "Researchers",
    ],
    tags: ["AI", "Chatbot", "Productivity", "Coding"],
  },
  {
    name: "Claude",
    slug: "claude",
    tagline: "AI assistant built for thoughtful and reliable work",
    description:
      "Claude is an AI assistant designed for writing, analysis, coding, research, and working with long documents.",
    category: "AI Assistants",
    pricing: "Freemium",
    websiteUrl: "https://claude.ai",
    logoUrl: "https://www.google.com/s2/favicons?domain=claude.ai&sz=128",
    rating: 4.7,
    reviewCount: 890,
    isTrending: true,
    isPopular: true,
    isNew: false,
    features: [
      "Long context",
      "Writing",
      "Coding",
      "Document analysis",
      "Research",
    ],
    useCases: [
      "Developers",
      "Researchers",
      "Students",
      "Professionals",
    ],
    tags: ["AI", "Assistant", "Coding", "Research"],
  },
  {
    name: "GitHub Copilot",
    slug: "github-copilot",
    tagline: "AI coding assistant for developers",
    description:
      "GitHub Copilot helps developers write code faster by providing code suggestions, explanations, and assistance directly in development environments.",
    category: "Developer Tools",
    pricing: "Paid",
    websiteUrl: "https://github.com/features/copilot",
    logoUrl:
      "https://www.google.com/s2/favicons?domain=github.com&sz=128",
    rating: 4.6,
    reviewCount: 720,
    isTrending: false,
    isPopular: true,
    isNew: false,
    features: [
      "Code completion",
      "Code explanation",
      "AI chat",
      "IDE integration",
      "Debugging assistance",
    ],
    useCases: [
      "Software developers",
      "Students",
      "Programming teams",
    ],
    tags: ["Coding", "Developer", "Programming", "IDE"],
  },
  {
    name: "Perplexity",
    slug: "perplexity",
    tagline: "AI-powered search and research assistant",
    description:
      "Perplexity combines conversational AI with web search to help users find information and research topics with source references.",
    category: "AI Search",
    pricing: "Freemium",
    websiteUrl: "https://www.perplexity.ai",
    logoUrl:
      "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128",
    rating: 4.5,
    reviewCount: 650,
    isTrending: true,
    isPopular: true,
    isNew: false,
    features: [
      "AI search",
      "Web research",
      "Source citations",
      "Follow-up questions",
    ],
    useCases: [
      "Research",
      "Students",
      "News discovery",
      "Fact finding",
    ],
    tags: ["Search", "Research", "AI", "Web"],
  },
  {
    name: "Canva AI",
    slug: "canva-ai",
    tagline: "AI-powered tools for creating visual content",
    description:
      "Canva AI provides AI-powered features for creating presentations, graphics, social media content, images, and other visual designs.",
    category: "Design",
    pricing: "Freemium",
    websiteUrl: "https://www.canva.com",
    logoUrl:
      "https://www.google.com/s2/favicons?domain=canva.com&sz=128",
    rating: 4.4,
    reviewCount: 540,
    isTrending: false,
    isPopular: true,
    isNew: false,
    features: [
      "AI image generation",
      "Design assistance",
      "Presentations",
      "Templates",
      "Magic editing",
    ],
    useCases: [
      "Designers",
      "Students",
      "Marketing teams",
      "Content creators",
    ],
    tags: ["Design", "Images", "Presentations", "Creative"],
  },
  {
    name: "Cursor",
    slug: "cursor",
    tagline: "AI-powered code editor",
    description:
      "Cursor is a code editor built around AI features that help developers understand, edit, generate, and refactor code.",
    category: "Developer Tools",
    pricing: "Freemium",
    websiteUrl: "https://cursor.com",
    logoUrl:
      "https://www.google.com/s2/favicons?domain=cursor.com&sz=128",
    rating: 4.7,
    reviewCount: 430,
    isTrending: true,
    isPopular: false,
    isNew: true,
    features: [
      "AI code generation",
      "Codebase understanding",
      "Refactoring",
      "AI chat",
      "Code completion",
    ],
    useCases: [
      "Software developers",
      "Students",
      "Startup teams",
    ],
    tags: ["Coding", "Editor", "Developer", "Productivity"],
  },
];

async function main() {
  console.log("Starting database seed...");

  await prisma.tool.deleteMany();

  for (const tool of tools) {
    await prisma.tool.create({
      data: tool,
    });
  }

  console.log(`Seeded ${tools.length} AI tools successfully.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
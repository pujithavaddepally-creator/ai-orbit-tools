import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tools = await prisma.tool.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: tools,
    });
  } catch (error) {
    console.error("Failed to fetch tools:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch AI tools",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      tagline,
      description,
      category,
      pricing,
      websiteUrl,
      logoUrl,
      features,
      useCases,
      tags,
    } = body;

    // Validate required fields
    if (
      !name ||
      !tagline ||
      !description ||
      !category ||
      !pricing ||
      !websiteUrl
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        { status: 400 }
      );
    }

    // Create URL-friendly slug
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if tool already exists
    const existingTool = await prisma.tool.findUnique({
      where: {
        slug,
      },
    });

    if (existingTool) {
      return NextResponse.json(
        {
          success: false,
          message: "An AI tool with this name already exists.",
        },
        { status: 409 }
      );
    }

    // Convert comma-separated values into arrays
    const featureList =
      typeof features === "string"
        ? features
            .split(",")
            .map((item: string) => item.trim())
            .filter(Boolean)
        : [];

    const useCaseList =
      typeof useCases === "string"
        ? useCases
            .split(",")
            .map((item: string) => item.trim())
            .filter(Boolean)
        : [];

    const tagList =
      typeof tags === "string"
        ? tags
            .split(",")
            .map((item: string) => item.trim())
            .filter(Boolean)
        : [];

    const tool = await prisma.tool.create({
      data: {
        name: name.trim(),
        slug,
        tagline: tagline.trim(),
        description: description.trim(),
        category: category.trim(),
        pricing: pricing.trim(),
        websiteUrl: websiteUrl.trim(),
        logoUrl: logoUrl?.trim() || null,

        rating: 0,
        reviewCount: 0,

        isTrending: false,
        isPopular: false,
        isNew: true,

        features: featureList,
        useCases: useCaseList,
        tags: tagList,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "AI tool created successfully.",
        data: tool,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create tool:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create AI tool.",
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;

    const tool = await prisma.tool.findUnique({
      where: {
        slug,
      },
    });

    if (!tool) {
      return NextResponse.json(
        {
          success: false,
          message: "AI tool not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tool,
    });
  } catch (error) {
    console.error("Failed to fetch tool:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch AI tool",
      },
      { status: 500 }
    );
  }
}
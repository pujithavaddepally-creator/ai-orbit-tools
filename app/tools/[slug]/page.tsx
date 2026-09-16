"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

type Tool = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  pricing: string;
  websiteUrl: string;
  logoUrl: string | null;
  rating: number;
  reviewCount: number;
  isTrending: boolean;
  isPopular: boolean;
  isNew: boolean;
  features: string[];
  useCases: string[];
  tags: string[];
};

export default function ToolDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let cancelled = false;

    const loadTool = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/tools/${slug}`);

        if (response.status === 404) {
          if (!cancelled) {
            setError("Tool not found");
            setTool(null);
          }
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load this AI tool.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Unable to load this AI tool."
          );
        }

        if (!cancelled) {
          setTool(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch tool:", error);

        if (!cancelled) {
          setTool(null);
          setError(
            "Unable to load this AI tool. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTool();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      return;
    }

    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("ai-orbit-saved-tools");

      if (!saved) {
        setIsSaved(false);
        return;
      }

      try {
        const savedTools: string[] = JSON.parse(saved);
        setIsSaved(savedTools.includes(slug));
      } catch {
        setIsSaved(false);
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [slug]);

  function toggleSaved() {
    if (!slug) {
      return;
    }

    const saved = localStorage.getItem("ai-orbit-saved-tools");

    let savedTools: string[] = [];

    if (saved) {
      try {
        savedTools = JSON.parse(saved);
      } catch {
        savedTools = [];
      }
    }

    if (savedTools.includes(slug)) {
      savedTools = savedTools.filter((item) => item !== slug);
      setIsSaved(false);
    } else {
      savedTools = [...savedTools, slug];
      setIsSaved(true);
    }

    localStorage.setItem(
      "ai-orbit-saved-tools",
      JSON.stringify(savedTools)
    );
  }

  async function retryLoad() {
    if (!slug) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/tools/${slug}`);

      if (response.status === 404) {
        setError("Tool not found");
        setTool(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to load this AI tool.");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Unable to load this AI tool."
        );
      }

      setTool(result.data);
    } catch (error) {
      console.error("Failed to fetch tool:", error);

      setTool(null);
      setError(
        "Unable to load this AI tool. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <header className="border-b border-zinc-800">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight"
            >
              AI ORBIT
            </Link>

            <div className="h-5 w-28 animate-pulse rounded bg-zinc-800" />
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="animate-pulse">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="h-28 w-28 rounded-2xl bg-zinc-900" />

              <div className="flex-1">
                <div className="h-6 w-32 rounded bg-zinc-800" />

                <div className="mt-5 h-12 w-72 rounded bg-zinc-800" />

                <div className="mt-4 h-5 w-full max-w-2xl rounded bg-zinc-800" />

                <div className="mt-4 h-5 w-96 max-w-full rounded bg-zinc-800" />
              </div>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              <div className="h-64 rounded-2xl bg-zinc-950 lg:col-span-2" />

              <div className="h-64 rounded-2xl bg-zinc-950" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !tool) {
    return (
      <main className="flex min-h-screen flex-col bg-black text-white">
        <header className="border-b border-zinc-800">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight hover:text-zinc-300"
            >
              AI ORBIT
            </Link>

            <Link
              href="/"
              className="text-sm text-zinc-400 hover:text-white"
            >
              ← All AI Tools
            </Link>
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center px-5 py-20">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-zinc-800 text-2xl text-zinc-500">
              ?
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              Tool not found
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              The AI tool you are looking for could not be found.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200"
              >
                Back to AI Tools
              </Link>

              {error !== "Tool not found" && (
                <button
                  type="button"
                  onClick={retryLoad}
                  className="rounded-lg border border-zinc-700 px-5 py-3 text-sm text-zinc-300 hover:border-zinc-500 hover:text-white"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight hover:text-zinc-300"
          >
            AI ORBIT
          </Link>

          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white"
          >
            ← All AI Tools
          </Link>
        </div>
      </header>

      {/* Tool Header */}
      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            {/* Logo */}
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
              {tool.logoUrl ? (
                <Image
  src={tool.logoUrl}
  alt={`${tool.name} logo`}
  width={96}
  height={96}
  className="h-24 w-24 object-contain"
/>
              ) : (
                <span className="text-4xl font-bold">
                  {tool.name.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex-1">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {tool.isTrending && (
                  <span className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300">
                    Trending
                  </span>
                )}

                {tool.isPopular && (
                  <span className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300">
                    Popular
                  </span>
                )}

                {tool.isNew && (
                  <span className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300">
                    New
                  </span>
                )}
              </div>

              <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
                {tool.name}
              </h2>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400 sm:text-xl">
                {tool.tagline}
              </p>

              {/* Stats */}
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
                <span className="text-white">
                  ★ {tool.rating.toFixed(1)}
                </span>

                <span>•</span>

                <span>{tool.reviewCount} reviews</span>

                <span>•</span>

                <span>{tool.category}</span>

                <span>•</span>

                <span>{tool.pricing}</span>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={tool.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-lg bg-white px-7 py-4 text-sm font-medium text-black hover:bg-zinc-200"
                >
                  Visit website ↗
                </a>

                <button
                  type="button"
                  onClick={toggleSaved}
                  className={`inline-flex items-center justify-center rounded-lg border px-7 py-4 text-sm font-medium transition ${
                    isSaved
                      ? "border-white bg-white text-black hover:bg-zinc-200"
                      : "border-zinc-700 bg-black text-zinc-300 hover:border-zinc-500 hover:text-white"
                  }`}
                >
                  {isSaved ? "★ Saved" : "☆ Save tool"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* About */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7 sm:p-9">
              <h3 className="text-2xl font-semibold">
                About this tool
              </h3>

              <p className="mt-6 text-base leading-8 text-zinc-400">
                {tool.description}
              </p>
            </section>

            {/* Features */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7 sm:p-9">
              <h3 className="text-2xl font-semibold">
                Features
              </h3>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {tool.features.map((feature) => (
                  <div
                    key={feature}
                    className="rounded-xl border border-zinc-800 bg-black p-5 text-sm text-zinc-300"
                  >
                    <span className="mr-2 text-zinc-400">
                      ✓
                    </span>

                    {feature}
                  </div>
                ))}
              </div>
            </section>

            {/* Use Cases */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7 sm:p-9">
              <h3 className="text-2xl font-semibold">
                Use cases
              </h3>

              <div className="mt-7 flex flex-wrap gap-3">
                {tool.useCases.map((useCase) => (
                  <span
                    key={useCase}
                    className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Tool Information */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7">
              <h3 className="text-xl font-semibold">
                Tool information
              </h3>

              <div className="mt-7 space-y-6">
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-zinc-500">
                    Category
                  </span>

                  <span className="text-right text-sm text-zinc-300">
                    {tool.category}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-zinc-500">
                    Pricing
                  </span>

                  <span className="text-right text-sm text-zinc-300">
                    {tool.pricing}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-zinc-500">
                    Rating
                  </span>

                  <span className="text-right text-sm text-zinc-300">
                    ★ {tool.rating.toFixed(1)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-zinc-500">
                    Reviews
                  </span>

                  <span className="text-right text-sm text-zinc-300">
                    {tool.reviewCount}
                  </span>
                </div>
              </div>
            </section>

            {/* Tags */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7">
              <h3 className="text-xl font-semibold">
                Tags
              </h3>

              <div className="mt-6 flex flex-wrap gap-3">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-zinc-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900">
        <div className="mx-auto max-w-7xl px-5 py-8 text-sm text-zinc-600 sm:px-8">
          AI Orbit — AI Tools Directory
        </div>
      </footer>
    </main>
  );
}
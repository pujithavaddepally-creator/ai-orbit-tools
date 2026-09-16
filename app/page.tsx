"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";

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
  createdAt: string;
  updatedAt: string;
};

type SortOption = "rating" | "reviews" | "newest";

type NavigationTab = {
  name: string;
  errorTitle: string | null;
  errorMessage: string | null;
  color: string;
};

const navigationTabs: NavigationTab[] = [
  {
    name: "New",
    errorTitle: null,
    errorMessage: null,
    color: "text-orange-400",
  },
  {
    name: "Tools",
    errorTitle: null,
    errorMessage: null,
    color: "text-purple-400",
  },
  {
    name: "Agents",
    errorTitle: "Couldn't load the agents",
    errorMessage:
      "Something went wrong fetching the latest AI agents. Check your connection and try again.",
    color: "text-blue-400",
  },
  {
    name: "Tasks",
    errorTitle: "Couldn't load the tasks",
    errorMessage:
      "Something went wrong fetching the latest AI tasks. Check your connection and try again.",
    color: "text-green-400",
  },
  {
    name: "Companies",
    errorTitle: "Couldn't load the companies",
    errorMessage:
      "Something went wrong fetching the latest AI companies. Check your connection and try again.",
    color: "text-pink-400",
  },
  {
    name: "News",
    errorTitle: "Couldn't load the feed",
    errorMessage:
      "Something went wrong fetching the latest news. Check your connection and try again.",
    color: "text-yellow-400",
  },
  {
    name: "Videos",
    errorTitle: "Couldn't load the videos",
    errorMessage:
      "Something went wrong fetching the latest AI videos. Check your connection and try again.",
    color: "text-red-400",
  },
  {
    name: "Robots",
    errorTitle: "Couldn't load the robots",
    errorMessage:
      "Something went wrong fetching the latest AI robots. Check your connection and try again.",
    color: "text-cyan-400",
  },
  {
    name: "Devices",
    errorTitle: "Couldn't load the devices",
    errorMessage:
      "Something went wrong fetching the latest AI devices. Check your connection and try again.",
    color: "text-indigo-400",
  },
  {
    name: "Models",
    errorTitle: "Couldn't load the models",
    errorMessage:
      "Something went wrong fetching the latest AI models. Check your connection and try again.",
    color: "text-violet-400",
  },
  {
    name: "Repositories",
    errorTitle: "Couldn't load the repositories",
    errorMessage:
      "Something went wrong fetching the latest AI repositories. Check your connection and try again.",
    color: "text-teal-400",
  },
];

const SAVED_TOOLS_STORAGE_KEY = "ai-orbit-saved-tools";

function subscribeToSavedTools(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("ai-orbit-saved-tools", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ai-orbit-saved-tools", callback);
  };
}

function getSavedToolsSnapshot() {
  return window.localStorage.getItem(SAVED_TOOLS_STORAGE_KEY) ?? "[]";
}

function getSavedToolsServerSnapshot() {
  return "[]";
}

function parseSavedToolIds(snapshot: string): string[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (id): id is string => typeof id === "string"
    );
  } catch {
    return [];
  }
}

export default function HomePage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("rating");

  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [activeTabError, setActiveTabError] = useState<string | null>(
    null
  );

  const savedToolsSnapshot = useSyncExternalStore(
    subscribeToSavedTools,
    getSavedToolsSnapshot,
    getSavedToolsServerSnapshot
  );

  const savedToolIds = useMemo(
    () => parseSavedToolIds(savedToolsSnapshot),
    [savedToolsSnapshot]
  );

  useEffect(() => {
    async function fetchTools() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/tools");

        if (!response.ok) {
          throw new Error("Failed to fetch tools");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch tools");
        }

        setTools(result.data);
      } catch (err) {
        console.error(err);
        setError(
          "Something went wrong while loading AI tools. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTools();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(tools.map((tool) => tool.category))
    );

    return ["All", ...uniqueCategories];
  }, [tools]);

  const filteredTools = useMemo(() => {
    let result = [...tools];

    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();

      result = result.filter((tool) => {
        return (
          tool.name.toLowerCase().includes(searchTerm) ||
          tool.tagline.toLowerCase().includes(searchTerm) ||
          tool.description.toLowerCase().includes(searchTerm) ||
          tool.category.toLowerCase().includes(searchTerm) ||
          tool.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm)
          )
        );
      });
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (tool) => tool.category === selectedCategory
      );
    }

    if (showSavedOnly) {
      result = result.filter((tool) =>
        savedToolIds.includes(tool.id)
      );
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === "reviews") {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [
    tools,
    search,
    selectedCategory,
    showSavedOnly,
    savedToolIds,
    sortBy,
  ]);

  function toggleSaved(toolId: string) {
    const nextSavedToolIds = savedToolIds.includes(toolId)
      ? savedToolIds.filter((id) => id !== toolId)
      : [...savedToolIds, toolId];

    window.localStorage.setItem(
      SAVED_TOOLS_STORAGE_KEY,
      JSON.stringify(nextSavedToolIds)
    );

    window.dispatchEvent(new Event("ai-orbit-saved-tools"));
  }

  function clearFilters() {
    setSearch("");
    setSelectedCategory("All");
    setSortBy("rating");
    setShowSavedOnly(false);
  }

  function handleNavigation(tab: NavigationTab) {
    if (tab.errorTitle === null) {
      setActiveTabError(null);

      if (tab.name === "New") {
        setSortBy("newest");
        setSearch("");
        setSelectedCategory("All");
        setShowSavedOnly(false);
      }

      if (tab.name === "Tools") {
        setSortBy("rating");
      }

      return;
    }

    setActiveTabError(tab.errorTitle);
  }

  function retryTab() {
    setActiveTabError(null);
  }

  function getToolInitials(name: string) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-white"
          >
            AI <span className="text-purple-400">ORBIT</span>
          </Link>

          <nav className="flex items-center gap-3 text-sm sm:gap-5">
            <Link
              href="/"
              className="text-white transition hover:text-purple-400"
            >
              AI Tools
            </Link>

            <Link
              href="/submit-tool"
              className="rounded-lg border border-purple-400/40 bg-purple-500/10 px-3 py-2 text-purple-300 transition hover:bg-purple-500/20"
            >
              Submit Tool
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-16 text-center sm:px-6">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-purple-400">
            AI TOOLS DIRECTORY
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Discover the best{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              AI tools
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Explore AI tools for coding, writing, research, design,
            productivity, and more.
          </p>

          {/* SEARCH */}
          <div className="mx-auto mt-8 max-w-3xl">
            <div className="flex items-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-1 shadow-2xl shadow-purple-950/20">
              <span className="mr-3 text-xl text-gray-500">⌕</span>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search AI tools..."
                className="w-full bg-transparent py-4 text-white outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* CATEGORY SHORTCUTS */}
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {["All Tools", "Coding", "Writing", "Research", "Design"].map(
              (category) => {
                const actualCategory =
                  category === "All Tools" ? "All" : category;

                return (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(actualCategory);
                      setActiveTabError(null);
                    }}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      selectedCategory === actualCategory
                        ? "border-purple-400/50 bg-purple-500/20 text-purple-300"
                        : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* MAIN NAVIGATION TABS */}
      <section className="border-b border-white/10 bg-black/60">
        <div className="mx-auto max-w-7xl overflow-x-auto px-3 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-max items-center justify-center gap-1 whitespace-nowrap">
            {navigationTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleNavigation(tab)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-white/5 hover:text-white ${tab.color}`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* TAB ERROR */}
        {activeTabError && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-xl">
              !
            </div>

            <h2 className="text-xl font-bold text-white">
              {activeTabError}
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-400">
              {navigationTabs.find(
                (tab) => tab.errorTitle === activeTabError
              )?.errorMessage ||
                "Something went wrong. Check your connection and try again."}
            </p>

            <button
              onClick={retryTab}
              className="mt-5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Try again
            </button>
          </div>
        )}

        {/* CONTROLS */}
        {!activeTabError && (
          <>
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold">Explore AI Tools</h2>

                <p className="mt-1 text-sm text-gray-500">
                  {filteredTools.length}{" "}
                  {filteredTools.length === 1 ? "tool" : "tools"} found
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowSavedOnly((value) => !value)}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    showSavedOnly
                      ? "border-yellow-400/40 bg-yellow-400/10 text-yellow-300"
                      : "border-white/10 bg-white/[0.03] text-gray-400 hover:text-white"
                  }`}
                >
                  ★ Saved ({savedToolIds.length})
                </button>

                <select
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(event.target.value)
                  }
                  className="rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-gray-300 outline-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as SortOption)
                  }
                  className="rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-gray-300 outline-none"
                >
                  <option value="rating">Top Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="newest">Newest</option>
                </select>

                <button
                  onClick={clearFilters}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-gray-400 transition hover:text-white"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-white/10" />

                      <div className="flex-1">
                        <div className="h-4 w-2/3 rounded bg-white/10" />
                        <div className="mt-2 h-3 w-full rounded bg-white/5" />
                        <div className="mt-2 h-3 w-1/2 rounded bg-white/5" />
                      </div>
                    </div>

                    <div className="mt-6 h-16 rounded-lg bg-white/5" />

                    <div className="mt-5 h-9 rounded-lg bg-white/5" />
                  </div>
                ))}
              </div>
            )}

            {/* API ERROR */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-10 text-center">
                <h2 className="text-xl font-bold">
  Couldn&apos;t load AI tools
</h2>

                <p className="mt-2 text-sm text-gray-400">
                  {error}
                </p>

                <button
                  onClick={() => window.location.reload()}
                  className="mt-5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
                >
                  Try again
                </button>
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading &&
              !error &&
              filteredTools.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl">
                    🔍
                  </div>

                  <h2 className="text-xl font-bold">
                    No AI tools found
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Try a different search, category, or filter.
                  </p>

                  <button
                    onClick={clearFilters}
                    className="mt-5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
                  >
                    Clear filters
                  </button>
                </div>
              )}

            {/* TOOL GRID */}
            {!loading &&
              !error &&
              filteredTools.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTools.map((tool) => {
                    const isSaved = savedToolIds.includes(tool.id);

                    return (
                      <article
                        key={tool.id}
                        className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-purple-400/30 hover:bg-white/[0.05]"
                      >
                        {/* CARD TOP */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-4">
                            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                              {tool.logoUrl ? (
                                <Image
                                  src={tool.logoUrl}
                                  alt={`${tool.name} logo`}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <span className="text-sm font-bold text-purple-300">
                                  {getToolInitials(tool.name)}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <Link
                                href={`/tools/${tool.slug}`}
                                className="block truncate text-lg font-bold transition hover:text-purple-400"
                              >
                                {tool.name}
                              </Link>

                              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                {tool.tagline}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleSaved(tool.id)}
                            aria-label={
                              isSaved
                                ? `Remove ${tool.name} from saved tools`
                                : `Save ${tool.name}`
                            }
                            className={`shrink-0 text-xl transition ${
                              isSaved
                                ? "text-yellow-300"
                                : "text-gray-600 hover:text-yellow-300"
                            }`}
                          >
                            ★
                          </button>
                        </div>

                        {/* BADGES */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-2.5 py-1 text-xs text-purple-300">
                            {tool.category}
                          </span>

                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400">
                            {tool.pricing}
                          </span>

                          {tool.isTrending && (
                            <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-2.5 py-1 text-xs text-orange-300">
                              Trending
                            </span>
                          )}

                          {tool.isNew && (
                            <span className="rounded-full border border-green-400/20 bg-green-400/10 px-2.5 py-1 text-xs text-green-300">
                              New
                            </span>
                          )}
                        </div>

                        {/* DESCRIPTION */}
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-400">
                          {tool.description}
                        </p>

                        {/* RATING */}
                        <div className="mt-5 flex items-center gap-3 text-sm">
                          <span className="font-semibold text-yellow-300">
                            ★ {tool.rating.toFixed(1)}
                          </span>

                          <span className="text-gray-600">•</span>

                          <span className="text-gray-500">
                            {tool.reviewCount.toLocaleString()} reviews
                          </span>
                        </div>

                        {/* TAGS */}
                        {tool.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {tool.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-500"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* ACTION */}
                        <div className="mt-6 flex gap-2">
                          <Link
                            href={`/tools/${tool.slug}`}
                            className="flex-1 rounded-lg bg-white px-4 py-2.5 text-center text-sm font-semibold text-black transition hover:bg-gray-200"
                          >
                            View Details
                          </Link>

                          <a
                            href={tool.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
                          >
                            Visit
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
          </>
        )}
      </section>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-center text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 sm:text-left">
          <p>© 2026 AI Orbit Tools Directory</p>

          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              AI Tools
            </Link>

            <Link
              href="/submit-tool"
              className="transition hover:text-white"
            >
              Submit Tool
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
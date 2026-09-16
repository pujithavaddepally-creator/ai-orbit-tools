"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function SubmitToolPage() {
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    category: "",
    pricing: "",
    websiteUrl: "",
    logoUrl: "",
  });

  const [features, setFeatures] = useState("");
  const [useCases, setUseCases] = useState("");
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (
      !form.name ||
      !form.tagline ||
      !form.description ||
      !form.category ||
      !form.pricing ||
      !form.websiteUrl
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          features,
          useCases,
          tags,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to submit AI tool"
        );
      }

      setSuccess(
        "AI tool submitted successfully! It has been added to the directory."
      );

      setForm({
        name: "",
        tagline: "",
        description: "",
        category: "",
        pricing: "",
        websiteUrl: "",
        logoUrl: "",
      });

      setFeatures("");
      setUseCases("");
      setTags("");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            ← All AI Tools
          </Link>
        </div>
      </header>

      {/* Page heading */}
      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            AI Tools Directory
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            Submit an AI tool
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Add an AI tool to the AI Orbit directory by providing
            its basic information, features, and use cases.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-9"
        >
          <div className="space-y-8">
            {/* Basic information */}
            <div>
              <h2 className="text-xl font-semibold">
                Basic information
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Provide the main details about the AI tool.
              </p>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Tool name *
              </label>

              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. ChatGPT"
                className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
              />
            </div>

            {/* Tagline */}
            <div>
              <label
                htmlFor="tagline"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Tagline *
              </label>

              <input
                id="tagline"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                placeholder="Short description of the tool"
                className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Description *
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                placeholder="Explain what the AI tool does..."
                className="w-full resize-y rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
              />
            </div>

            {/* Category + Pricing */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Category *
                </label>

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-300 outline-none focus:border-zinc-500"
                >
                  <option value="">Select category</option>
                  <option value="Chat">Chat</option>
                  <option value="Coding">Coding</option>
                  <option value="Research">Research</option>
                  <option value="Design">Design</option>
                  <option value="Productivity">
                    Productivity
                  </option>
                  <option value="Writing">Writing</option>
                  <option value="Image">Image</option>
                  <option value="Video">Video</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="pricing"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Pricing *
                </label>

                <select
                  id="pricing"
                  name="pricing"
                  value={form.pricing}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-300 outline-none focus:border-zinc-500"
                >
                  <option value="">Select pricing</option>
                  <option value="Free">Free</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Paid">Paid</option>
                  <option value="Free / Paid">
                    Free / Paid
                  </option>
                </select>
              </div>
            </div>

            {/* Website */}
            <div>
              <label
                htmlFor="websiteUrl"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Website URL *
              </label>

              <input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                value={form.websiteUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
              />
            </div>

            {/* Logo */}
            <div>
              <label
                htmlFor="logoUrl"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Logo URL
              </label>

              <input
                id="logoUrl"
                name="logoUrl"
                type="url"
                value={form.logoUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
              />

              <p className="mt-2 text-xs text-zinc-600">
                Optional
              </p>
            </div>

            {/* Features */}
            <div>
              <label
                htmlFor="features"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Features
              </label>

              <textarea
                id="features"
                value={features}
                onChange={(event) =>
                  setFeatures(event.target.value)
                }
                rows={4}
                placeholder="Enter features separated by commas"
                className="w-full resize-y rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
              />

              <p className="mt-2 text-xs text-zinc-600">
                Example: AI chat, Code generation, File analysis
              </p>
            </div>

            {/* Use cases */}
            <div>
              <label
                htmlFor="useCases"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Use cases
              </label>

              <textarea
                id="useCases"
                value={useCases}
                onChange={(event) =>
                  setUseCases(event.target.value)
                }
                rows={4}
                placeholder="Enter use cases separated by commas"
                className="w-full resize-y rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
              />

              <p className="mt-2 text-xs text-zinc-600">
                Example: Students, Developers, Researchers
              </p>
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Tags
              </label>

              <input
                id="tags"
                value={tags}
                onChange={(event) =>
                  setTags(event.target.value)
                }
                placeholder="ai, productivity, writing"
                className="w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
              />

              <p className="mt-2 text-xs text-zinc-600">
                Separate tags with commas.
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4">
                <p className="text-sm text-red-300">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
                <p className="text-sm text-zinc-300">
                  {success}
                </p>

                <Link
                  href="/"
                  className="mt-3 inline-block text-sm text-white underline underline-offset-4"
                >
                  View AI Tools →
                </Link>
              </div>
            )}

            {/* Submit */}
            <div className="border-t border-zinc-800 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {loading
                  ? "Submitting..."
                  : "Submit AI Tool"}
              </button>
            </div>
          </div>
        </form>
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
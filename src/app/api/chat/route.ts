import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const KB_PATH = path.join(process.cwd(), "kb", "fallback_kb.txt");

function loadKB() {
  try {
    return fs.readFileSync(KB_PATH, "utf8");
  } catch {
    return "Knowledge base not found.";
  }
}

export async function POST(req: Request) {
  const { question } = await req.json();
  const kb = loadKB();

  // Very simple matching logic (safe + predictable)
  const lowerQ = (question || "").toLowerCase();

  let answer = "Thanks for your question! Here’s what I can share:\n\n" + kb;

  if (lowerQ.includes("contact")) {
    answer =
      "You can contact Arnav via email at arnav94300@gmail.com or connect on LinkedIn.";
  }

  if (lowerQ.includes("services") || lowerQ.includes("offer")) {
    answer =
      "Arnav works in Data Science, Analytics, Automation, and AI-driven solutions.";
  }

  if (lowerQ.includes("experience")) {
    answer =
      "Arnav has experience across e-commerce, retail, and banking, with strong expertise in analytics and automation.";
  }

  return NextResponse.json({
    answer,
    sources: ["Static Knowledge Base"],
  });
}
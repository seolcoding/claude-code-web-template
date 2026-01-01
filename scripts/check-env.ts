#!/usr/bin/env npx tsx

/**
 * Environment Variable Checker
 * Validates required environment variables and warns about missing ones.
 */

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
  howToGet: string;
}

const ENV_VARS: EnvVar[] = [
  {
    name: "NETLIFY_SITE_ID",
    required: true,
    description: "Netlify site ID for preview deployments",
    howToGet: "Netlify Dashboard → Site Settings → General → Site ID",
  },
  {
    name: "GITHUB_TOKEN",
    required: false,
    description: "GitHub personal access token for API access",
    howToGet: "GitHub → Settings → Developer Settings → Personal Access Tokens",
  },
  {
    name: "SENTRY_AUTH_TOKEN",
    required: false,
    description: "Sentry authentication token for error monitoring",
    howToGet: "Sentry → Settings → Auth Tokens → Create New Token",
  },
  {
    name: "NOTION_TOKEN",
    required: false,
    description: "Notion integration token for documentation",
    howToGet: "Notion → Settings → Integrations → Create Integration",
  },
];

function checkEnv(): void {
  console.log("🔍 Checking environment variables...\n");

  const missing: EnvVar[] = [];
  const optional: EnvVar[] = [];
  const set: string[] = [];

  for (const envVar of ENV_VARS) {
    const value = process.env[envVar.name];

    if (!value) {
      if (envVar.required) {
        missing.push(envVar);
      } else {
        optional.push(envVar);
      }
    } else {
      set.push(envVar.name);
    }
  }

  // Report set variables
  if (set.length > 0) {
    console.log("✅ Set variables:");
    for (const name of set) {
      console.log(`   - ${name}`);
    }
    console.log();
  }

  // Report missing required variables
  if (missing.length > 0) {
    console.log("❌ MISSING REQUIRED VARIABLES:");
    console.log("   These must be set before proceeding:\n");

    for (const envVar of missing) {
      console.log(`   ${envVar.name}`);
      console.log(`   └─ ${envVar.description}`);
      console.log(`   └─ How to get: ${envVar.howToGet}`);
      console.log();
    }
  }

  // Report optional variables
  if (optional.length > 0) {
    console.log("⚠️  Optional variables (not set):");
    for (const envVar of optional) {
      console.log(`   - ${envVar.name}: ${envVar.description}`);
    }
    console.log();
  }

  // Summary
  if (missing.length > 0) {
    console.log("─".repeat(50));
    console.log("⛔ Setup incomplete. Please set the required variables.");
    console.log("   See CLAUDE.md for detailed setup instructions.");
    process.exit(1);
  } else {
    console.log("─".repeat(50));
    console.log("✅ All required environment variables are set!");
  }
}

checkEnv();

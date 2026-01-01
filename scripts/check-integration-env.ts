#!/usr/bin/env npx tsx

/**
 * Dynamic Integration Environment Checker
 * Checks environment variables for a specific integration
 */

import { readFileSync } from "fs";
import { join } from "path";

interface EnvVarDef {
  name: string;
  required: boolean;
  description: string;
  howToGet: string;
}

interface Integration {
  id: string;
  name: string;
  type?: string;
  webCompatible: boolean;
  localOnly?: boolean;
  envVars?: EnvVarDef[];
  authType?: string;
  oauthInstructions?: string;
}

interface IntegrationsData {
  mcpServers: Integration[];
  skills: Integration[];
  plugins: Integration[];
}

function loadIntegrations(): IntegrationsData {
  const dataPath = join(__dirname, "data", "integrations.json");
  const content = readFileSync(dataPath, "utf-8");
  return JSON.parse(content);
}

function findIntegration(id: string): Integration | null {
  const data = loadIntegrations();

  // Search in all categories
  const allIntegrations = [
    ...data.mcpServers,
    ...data.skills,
    ...data.plugins,
  ];

  return (
    allIntegrations.find(
      (i) => i.id.toLowerCase() === id.toLowerCase() ||
             i.name.toLowerCase() === id.toLowerCase()
    ) || null
  );
}

function checkIntegrationEnv(integrationId: string): void {
  const integration = findIntegration(integrationId);

  if (!integration) {
    console.log(`❌ Integration "${integrationId}" not found in curated list.`);
    console.log("\nAvailable integrations:");
    const data = loadIntegrations();
    console.log("\nMCP Servers:");
    data.mcpServers.forEach((m) => console.log(`  - ${m.id}: ${m.name}`));
    console.log("\nSkills:");
    data.skills.forEach((s) => console.log(`  - ${s.id}: ${s.name}`));
    console.log("\nPlugins:");
    data.plugins.forEach((p) => console.log(`  - ${p.id}: ${p.name}`));
    process.exit(1);
  }

  console.log(`\n🔍 Checking: ${integration.name}`);
  console.log("─".repeat(50));

  // Check web compatibility
  if (integration.localOnly || !integration.webCompatible) {
    console.log(`\n⚠️  WARNING: ${integration.name} is NOT compatible with web Claude Code.`);
    console.log("   This integration requires local CLI (stdio transport).");
    console.log("   It will not work in claude.ai/code sandbox environment.");
  } else {
    console.log(`✅ Web compatible: Yes`);
  }

  // Check auth type
  if (integration.authType) {
    console.log(`\n📋 Authentication: ${integration.authType.toUpperCase()}`);

    if (integration.authType === "oauth" && integration.oauthInstructions) {
      console.log(`   ${integration.oauthInstructions}`);
    }
  }

  // Check environment variables
  const envVars = integration.envVars || [];

  if (envVars.length === 0) {
    console.log("\n✅ No environment variables required.");
    return;
  }

  console.log("\n📋 Environment Variables:");

  const missing: EnvVarDef[] = [];
  const set: string[] = [];

  for (const envVar of envVars) {
    const value = process.env[envVar.name];
    if (value) {
      set.push(envVar.name);
      console.log(`   ✅ ${envVar.name} - Set`);
    } else {
      missing.push(envVar);
      console.log(`   ❌ ${envVar.name} - Missing`);
    }
  }

  if (missing.length > 0) {
    console.log("\n" + "─".repeat(50));
    console.log("⚠️  MISSING REQUIRED VARIABLES:\n");

    for (const envVar of missing) {
      console.log(`   ${envVar.name}`);
      console.log(`   └─ ${envVar.description}`);
      console.log(`   └─ How to get: ${envVar.howToGet}`);
      console.log();
    }

    console.log("Set these variables and run this check again.");
    process.exit(1);
  }

  console.log("\n" + "─".repeat(50));
  console.log("✅ All requirements met for", integration.name);
}

// Main
const integrationId = process.argv[2];

if (!integrationId) {
  console.log("Usage: npx tsx scripts/check-integration-env.ts <integration-id>");
  console.log("\nExample: npx tsx scripts/check-integration-env.ts sentry");
  process.exit(1);
}

checkIntegrationEnv(integrationId);

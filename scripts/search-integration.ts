#!/usr/bin/env npx tsx

/**
 * Search for integrations in local data and suggest alternatives
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface Integration {
  id: string;
  name: string;
  description: string;
  webCompatible: boolean;
  localOnly?: boolean;
  type?: string;
  source?: string;
}

interface IntegrationsData {
  mcpServers: Integration[];
  skills: Integration[];
  plugins: Integration[];
}

function loadIntegrations(): IntegrationsData {
  const dataPath = join(__dirname, "data", "integrations.json");
  if (!existsSync(dataPath)) {
    console.error("❌ integrations.json not found. Using empty data.");
    return { mcpServers: [], skills: [], plugins: [] };
  }
  const content = readFileSync(dataPath, "utf-8");
  return JSON.parse(content);
}

function searchIntegrations(query: string): void {
  const data = loadIntegrations();
  const queryLower = query.toLowerCase();

  const results: Array<Integration & { category: string }> = [];

  // Search MCP servers
  for (const item of data.mcpServers) {
    if (
      item.id.toLowerCase().includes(queryLower) ||
      item.name.toLowerCase().includes(queryLower) ||
      item.description.toLowerCase().includes(queryLower)
    ) {
      results.push({ ...item, category: "MCP Server" });
    }
  }

  // Search skills
  for (const item of data.skills) {
    if (
      item.id.toLowerCase().includes(queryLower) ||
      item.name.toLowerCase().includes(queryLower) ||
      item.description.toLowerCase().includes(queryLower)
    ) {
      results.push({ ...item, category: "Skill" });
    }
  }

  // Search plugins
  for (const item of data.plugins) {
    if (
      item.id.toLowerCase().includes(queryLower) ||
      item.name.toLowerCase().includes(queryLower) ||
      item.description.toLowerCase().includes(queryLower)
    ) {
      results.push({ ...item, category: "Plugin" });
    }
  }

  // Output results
  if (results.length === 0) {
    console.log(`\n❌ No integrations found for "${query}"`);
    console.log("\n💡 Try searching the web for:");
    console.log(`   - "claude code ${query} mcp"`);
    console.log(`   - "awesome-mcp-servers ${query}"`);
    console.log("\nOr check these resources:");
    console.log("   - https://github.com/anthropics/skills");
    console.log("   - https://github.com/punkpeye/awesome-mcp-servers");
    return;
  }

  console.log(`\n🔍 Found ${results.length} result(s) for "${query}":\n`);

  // Group by web compatibility
  const webCompatible = results.filter((r) => r.webCompatible);
  const localOnly = results.filter((r) => !r.webCompatible);

  if (webCompatible.length > 0) {
    console.log("✅ Web Compatible:");
    for (const item of webCompatible) {
      console.log(`   [${item.category}] ${item.name} (${item.id})`);
      console.log(`      ${item.description}`);
    }
  }

  if (localOnly.length > 0) {
    console.log("\n⚠️  Local CLI Only:");
    for (const item of localOnly) {
      console.log(`   [${item.category}] ${item.name} (${item.id})`);
      console.log(`      ${item.description}`);
    }
  }
}

function listCategories(): void {
  const data = loadIntegrations();

  console.log("\n📋 Available Integrations:\n");

  console.log("MCP Servers (External Services):");
  const webMcp = data.mcpServers.filter((m) => m.webCompatible);
  const localMcp = data.mcpServers.filter((m) => !m.webCompatible);

  console.log("  Web Compatible:");
  webMcp.forEach((m) => console.log(`    ✅ ${m.name} - ${m.description}`));
  console.log("  Local Only:");
  localMcp.forEach((m) => console.log(`    ⚠️  ${m.name} - ${m.description}`));

  console.log("\nSkills (Claude Capabilities):");
  data.skills.forEach((s) => {
    const icon = s.webCompatible ? "✅" : "⚠️ ";
    console.log(`  ${icon} ${s.name} - ${s.description}`);
  });

  console.log("\nPlugins (Extended Features):");
  data.plugins.forEach((p) => {
    const icon = p.webCompatible ? "✅" : "⚠️ ";
    console.log(`  ${icon} ${p.name} - ${p.description}`);
  });
}

// Main
const query = process.argv[2];

if (!query) {
  listCategories();
} else if (query === "--list" || query === "-l") {
  listCategories();
} else {
  searchIntegrations(query);
}

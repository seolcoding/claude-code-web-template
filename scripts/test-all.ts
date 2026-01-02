#!/usr/bin/env bun

/**
 * Template Feature Test Suite
 * Automated tests for all template functionality
 *
 * Run with: bun run scripts/test-all.ts
 */

import { existsSync, readFileSync } from "fs";

interface TestResult {
  category: string;
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function test(category: string, name: string, fn: () => boolean | string): void {
  try {
    const result = fn();
    if (typeof result === "boolean") {
      results.push({ category, name, passed: result, message: result ? "OK" : "FAILED" });
    } else {
      results.push({ category, name, passed: true, message: result });
    }
  } catch (error) {
    results.push({
      category,
      name,
      passed: false,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

// =============================================================================
// 1. File Structure Tests
// =============================================================================

test("File Structure", "CLAUDE.md exists", () => existsSync("CLAUDE.md"));
test("File Structure", ".mcp.json exists", () => existsSync(".mcp.json"));
test("File Structure", ".claude/settings.json exists", () => existsSync(".claude/settings.json"));
test("File Structure", "netlify.toml exists", () => existsSync("netlify.toml"));
test("File Structure", "scripts/setup.sh exists", () => existsSync("scripts/setup.sh"));
test("File Structure", "docs/CLAIMS.md exists", () => existsSync("docs/CLAIMS.md"));
test("File Structure", "docs/TROUBLESHOOTING.md exists", () => existsSync("docs/TROUBLESHOOTING.md"));
test("File Structure", "scripts/verify-setup.ts exists", () => existsSync("scripts/verify-setup.ts"));

// =============================================================================
// 2. Package Manager Tests
// =============================================================================

test("Package Manager", "package.json exists", () => existsSync("package.json"));

test("Package Manager", "package.json uses bun in scripts", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
  const scripts = JSON.stringify(pkg.scripts || {});
  return scripts.includes("bun") ? "bun found in scripts" : false;
});

test("Package Manager", "Node.js version >=20 required", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
  const nodeVersion = pkg.engines?.node;
  return nodeVersion?.includes("20") ? `engines.node: ${nodeVersion}` : false;
});

// =============================================================================
// 3. SessionStart Hook Tests
// =============================================================================

test("SessionStart Hook", "settings.json has SessionStart hook", () => {
  if (!existsSync(".claude/settings.json")) return false;
  const settings = JSON.parse(readFileSync(".claude/settings.json", "utf-8"));
  return settings.hooks?.SessionStart ? "SessionStart hook configured" : false;
});

test("SessionStart Hook", "setup.sh references bun", () => {
  const content = readFileSync("scripts/setup.sh", "utf-8");
  return content.includes("bun") ? "bun found in setup.sh" : false;
});

test("SessionStart Hook", "setup.sh has fallback logic", () => {
  const content = readFileSync("scripts/setup.sh", "utf-8");
  return content.includes("fallback") ? "fallback logic found" : false;
});

test("SessionStart Hook", "setup.sh has retry logic", () => {
  const content = readFileSync("scripts/setup.sh", "utf-8");
  return content.includes("max_retries") ? "retry logic found" : false;
});

// =============================================================================
// 4. MCP Configuration Tests
// =============================================================================

test("MCP Configuration", ".mcp.json is valid JSON", () => {
  const content = readFileSync(".mcp.json", "utf-8");
  JSON.parse(content);
  return "valid JSON";
});

test("MCP Configuration", "Has HTTP MCP servers", () => {
  const config = JSON.parse(readFileSync(".mcp.json", "utf-8"));
  const servers = Object.keys(config.mcpServers || {});
  return servers.length > 0 ? `${servers.length} servers: ${servers.join(", ")}` : false;
});

test("MCP Configuration", "No stdio MCP servers", () => {
  const config = JSON.parse(readFileSync(".mcp.json", "utf-8"));
  const servers = Object.entries(config.mcpServers || {});
  const stdioServers = servers.filter(([_, s]: [string, any]) => s.type === "stdio" || s.command);
  return stdioServers.length === 0 ? "No stdio servers (good)" : false;
});

test("MCP Configuration", "OAuth servers present", () => {
  const config = JSON.parse(readFileSync(".mcp.json", "utf-8"));
  const servers = Object.keys(config.mcpServers || {});
  const oauthServers = ["github", "figma", "netlify", "notion"];
  const found = oauthServers.filter((s) => servers.includes(s));
  return found.length === oauthServers.length ? `OAuth: ${found.join(", ")}` : false;
});

test("MCP Configuration", "Open servers present", () => {
  const config = JSON.parse(readFileSync(".mcp.json", "utf-8"));
  const servers = Object.keys(config.mcpServers || {});
  const openServers = ["exa-search", "aws-docs", "huggingface"];
  const found = openServers.filter((s) => servers.includes(s));
  return found.length === openServers.length ? `Open: ${found.join(", ")}` : false;
});

// =============================================================================
// 5. Claims Tests
// =============================================================================

test("Claims", "CLAUDE.md has CRITICAL CLAIMS section", () => {
  const content = readFileSync("CLAUDE.md", "utf-8");
  return content.includes("CRITICAL CLAIMS") ? "CRITICAL CLAIMS found" : false;
});

test("Claims", "NO_LOCALHOST claim exists", () => {
  const content = readFileSync("CLAUDE.md", "utf-8");
  return content.includes("NO_LOCALHOST");
});

test("Claims", "HTTP_MCP_ONLY claim exists", () => {
  const content = readFileSync("CLAUDE.md", "utf-8");
  return content.includes("HTTP_MCP_ONLY");
});

test("Claims", "SESSION_EPHEMERAL claim exists", () => {
  const content = readFileSync("CLAUDE.md", "utf-8");
  return content.includes("SESSION_EPHEMERAL");
});

test("Claims", "GIT_IS_PERSISTENCE claim exists", () => {
  const content = readFileSync("CLAUDE.md", "utf-8");
  return content.includes("GIT_IS_PERSISTENCE");
});

test("Claims", "docs/CLAIMS.md has detailed claims", () => {
  const content = readFileSync("docs/CLAIMS.md", "utf-8");
  return content.includes("Claim ID") ? "Detailed claims found" : false;
});

// =============================================================================
// 6. Custom Commands Tests
// =============================================================================

test("Custom Commands", "/init-project exists", () => existsSync(".claude/commands/init-project.md"));
test("Custom Commands", "/preview exists", () => existsSync(".claude/commands/preview.md"));
test("Custom Commands", "/check-env exists", () => existsSync(".claude/commands/check-env.md"));
test("Custom Commands", "/verify exists", () => existsSync(".claude/commands/verify.md"));
test("Custom Commands", "/test-template exists", () => existsSync(".claude/commands/test-template.md"));

// =============================================================================
// 7. Verify Script Tests
// =============================================================================

test("Verify Script", "verify-setup.ts uses bun shebang", () => {
  const content = readFileSync("scripts/verify-setup.ts", "utf-8");
  return content.startsWith("#!/usr/bin/env bun") ? "bun shebang found" : false;
});

test("Verify Script", "verify-setup.ts has test cases documentation", () => {
  const content = readFileSync("scripts/verify-setup.ts", "utf-8");
  return content.includes("TEST CASES CHECKLIST") ? "Test cases documented" : false;
});

// =============================================================================
// 8. Environment Tests
// =============================================================================

test("Environment", ".env.example exists", () => existsSync(".env.example"));

test("Environment", ".env.example has NETLIFY_SITE_ID", () => {
  const content = readFileSync(".env.example", "utf-8");
  return content.includes("NETLIFY_SITE_ID");
});

test("Environment", "README.md has Requirements section", () => {
  const content = readFileSync("README.md", "utf-8");
  return content.includes("## Requirements") ? "Requirements section found" : false;
});

test("Environment", "README.md has Given/When/Then examples", () => {
  const content = readFileSync("README.md", "utf-8");
  return content.includes("Given/When/Then") ? "BDD examples found" : false;
});

// =============================================================================
// Report Results
// =============================================================================

console.log("\n");
console.log("=".repeat(70));
console.log("  Template Feature Test Suite - Results");
console.log("=".repeat(70));
console.log("\n");

const categories = [...new Set(results.map((r) => r.category))];

for (const category of categories) {
  console.log(`\n📁 ${category}`);
  console.log("-".repeat(50));

  const categoryResults = results.filter((r) => r.category === category);
  for (const result of categoryResults) {
    const icon = result.passed ? "✅" : "❌";
    console.log(`  ${icon} ${result.name}`);
    if (result.message !== "OK" && result.message !== "FAILED") {
      console.log(`     → ${result.message}`);
    }
  }
}

const passed = results.filter((r) => r.passed).length;
const failed = results.filter((r) => !r.passed).length;
const total = results.length;

console.log("\n");
console.log("=".repeat(70));
console.log(`  Summary: ${passed}/${total} passed, ${failed} failed`);
console.log("=".repeat(70));

if (failed > 0) {
  console.log("\n❌ Some tests failed!");
  process.exit(1);
} else {
  console.log("\n✅ All tests passed!");
  process.exit(0);
}

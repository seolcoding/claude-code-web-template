---
name: mcp-manager
description: Interactively discover, add, and configure MCP servers, skills, and plugins with automatic environment validation
triggers:
  - add mcp
  - add skill
  - add plugin
  - install mcp
  - find mcp
  - search mcp
  - setup integration
---

# MCP/Skill/Plugin Manager

Interactively manage integrations for Claude Code.

## Workflow (Always Interactive)

### Step 1: Understand User Need
Ask the user what they want to integrate:
- "What service do you want to connect?" (Notion, Sentry, Slack, etc.)
- "What capability do you need?" (error monitoring, docs, database, etc.)

### Step 2: Search Available Options
1. Check external curated data: `scripts/data/integrations.json`
2. If not found, search web for official MCP/skill
3. Present options to user with pros/cons

### Step 3: Validate Compatibility
Check if compatible with web Claude Code:
- ✅ HTTP/SSE MCP → Works
- ❌ Stdio MCP → Inform user this only works locally

### Step 4: Check Environment
Run dynamic env check:
```bash
npx tsx scripts/check-integration-env.ts <service-name>
```

If missing, guide user:
```
⚠️ Missing: NOTION_TOKEN

To get this:
1. Go to https://notion.so/my-integrations
2. Create integration → Copy secret
3. Set: export NOTION_TOKEN="secret_xxx"

Reply 'done' when you've set it, or 'skip' to continue without.
```

### Step 5: Install
- Add to `.mcp.json` for MCP servers
- Create skill folder for skills
- Run `claude plugin add` for plugins

### Step 6: Authenticate
If OAuth required:
```
Run /mcp and authenticate with <service>
```

## Data Sources

### Primary: Local Curated Data
`scripts/data/integrations.json` - maintained list with:
- Service name, type (mcp/skill/plugin)
- URL, auth type, required env vars
- Web compatibility flag

### Fallback: Web Search
Search these sources:
- https://github.com/anthropics/skills
- https://github.com/travisvn/awesome-claude-skills
- https://github.com/punkpeye/awesome-mcp-servers

## Interactive Prompts

Always ask before taking action:
- "Found 3 options for error monitoring. Which one?"
- "This requires SENTRY_TOKEN. Have you set it?"
- "This MCP needs OAuth. Ready to authenticate?"

Never assume - always confirm with user.

# Add Integration (MCP/Skill/Plugin)

Interactively add a new integration to the project.

Usage: `/add-integration [service-name]`

## Interactive Flow

### If $ARGUMENTS is empty:
Ask the user:
"What would you like to integrate? For example:
- Error monitoring (Sentry)
- Documentation (Notion)
- Issue tracking (Linear, GitHub)
- Payments (Stripe)
- Or describe what you need..."

### If $ARGUMENTS provided:
1. Search in `scripts/data/integrations.json` first
2. If not found, search web for official MCP/skill

### Before Installing:
1. **Check Web Compatibility**
   ```bash
   npx tsx scripts/check-integration-env.ts $ARGUMENTS
   ```

2. **If NOT web compatible**, warn user:
   "⚠️ This integration requires local Claude Code CLI.
   It uses stdio transport which doesn't work in web sandbox.

   Options:
   A) Continue anyway (for local development)
   B) Find an alternative HTTP-based integration
   C) Skip this integration"

3. **If env vars missing**, provide step-by-step:
   "To set up [SERVICE]:
   1. Go to [URL]
   2. [Steps to get token]
   3. Set in terminal: export VAR_NAME='value'
   4. Reply 'done' when ready"

4. **Wait for user confirmation** before modifying any files

### Install Steps:
For MCP servers, add to `.mcp.json`
For skills, create `.claude/skills/<name>/SKILL.md`
For plugins, run `claude plugin add <name>`

### After Install:
If OAuth required:
"Run `/mcp` in Claude Code to authenticate with [service]"

Run verification:
```bash
npx tsx scripts/check-integration-env.ts $ARGUMENTS
```

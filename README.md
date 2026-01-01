# Claude Code Web Template

Template for developing with **Claude Code on the Web** (claude.ai/code).

## Why This Template?

Web Claude Code runs in a sandboxed Gvisor VM with specific constraints:

| Feature | Status | Notes |
|---------|--------|-------|
| localhost access | ❌ | Use Netlify preview URLs instead |
| stdio MCP | ❌ | HTTP MCP only |
| SSH/Docker | ❌ | Isolated VM |
| HTTP MCP | ✅ | GitHub, Figma, Notion, etc. |
| SessionStart hooks | ✅ | Auto-setup on session start |
| Environment variables | ✅ | Set via environment selector |
| Git/GitHub | ✅ | Full integration |

## Quick Start

### 1. Fork & Connect

1. Fork this repository to your GitHub
2. Go to [claude.ai/code](https://claude.ai/code)
3. Connect the repository

### 2. User Setup (Required)

These steps **cannot** be done by Claude Code - you must do them:

| Step | Action |
|------|--------|
| **Netlify** | Create account → Connect repo → Enable deploy previews |
| **Environment** | In claude.ai/code: Environment selector → Add environment → Set `NETLIFY_SITE_ID=xxx` |
| **OAuth** | In Claude Code session: Run `/mcp` to authenticate GitHub, Figma, Notion |

### 3. First Session (Bootstrap)

SessionStart hook automatically runs `scripts/setup.sh`:
- Installs dependencies
- Validates environment variables
- Displays MCP authentication reminders

### 4. Initialize Project

```
/init-project react    # or vue, svelte, next, astro
```

### 5. Development Workflow

```
Claude writes code → Push to branch → Netlify deploys preview
→ Check preview URL → Iterate → Merge to main
```

## Commands

| Command | Description |
|---------|-------------|
| `/init-project <framework>` | Initialize with React/Vue/Svelte/Next/Astro |
| `/preview` | Get current Netlify preview URL |
| `/check-env` | Validate environment variables |
| `/add-integration` | Add MCP/Skill interactively |

## Default MCP Servers

**OAuth Required:**
- GitHub (`https://api.githubcopilot.com/mcp/`)
- Figma (`https://mcp.figma.com/mcp`)
- Netlify (`https://netlify-mcp.netlify.app/mcp`)
- Notion (`https://mcp.notion.com/sse`)

**Open (No Auth):**
- Exa Search (`https://mcp.exa.ai/mcp`)
- AWS Docs (`https://knowledge-mcp.global.api.aws`)
- Hugging Face (`https://hf.co/mcp`)

## Structure

```
├── CLAUDE.md              # Claims & instructions for Claude
├── .claude/
│   ├── settings.json      # Hooks, permissions
│   ├── commands/          # Slash commands
│   └── skills/            # Custom skills
├── .mcp.json              # HTTP MCP servers
├── scripts/
│   ├── setup.sh           # SessionStart hook script
│   ├── check-env.ts       # Environment validator
│   └── data/
│       └── integrations.json  # MCP/Skill registry
├── netlify.toml           # Auto preview deployment
└── src/                   # Your app code
```

## Environment Variables

Set in claude.ai/code environment selector (`.env` format):

```
NETLIFY_SITE_ID=your-site-id
```

## Claims (Verified Facts)

See `CLAUDE.md` for the complete list of verified claims that Claude must respect:

- `NO_LOCALHOST` - localhost not accessible
- `HTTP_MCP_ONLY` - stdio MCP not supported
- `SESSION_START_HOOK` - scripts auto-run on session start
- `ENV_CONFIGURABLE` - environment variables can be set in UI
- `GIT_IS_PERSISTENCE` - only Git commits persist between sessions

## License

MIT

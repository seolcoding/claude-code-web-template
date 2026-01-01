#!/bin/bash

# =============================================================================
# SessionStart Hook Script
# Runs automatically when a new Claude Code session starts
# =============================================================================

set -e

echo "🚀 Claude Code Web Template - Session Setup"
echo "============================================="

# -----------------------------------------------------------------------------
# 1. Check if running in remote (web) environment
# -----------------------------------------------------------------------------
if [ "$CLAUDE_CODE_REMOTE" = "true" ]; then
    echo "📡 Running in web Claude Code environment"
else
    echo "💻 Running in local CLI environment"
fi

# -----------------------------------------------------------------------------
# 2. Install dependencies if package.json exists and has dependencies
# -----------------------------------------------------------------------------
if [ -f "package.json" ]; then
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing npm dependencies..."
        npm install --silent
    else
        echo "✅ npm dependencies already installed"
    fi
fi

# -----------------------------------------------------------------------------
# 3. Validate environment variables
# -----------------------------------------------------------------------------
echo ""
echo "🔍 Checking environment variables..."

MISSING_VARS=()

# Check required variables
if [ -z "$NETLIFY_SITE_ID" ]; then
    MISSING_VARS+=("NETLIFY_SITE_ID")
fi

# Report missing variables
if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo ""
    echo "⚠️  Missing environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "📋 To set these variables:"
    echo "   1. Go to claude.ai/code"
    echo "   2. Click on environment selector"
    echo "   3. Select 'Add environment' or edit existing"
    echo "   4. Add variables in .env format"
    echo ""
else
    echo "✅ All required environment variables are set"
fi

# -----------------------------------------------------------------------------
# 4. Install default plugins (first session only)
# -----------------------------------------------------------------------------
PLUGINS_MARKER=".claude/.plugins_installed"

if [ ! -f "$PLUGINS_MARKER" ]; then
    echo ""
    echo "🔌 Installing default plugins (first session)..."

    # Install claude-plugins-official
    echo "   📦 Installing claude-plugins-official..."
    if claude plugin add anthropics/claude-plugins-official 2>/dev/null; then
        echo "   ✅ claude-plugins-official installed"
    else
        echo "   ⚠️  claude-plugins-official: install manually with 'claude plugin add anthropics/claude-plugins-official'"
    fi

    # Install SuperClaude Framework
    echo "   📦 Installing SuperClaude Framework..."
    if claude plugin add SuperClaude-Org/SuperClaude_Framework 2>/dev/null; then
        echo "   ✅ SuperClaude Framework installed"
    else
        echo "   ⚠️  SuperClaude: install manually with 'claude plugin add SuperClaude-Org/SuperClaude_Framework'"
    fi

    # Create marker file
    mkdir -p .claude
    echo "installed=$(date -Iseconds)" > "$PLUGINS_MARKER"
    echo ""
    echo "💡 To remove default plugins:"
    echo "   claude plugin remove anthropics/claude-plugins-official"
    echo "   claude plugin remove SuperClaude-Org/SuperClaude_Framework"
    echo ""
else
    echo ""
    echo "✅ Default plugins already installed"
fi

# -----------------------------------------------------------------------------
# 5. Persist environment variables for subsequent commands
# -----------------------------------------------------------------------------
if [ -n "$CLAUDE_ENV_FILE" ]; then
    echo ""
    echo "📝 Persisting environment variables..."

    # Write to CLAUDE_ENV_FILE for persistence
    cat >> "$CLAUDE_ENV_FILE" << 'EOF'
# Persisted by setup.sh
export TEMPLATE_INITIALIZED=true
EOF
fi

# -----------------------------------------------------------------------------
# 6. MCP OAuth reminder
# -----------------------------------------------------------------------------
echo ""
echo "🔐 MCP Authentication Reminder:"
echo "   Run /mcp to authenticate with:"
echo "   - GitHub (for repository access)"
echo "   - Figma (for design integration)"
echo "   - Notion (for documentation)"
echo "   - Netlify (for deployment)"
echo ""

# -----------------------------------------------------------------------------
# 7. Display session info
# -----------------------------------------------------------------------------
echo "============================================="
echo "✅ Session setup complete!"
echo ""
echo "Available commands:"
echo "   /init-project <framework>  - Initialize project"
echo "   /preview                   - Get Netlify preview URL"
echo "   /check-env                 - Validate environment"
echo "   /add-integration           - Add MCP/Skill"
echo "============================================="

exit 0

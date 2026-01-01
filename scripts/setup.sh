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

    # Install claude-plugins-official (Claude plugin system)
    echo "   📦 Installing claude-plugins-official..."
    if claude plugin add anthropics/claude-plugins-official 2>/dev/null; then
        echo "   ✅ claude-plugins-official installed"
    else
        echo "   ⚠️  claude-plugins-official: install manually with 'claude plugin add anthropics/claude-plugins-official'"
    fi

    # Install SuperClaude Framework (pipx + superclaude install)
    echo "   📦 Installing SuperClaude Framework..."
    if command -v pipx &> /dev/null; then
        if pipx install superclaude 2>/dev/null && superclaude install 2>/dev/null; then
            echo "   ✅ SuperClaude Framework installed (30 slash commands)"
        else
            echo "   ⚠️  SuperClaude: install manually with 'pipx install superclaude && superclaude install'"
        fi
    else
        # Try with pip if pipx not available
        if pip install --user superclaude 2>/dev/null && superclaude install 2>/dev/null; then
            echo "   ✅ SuperClaude Framework installed (30 slash commands)"
        else
            echo "   ⚠️  SuperClaude: install pipx first, then 'pipx install superclaude && superclaude install'"
        fi
    fi

    # Create marker file
    mkdir -p .claude
    echo "installed=$(date -Iseconds)" > "$PLUGINS_MARKER"
    echo ""
    echo "💡 To remove default plugins:"
    echo "   claude plugin remove anthropics/claude-plugins-official"
    echo "   pipx uninstall superclaude"
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
# 7. Run verification and write status log
# -----------------------------------------------------------------------------
echo ""
echo "🔍 Running verification tests..."

STATUS_LOG=".claude/session-status.log"
mkdir -p .claude

# Write header
cat > "$STATUS_LOG" << EOF
# Claude Code Web Template - Session Status
# Generated: $(date -Iseconds)
# Environment: ${CLAUDE_CODE_REMOTE:-local}

## Quick Status
EOF

# Run verification and capture output
if [ -f "scripts/verify-setup.ts" ] && command -v npx &> /dev/null; then
    VERIFY_OUTPUT=$(npx tsx scripts/verify-setup.ts 2>&1)

    # Extract summary
    PASSED=$(echo "$VERIFY_OUTPUT" | grep -o '[0-9]* passed' | head -1 || echo "? passed")
    WARNED=$(echo "$VERIFY_OUTPUT" | grep -o '[0-9]* warnings' | head -1 || echo "? warnings")
    FAILED=$(echo "$VERIFY_OUTPUT" | grep -o '[0-9]* failed' | head -1 || echo "? failed")

    echo "- Tests: $PASSED, $WARNED, $FAILED" >> "$STATUS_LOG"

    # Extract working features
    echo "" >> "$STATUS_LOG"
    echo "## Working Features (✅)" >> "$STATUS_LOG"
    echo "$VERIFY_OUTPUT" | grep "^✅" | sed 's/^/- /' >> "$STATUS_LOG"

    # Extract issues with their messages
    echo "" >> "$STATUS_LOG"
    echo "## Needs Attention (⚠️/❌)" >> "$STATUS_LOG"
    echo "$VERIFY_OUTPUT" | grep -A1 -E "^(⚠️|❌)" | grep -v "^--$" | while read line; do
        if [[ "$line" == ⚠️* ]] || [[ "$line" == ❌* ]]; then
            echo "" >> "$STATUS_LOG"
            echo "### $line" >> "$STATUS_LOG"
        elif [[ -n "$line" ]]; then
            echo "$line" >> "$STATUS_LOG"
        fi
    done

    # Extract context and fixes if available
    if echo "$VERIFY_OUTPUT" | grep -q "📋 Context:"; then
        echo "" >> "$STATUS_LOG"
        echo "## Additional Context" >> "$STATUS_LOG"
        echo "$VERIFY_OUTPUT" | grep "📋 Context:" | sed 's/.*📋 Context: /- /' >> "$STATUS_LOG"
    fi

    if echo "$VERIFY_OUTPUT" | grep -q "🔧 Fix:"; then
        echo "" >> "$STATUS_LOG"
        echo "## Suggested Fixes" >> "$STATUS_LOG"
        echo "$VERIFY_OUTPUT" | grep "🔧 Fix:" | sed 's/.*🔧 Fix: /- /' >> "$STATUS_LOG"
    fi

    # Show summary to user
    echo "   $PASSED, $WARNED, $FAILED"
    echo "   📝 Full status written to: $STATUS_LOG"
else
    echo "⚠️ Verification script not available" >> "$STATUS_LOG"
    echo "   ⚠️ Verification script not available"
fi

# -----------------------------------------------------------------------------
# 8. Display session info
# -----------------------------------------------------------------------------
echo ""
echo "============================================="
echo "✅ Session setup complete!"
echo ""
echo "📋 Read .claude/session-status.log for detailed status"
echo ""
echo "Available commands:"
echo "   /init-project <framework>  - Initialize project"
echo "   /preview                   - Get Netlify preview URL"
echo "   /check-env                 - Validate environment"
echo "   /add-integration           - Add MCP/Skill"
echo "   /verify                    - Re-run verification"
echo "============================================="

exit 0

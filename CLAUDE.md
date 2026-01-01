# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## ⚠️ FIRST ACTION: 세션 상태 확인

**세션 시작 시 반드시 `.claude/session-status.log` 파일을 읽어라.**

이 파일은 SessionStart 훅이 자동 생성하며, 현재 세션에서:
- ✅ 어떤 기능이 동작하는지
- ⚠️ 어떤 기능에 문제가 있는지
- 🔧 어떻게 해결하는지

가 기록되어 있다. 이 정보를 바탕으로 유저에게 현재 상태를 알려주고, 필요한 조치를 안내하라.

```bash
# 세션 시작 시 항상 실행
cat .claude/session-status.log
```

만약 파일이 없으면 `/verify` 명령으로 상태를 확인하라.

---

## CRITICAL CLAIMS (이 사실들을 항상 기억하라)

이 섹션의 Claims는 검증된 사실입니다. 모든 작업에서 이 제약사항을 준수해야 합니다.

### 환경 제약 (Verified)

| Claim ID | 사실 | 근거 |
|----------|------|------|
| `NO_LOCALHOST` | localhost:* 접근 불가. dev server 실행해도 외부에서 볼 수 없음 | 공식 문서: 격리된 VM |
| `HTTP_MCP_ONLY` | stdio MCP 불가. npx로 로컬 프로세스 실행하는 MCP 작동 안함 | 샌드박스 제한 |
| `GITHUB_ONLY` | GitLab 등 비-GitHub 저장소는 클라우드 세션 불가 | 공식 문서 명시 |
| `SESSION_EPHEMERAL` | 세션 종료 시 상태 소멸. Git commit만이 영속성 보장 | 격리된 VM 특성 |

### 환경 설정 (Verified)

| Claim ID | 사실 | 근거 |
|----------|------|------|
| `ENV_CONFIGURABLE` | 환경 선택기에서 .env 형식으로 환경변수 설정 가능 | 공식 문서 |
| `SESSION_START_HOOK` | SessionStart 훅으로 스크립트 자동 실행 가능 | 공식 문서 |
| `REMOTE_CHECK` | `$CLAUDE_CODE_REMOTE=true`로 원격/로컬 구분 가능 | 공식 문서 |
| `ENV_FILE_PERSIST` | `$CLAUDE_ENV_FILE`에 작성하면 후속 명령에서 환경변수 유지 | 공식 문서 |

### 네트워크 (Verified)

| Claim ID | 사실 | 근거 |
|----------|------|------|
| `NETWORK_ALLOWLIST` | 기본 허용 목록 도메인만 접근 가능 (npm, pypi, github 등) | 공식 문서 |
| `CUSTOM_NETWORK` | 환경 설정에서 네트워크 액세스 수준 변경 가능 | 공식 문서 |
| `PROXY_REQUIRED` | 모든 HTTP/HTTPS 트래픽은 보안 프록시 통과 | 공식 문서 |

### 워크플로우 규칙

| Claim ID | 사실 |
|----------|------|
| `GIT_IS_PERSISTENCE` | 모든 변경사항은 Git commit → push로 영속화해야 함 |
| `SKILL_NEW_SESSION` | 스킬/MCP 변경 후 새 세션 필요 (/clear 또는 새 Task) |
| `NETLIFY_FOR_PREVIEW` | 시각적 확인은 Netlify/Vercel 프리뷰 URL로만 가능 |
| `PR_AUTO_PREVIEW` | PR 생성 시 Netlify가 프리뷰 URL 자동 생성 |

### 유저 책임 (Claude가 할 수 없는 것)

| 항목 | 이유 |
|------|------|
| GitHub 저장소 연결 | OAuth 팝업 승인 필요 |
| 환경 선택기에서 환경변수 설정 | 웹 UI 조작 필요 |
| MCP OAuth 인증 (/mcp) | 브라우저 팝업 승인 필요 |
| Netlify 연결 | 외부 서비스 설정 필요 |
| 시각적 UI 확인 | 스크린샷 도구 없음 |

---

## 세션 워크플로우

### 첫 번째 세션 (Bootstrap)

```
1. 유저: 템플릿 fork → claude.ai/code 연결
2. 유저: 환경 선택기에서 환경변수 설정
3. Claude: SessionStart 훅 자동 실행 → 종속성 설치
4. Claude: /mcp로 OAuth 인증 안내
5. Claude: 필요한 스킬/MCP 설정 확인
6. Claude: Git commit → push
7. 세션 종료
```

### 두 번째 세션 이후 (Development)

```
1. 새 세션 시작 → SessionStart 훅 실행 → 스킬/MCP 자동 로드
2. /mcp로 OAuth 인증 (필요시)
3. 실제 개발 작업
4. PR 생성 → Netlify 프리뷰로 확인
5. WebFetch로 프리뷰 URL 검증
6. 완료 시 merge
```

---

## User Setup Required (Claude Cannot Do These)

### 1. GitHub Setup
- [ ] Fork this template to your GitHub account
- [ ] Connect repository to claude.ai/code

### 2. Netlify Setup (Required for Preview)
- [ ] Create Netlify account at https://netlify.com
- [ ] Connect GitHub repository to Netlify
- [ ] Enable "Deploy Previews" for pull requests

### 3. Environment Variables (in Web UI)
환경 선택기 → "환경 추가" → 다음 형식으로 입력:

```
NETLIFY_SITE_ID=your-site-id
```

### 4. OAuth Authentication (In Claude Code)
세션 시작 후 `/mcp` 명령으로 인증:
- GitHub MCP: OAuth flow
- Figma MCP: OAuth flow
- Notion MCP: OAuth flow

---

## Architecture

```
├── src/                        # Application source
├── .claude/
│   ├── settings.json           # Hooks, permissions
│   ├── commands/               # Slash commands
│   └── skills/                 # Custom skills
├── .mcp.json                   # HTTP MCP servers
├── scripts/
│   ├── setup.sh                # SessionStart script
│   ├── check-env.ts            # Environment validation
│   └── data/
│       └── integrations.json   # MCP/Skill registry
├── netlify.toml                # Auto preview deployment
└── package.json
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/init-project <framework>` | Initialize with React/Vue/Svelte/Next.js/Astro |
| `/preview` | Get current Netlify preview URL |
| `/check-env` | Validate environment variables |
| `/add-integration` | Add MCP/Skill/Plugin interactively |

---

## Default MCP Servers (HTTP Only)

```json
{
  "github": "https://api.githubcopilot.com/mcp",
  "figma": "https://mcp.figma.com/mcp",
  "netlify": "https://netlify-mcp.netlify.app/mcp",
  "notion": "https://mcp.notion.com/sse"
}
```

Open (인증 불필요):
- `exa-search`: https://mcp.exa.ai/mcp
- `aws-docs`: https://knowledge-mcp.global.api.aws
- `huggingface`: https://hf.co/mcp

---

## Preview Verification

1. PR 생성 → Netlify 자동 배포
2. 프리뷰 URL: `https://deploy-preview-{PR#}--{site}.netlify.app`
3. Claude가 WebFetch로 HTML 확인 가능
4. 시각적 확인은 유저가 직접 수행

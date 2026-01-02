# Template Test Suite

템플릿의 모든 기능을 테스트합니다.

## Test Categories

### 1. File Structure Tests
- [ ] CLAUDE.md 존재 확인
- [ ] .mcp.json 존재 및 유효성
- [ ] .claude/settings.json 훅 설정
- [ ] netlify.toml 존재
- [ ] scripts/setup.sh 존재
- [ ] docs/CLAIMS.md 존재
- [ ] docs/TROUBLESHOOTING.md 존재

### 2. Package Manager Tests
- [ ] bun 설치 확인 (`which bun`)
- [ ] bun install 동작 확인
- [ ] package.json scripts가 bun 사용 확인

### 3. SessionStart Hook Tests
- [ ] setup.sh 실행 가능 확인
- [ ] 패키지 매니저 감지 로직 테스트
- [ ] 플러그인 마커 파일 생성 확인
- [ ] session-status.log 생성 확인

### 4. MCP Configuration Tests
- [ ] .mcp.json 파싱 가능
- [ ] HTTP MCP 서버만 포함 (stdio 없음)
- [ ] OAuth 서버 목록 확인 (github, figma, netlify, notion)
- [ ] Open 서버 목록 확인 (exa-search, aws-docs, huggingface)

### 5. Claims Tests
- [ ] CLAUDE.md에 CRITICAL CLAIMS 섹션 존재
- [ ] NO_LOCALHOST 클레임 존재
- [ ] HTTP_MCP_ONLY 클레임 존재
- [ ] SESSION_EPHEMERAL 클레임 존재
- [ ] GIT_IS_PERSISTENCE 클레임 존재

### 6. Custom Commands Tests
- [ ] /init-project 커맨드 존재
- [ ] /preview 커맨드 존재
- [ ] /check-env 커맨드 존재
- [ ] /verify 커맨드 존재

### 7. Verify Script Tests
- [ ] verify-setup.ts 실행 가능
- [ ] 테스트 결과 JSON 출력 확인
- [ ] pass/warn/fail 카운트 정상

### 8. Environment Tests
- [ ] CLAUDE_CODE_REMOTE 감지 확인
- [ ] NETLIFY_SITE_ID 체크 로직 확인
- [ ] .env.example 존재 및 내용 확인

## Execution

```bash
# Run all tests
bun run scripts/verify-setup.ts

# Check specific components
cat .claude/session-status.log
cat .mcp.json | jq .
```

## Expected Results

모든 테스트가 통과하면:
- verify-setup.ts: 0 failed, N warnings (환경변수 미설정 관련)
- session-status.log: 생성됨
- .claude/.plugins_installed: 첫 세션 후 생성됨

## Report

테스트 완료 후 결과를 여기에 기록:

```
Date:
Environment: local / web
Results:
  - File Structure: PASS / FAIL
  - Package Manager: PASS / FAIL
  - SessionStart Hook: PASS / FAIL
  - MCP Configuration: PASS / FAIL
  - Claims: PASS / FAIL
  - Custom Commands: PASS / FAIL
  - Verify Script: PASS / FAIL
  - Environment: PASS / FAIL

Notes:
```

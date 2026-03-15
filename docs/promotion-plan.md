# Promotion Plan for Stars

This plan optimizes for early proof and compounding discovery, not one-time traffic spikes.

## Positioning

One-line pitch:

> `envdrift` catches `.env.example` drift before your teammates hit runtime errors.

Angle:
- not another generic lint tool
- a CI guardrail for onboarding and release safety

## Launch Checklist (Day 0)

1. Ensure repository basics:
   - clear README with problem-first intro
   - MIT license
   - CI badge + passing tests
   - topics: `dotenv`, `env`, `cli`, `devex`, `github-actions`
2. Publish first release: `v0.1.0`
3. Add screenshot or terminal GIF to README (20-40 seconds)
4. Add two copy-ready snippets:
   - GitHub Actions usage
   - local pre-push usage

## Channel Strategy

## 1) GitHub-native distribution (highest conversion)

- Submit PRs to 5-10 active repos that recently had env-related issues:
  - add `envdrift` check in CI
  - include short explanation in PR body
- Open a Discussion in your own repo asking for language-pattern support feedback.
- Add to curated lists where possible:
  - awesome-cli
  - awesome-nodejs
  - devops-tooling lists

Why: stars from maintainers/contributors who directly use the tool are sticky.

## 2) Developer communities (mid/high reach)

- Hacker News (`Show HN`): post once with concrete incident story.
- Reddit:
  - `r/node`
  - `r/javascript`
  - `r/devops`
- Dev.to article: focus on the failure mode + CI fix.

Rule: each post should include one real failing example and one 30-second fix.

## 3) Chinese communities (high fit for your network)

- 掘金: 实战文章（标题聚焦“避免团队配置踩坑”）
- V2EX: 工具发布 + 场景介绍
- 小红书/公众号（如你已有账号）: 用短图文展示“问题->命令->结果”

## 7-Day Execution Rhythm

Day 1:
- Publish repo + release
- Post on X/LinkedIn

Day 2:
- Show HN + Reddit one community

Day 3:
- Publish 掘金文章

Day 4:
- Open 2 integration PRs to external repos

Day 5:
- Open remaining 3-5 integration PRs

Day 6:
- Share “adoption update” with screenshots

Day 7:
- Ship `v0.1.1` from feedback and repost changelog

## Copy Templates

## English short post (X / LinkedIn)

```text
I built envdrift: a tiny CLI that catches env var drift between source code and .env.example.

It finds:
- vars used in code but missing in .env.example
- stale vars left in .env.example

Great for CI and onboarding.

Repo: https://github.com/<your-username>/envdrift
```

## Hacker News title ideas

- Show HN: envdrift - catch .env.example drift in CI
- Show HN: a tiny CLI to prevent missing env vars at runtime

## 中文发布文案（掘金 / V2EX）

```text
做了一个单功能开源工具 envdrift：
用于检查“代码里使用的环境变量”与“.env.example 文档”是否漂移。

它会直接指出：
1) 代码里用了但 .env.example 没写的变量
2) .env.example 里还留着但代码已经不用的变量

适合放到 CI 里做 fail-fast，减少同事拉项目后的配置踩坑。

项目地址：https://github.com/<your-username>/envdrift
```

## Metrics to Track

- stars/day
- unique cloners/week
- issue/PR conversion (feedback quality)
- number of external repos adopting `envdrift` in CI

Decision rule after 2 weeks:
- if adoption PRs > stars from social posts, prioritize integration PR strategy
- if social posts outperform, invest in demo video + tutorials

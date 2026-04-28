---
name: generate-changelog
description: Generate user-facing changelogs from git commits. Use when preparing releases, creating release notes, or documenting changes for users. Trigger on release preparation, version bumps, or when user asks for changelog.
---

# Changelog Generator

Transform technical git commits into polished, user-friendly changelogs.

## When to Use

- Preparing release notes for a new version
- Creating weekly or monthly product update summaries
- Documenting changes for customers
- Writing changelog entries for app store submissions
- Generating update notifications

## What It Does

1. **Scans Git History** — Analyzes commits from a specific time period or between versions
2. **Categorizes Changes** — Groups into features, improvements, bug fixes, breaking changes, security
3. **Translates Technical → User-Friendly** — Converts developer commits into customer language
4. **Filters Noise** — Excludes internal commits (refactoring, tests, etc.)
5. **Formats Professionally** — Creates clean, structured changelog entries

## Categories

- ✨ **New Features** — New capabilities
- 🔧 **Improvements** — Enhancements to existing features
- 🐛 **Fixes** — Bug fixes
- ⚠️ **Breaking Changes** — Changes that require user action
- 🔒 **Security** — Security-related changes

## Input

- Git commit range (tags, dates, or SHAs)
- Optional: CHANGELOG_STYLE.md for custom formatting
- Optional: Previous changelog for continuity

## Output

Structured markdown changelog following Keep a Changelog conventions.

## Guidelines

- Focus on user impact, not implementation details
- Group related changes
- Credit contributors when possible
- Link to issues/PRs when available
- Keep entries concise but informative

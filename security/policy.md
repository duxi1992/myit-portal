# Security Policy

This file is protected by CODEOWNERS. Changes require CYS approval.

## Approved model list

AI models approved for use in this repository:

| Model | Provider | Use case | Approval status |
|---|---|---|---|
| claude-sonnet-4-6 | Anthropic / Accenture | Catalog item generation, test generation | Approved — CYS-2026-0047 |
| claude-haiku-4-5 | Anthropic / Accenture | Schema validation, quick checks | Approved — CYS-2026-0047 |

## Change boundaries

AI agents operating in this repository are permitted to:
- Add and update entries in `src/catalog/items.json`
- Create and update test files in `tests/catalog/`
- Update `CHANGELOG.md`

AI agents are NOT permitted to:
- Modify `index.html` or any frontend assets
- Modify `security/` (this directory)
- Modify CI/CD workflows
- Modify `src/core/` infrastructure
- Create GitHub Actions workflows
- Modify `CODEOWNERS`

## Security review contacts

- CYS Security: @siemens-it/cys-security
- Platform Team: @siemens-it/platform-team

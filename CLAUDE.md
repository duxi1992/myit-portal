# myIT Service Portal — Agent Guidelines

## What this repository is

A catalog of IT services for the Siemens myIT portal. Employees use it to request
hardware, software, network access, and other IT services.

## Guardrails — what agents may and may not change

### ✅ You MAY change
| Path | What lives here |
|---|---|
| `src/catalog/items.json` | All catalog item data (add, update, reorder entries) |
| `src/catalog/*.js` | Catalog-specific business logic (validation, enrichment) |
| `tests/catalog/` | Tests for catalog items and validation logic |

### ❌ You may NOT change
| Path | Why |
|---|---|
| `src/core/` | Core portal infrastructure — change only via architecture review |
| `index.html` | Frontend — UI changes require UX review |
| `security/` | Security policies — requires CYS approval; protected by CODEOWNERS |
| `.github/workflows/` | CI/CD pipelines — change only via platform team |
| `infra/` | Infrastructure as code — change only via infrastructure team |

Attempting to edit a protected file is a policy violation. Stop and raise a work note
in ServiceNow instead.

## Catalog item schema

Every entry in `src/catalog/items.json` must have these fields:

```json
{
  "id":          "SVC-XXX",        // Next sequential ID
  "title":       "...",            // Short, clear name (≤ 50 chars)
  "category":    "...",            // One of: Hardware, Software, Network & Security, HR & Access, Operations
  "description": "...",            // What the service delivers (≤ 200 chars)
  "owner":       "...",            // Team name (matches ServiceNow assignment group)
  "sla":         "N business days",
  "icon":        "🔧",             // Relevant emoji
  "status":      "active",        // active | deprecated | draft
  "tags":        ["...", "..."]    // 2–4 lowercase keywords
}
```

## Definition of done for a new catalog item

1. Entry added to `src/catalog/items.json` with all required fields
2. Validation test added in `tests/catalog/test_<id>.js`
3. Test covers: required fields present, SLA format valid, category valid
4. `CHANGELOG.md` updated with the new item ID and title
5. ServiceNow work note posted with the PR link

## Testing

```bash
npm test          # runs tests/catalog/ via Node test runner
```

Tests must pass before merging. The CI pipeline (`ci.yml`) runs them automatically
on every pull request.

## Instance Scan / Security Review

Every PR that adds or modifies a catalog item triggers the automated security scan
(`.github/workflows/ci.yml`). The scan checks:

- No PII in catalog descriptions
- SLA values are in the approved range (1–30 business days)
- Categories are from the approved list
- No duplicate IDs

The scan result appears as a PR comment. A scan score below 80% blocks the merge.

## Commit style

```
feat(catalog): add SVC-005 Warranty Status Widget
fix(catalog): correct SLA for SVC-002 VPN Access
test(catalog): add schema test for SVC-005
```

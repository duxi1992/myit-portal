# myIT Service Portal

A simple IT service catalog portal for the Siemens myIT platform.
Agents may add and update catalog items in `src/catalog/` — see `CLAUDE.md` for guardrails.

**Live portal:** https://duxi1992.github.io/myit-portal/

## Catalog items

| ID | Title | Category | SLA |
|---|---|---|---|
| SVC-001 | Laptop Provisioning | Hardware | 5 business days |
| SVC-002 | VPN Access | Network & Security | 1 business day |
| SVC-003 | Software License Request | Software | 3 business days |
| SVC-004 | New Employee Onboarding | HR & Access | 2 business days |

## Adding a catalog item (agents)

1. Add an entry to `src/catalog/items.json` (follow the schema in `CLAUDE.md`)
2. Add a test in `tests/catalog/test_<id>.js`
3. Update `CHANGELOG.md`
4. Open a pull request — CI runs schema tests + security scan automatically

## Running tests locally

```bash
npm test
```

## Security scan

```bash
node scripts/security-scan.js
```

## Protected paths

See `CLAUDE.md` for the full guardrails. In short:
- ✅ `src/catalog/` and `tests/catalog/` — agents may change these
- ❌ Everything else — requires human review or CYS approval

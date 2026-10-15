#!/usr/bin/env node
// Catalog security scan — checks items.json for policy compliance
// Outputs scan-result.json for the CI PR comment step

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const items = JSON.parse(
  readFileSync(join(__dirname, '../src/catalog/items.json'), 'utf-8')
);

const VALID_CATEGORIES = [
  'Hardware', 'Software', 'Network & Security', 'HR & Access', 'Operations'
];
const PII_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/i;

const checks = [
  {
    name: 'No PII in catalog descriptions',
    run: () => {
      const hit = items.find(i => PII_PATTERN.test(i.description));
      return hit ? { passed: false, issue: `PII detected in ${hit.id}` } : { passed: true };
    }
  },
  {
    name: 'SLA values within approved range (1–30 days)',
    run: () => {
      const hit = items.find(i => {
        const d = parseInt(i.sla);
        return isNaN(d) || d < 1 || d > 30;
      });
      return hit ? { passed: false, issue: `${hit.id}: SLA "${hit.sla}" out of range` } : { passed: true };
    }
  },
  {
    name: 'Categories from approved list',
    run: () => {
      const hit = items.find(i => !VALID_CATEGORIES.includes(i.category));
      return hit ? { passed: false, issue: `${hit.id}: unapproved category "${hit.category}"` } : { passed: true };
    }
  },
  {
    name: 'No duplicate catalog IDs',
    run: () => {
      const ids = items.map(i => i.id);
      const dupe = ids.find((id, idx) => ids.indexOf(id) !== idx);
      return dupe ? { passed: false, issue: `Duplicate ID: ${dupe}` } : { passed: true };
    }
  },
  {
    name: 'All required fields present',
    run: () => {
      const required = ['id', 'title', 'category', 'description', 'owner', 'sla', 'icon', 'status'];
      const hit = items.find(i => required.some(f => !i[f]));
      return hit ? { passed: false, issue: `${hit.id}: missing required field` } : { passed: true };
    }
  },
  {
    name: 'Status values are valid',
    run: () => {
      const hit = items.find(i => !['active', 'deprecated', 'draft'].includes(i.status));
      return hit ? { passed: false, issue: `${hit.id}: invalid status "${hit.status}"` } : { passed: true };
    }
  }
];

const results = checks.map(c => ({ name: c.name, ...c.run() }));
const passed = results.filter(r => r.passed).length;
const score = Math.round((passed / results.length) * 100);

const output = { score, passed, total: results.length, checks: results };

writeFileSync('scan-result.json', JSON.stringify(output, null, 2));

console.log(`\nSecurity Scan Results`);
console.log(`━━━━━━━━━━━━━━━━━━━━━`);
results.forEach(r => {
  console.log(`${r.passed ? '✅' : '❌'} ${r.name}${r.issue ? ` → ${r.issue}` : ''}`);
});
console.log(`━━━━━━━━━━━━━━━━━━━━━`);
console.log(`Score: ${score}% (${passed}/${results.length} checks passed)`);

if (score < 80) {
  console.error(`\n❌ Scan FAILED — score ${score}% below 80% threshold`);
  process.exit(1);
} else {
  console.log(`\n✅ Scan PASSED`);
}

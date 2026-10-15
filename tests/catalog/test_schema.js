// Catalog schema validation tests
// Run: node --test tests/catalog/test_schema.js

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const items = JSON.parse(
  readFileSync(join(__dirname, '../../src/catalog/items.json'), 'utf-8')
);

const VALID_CATEGORIES = [
  'Hardware', 'Software', 'Network & Security', 'HR & Access', 'Operations'
];
const VALID_STATUSES = ['active', 'deprecated', 'draft'];
const SLA_PATTERN = /^\d{1,2} business day[s]?$/;

test('catalog items.json is a non-empty array', () => {
  assert.ok(Array.isArray(items), 'items.json must be an array');
  assert.ok(items.length > 0, 'catalog must have at least one item');
});

test('all items have required fields', () => {
  const required = ['id', 'title', 'category', 'description', 'owner', 'sla', 'icon', 'status', 'tags'];
  for (const item of items) {
    for (const field of required) {
      assert.ok(item[field] !== undefined, `${item.id ?? '?'}: missing field "${field}"`);
    }
  }
});

test('all IDs follow SVC-NNN format and are unique', () => {
  const seen = new Set();
  for (const item of items) {
    assert.match(item.id, /^SVC-\d{3}$/, `${item.id}: ID must match SVC-NNN`);
    assert.ok(!seen.has(item.id), `duplicate ID: ${item.id}`);
    seen.add(item.id);
  }
});

test('all categories are from the approved list', () => {
  for (const item of items) {
    assert.ok(
      VALID_CATEGORIES.includes(item.category),
      `${item.id}: invalid category "${item.category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`
    );
  }
});

test('all statuses are valid', () => {
  for (const item of items) {
    assert.ok(
      VALID_STATUSES.includes(item.status),
      `${item.id}: invalid status "${item.status}"`
    );
  }
});

test('SLA format is valid (N business days)', () => {
  for (const item of items) {
    assert.match(
      item.sla,
      SLA_PATTERN,
      `${item.id}: SLA "${item.sla}" must match "N business day(s)"`
    );
  }
});

test('SLA is within approved range (1–30 business days)', () => {
  for (const item of items) {
    const days = parseInt(item.sla);
    assert.ok(days >= 1 && days <= 30, `${item.id}: SLA ${days} days is outside approved range 1–30`);
  }
});

test('title is ≤ 50 characters', () => {
  for (const item of items) {
    assert.ok(item.title.length <= 50, `${item.id}: title too long (${item.title.length} chars)`);
  }
});

test('description is ≤ 200 characters', () => {
  for (const item of items) {
    assert.ok(
      item.description.length <= 200,
      `${item.id}: description too long (${item.description.length} chars)`
    );
  }
});

test('tags is an array with 2–4 entries', () => {
  for (const item of items) {
    assert.ok(Array.isArray(item.tags), `${item.id}: tags must be an array`);
    assert.ok(item.tags.length >= 2 && item.tags.length <= 4,
      `${item.id}: tags must have 2–4 entries (has ${item.tags.length})`);
  }
});

test('no PII patterns in descriptions', () => {
  const piiPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/i;
  for (const item of items) {
    assert.ok(
      !piiPattern.test(item.description),
      `${item.id}: possible PII detected in description`
    );
  }
});

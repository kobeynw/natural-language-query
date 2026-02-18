import fs from 'fs';
import path from 'path';
import config from '../config.js';

let _schemaCache = null;

export async function loadSchema() {
  if (_schemaCache) return _schemaCache;

  const schema = {};

  if (config.schemaSQLPath) {
    const fullPath = path.resolve(config.schemaSQLPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  Schema SQL file not found: ${fullPath} — skipping.`);
    } else {
      schema.sql = fs.readFileSync(fullPath, 'utf-8');
      console.error(`  Loaded SQL schema from ${config.schemaSQLPath}`);
    }
  }

  if (config.schemaImagePath) {
    const fullPath = path.resolve(config.schemaImagePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  Schema image not found: ${fullPath} — skipping vision input.`);
    } else {
      schema.imageBase64 = fs.readFileSync(fullPath).toString('base64');
      const ext = path.extname(fullPath).toLowerCase();
      schema.imageMimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
      console.error(`  Loaded schema image from ${config.schemaImagePath}`);
    }
  }

  if (!schema.sql && !schema.imageBase64) {
    console.warn(
      '⚠️  Warning: No schema loaded. ' +
        'Set schemaSQLPath and/or schemaImagePath in config.js for best results.'
    );
  }

  _schemaCache = schema;
  return schema;
}
const QuestionnaireSchema = require("../database/models/QuestionnaireSchema");

/**
 * In-process read-through cache. Refreshes whenever a new schema is activated.
 * Shape: { version: "2025-spring", schema: {...JSON-Schema...} }
 */
let cachedActiveSchema = null;

/**
 * Fetch the one active schema (DB-hit only the first time or after flush)
 */
async function getActiveSchema() {
  if (cachedActiveSchema) return cachedActiveSchema;

  const row = await QuestionnaireSchema.findOne({ where: { is_active: true } });
  if (!row) throw new Error("No active questionnaire schema in DB");

  cachedActiveSchema = { version: row.version, schema: row.schema_json };
  return cachedActiveSchema;
}

/**
 * Activate the given version, deactivate all others, and flush cache
 */
async function setActiveSchema(version) {
  await QuestionnaireSchema.update({ is_active: false }, { where: {} });
  const [affected] = await QuestionnaireSchema.update(
    { is_active: true },
    { where: { version } }
  );
  if (!affected) throw new Error(`Version "${version}" not found`);
  cachedActiveSchema = null; // force reload on next getActiveSchema()
}

module.exports = { getActiveSchema, setActiveSchema };
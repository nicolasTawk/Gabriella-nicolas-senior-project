const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const { getActiveSchema } = require("../services/questionnaire_schema_service");


const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv); // adds "email", "date", etc.

/**
 * Ensures req.body.answers complies with the active questionnaire schema.
 * Adds req.schemaVersion for the controller to persist.
 */
async function validateQuestionnaire(req, res, next) {
  try {
    const { version, schema } = await getActiveSchema();

    // Compile the schema once per schema version
    const validate = ajv.getSchema(version) || ajv.compile(schema, version);

    if (!validate(req.body.answers)) {
      return res.status(400).json({ error: "Invalid answers", details: validate.errors });
    }

    req.schemaVersion = version;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Schema validation failed" });
  }
};

module.exports = {validateQuestionnaire};
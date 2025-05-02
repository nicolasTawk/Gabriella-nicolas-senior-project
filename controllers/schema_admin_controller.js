const QuestionnaireSchema = require("../database/models/QuestionnaireSchema");
const { setActiveSchema } = require("../services/questionnaire_schema_service");

/** POST /api/admin/questionnaire/schema  (body: version, schema_json, activate?) */
const uploadSchema = async (req, res) => {
  const { version, schema_json, activate = false } = req.body;
  if (!version || !schema_json) {
    return res.status(400).json({ error: "version and schema_json are required" });
  }

  await QuestionnaireSchema.create({ version, schema_json, is_active: false });
  if (activate) await setActiveSchema(version);

  res.status(201).json({ message: "Schema stored", version, activated: !!activate });
};

/** PUT /api/admin/questionnaire/schema/:version/activate */
const activateSchema = async (req, res) => {
  await setActiveSchema(req.params.version);
  res.json({ message: "Activated", version: req.params.version });
};

module.exports = { uploadSchema, activateSchema };
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

const getSchema = async (req, res) => {
  const { version } = req.params;

  try {
    let schemaRecord;

    if (version) {
      // fetch specific version
      schemaRecord = await QuestionnaireSchema.findOne({
        where: { version },
      });
      if (!schemaRecord) {
        return res
          .status(404)
          .json({ error: `Schema version ${version} not found` });
      }
    } else {
      // fetch currently active
      schemaRecord = await QuestionnaireSchema.findOne({
        where: { is_active: true },
        order: [["updatedAt", "DESC"]],
      });
      if (!schemaRecord) {
        return res.status(404).json({ error: "No active schema found" });
      }
    }

    res.json({
      version: schemaRecord.version,
      schema_json: schemaRecord.schema_json,
      is_active: schemaRecord.is_active,
    });
  } catch (err) {
    console.error("Error fetching schema:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { uploadSchema, activateSchema, getSchema };
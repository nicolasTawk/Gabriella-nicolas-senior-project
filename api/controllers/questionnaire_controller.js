const { QuestionnaireResponse } = require("../database/models");
const { recommendMajors }       = require("../services/ai_recommender");

/**
 * POST /api/user/questionnaire/submit
 * Body: { answers: { ... } }
 * Auth: student JWT
 */
const submitQuestionnaire = async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ error: "Only students can submit questionnaires" });
  }

  const answers = req.body.answers;
  try {
    /* 1 ─ AI call */
    const { majors, prompt } = await recommendMajors(answers);

    /* 2 ─ Persist */
    await QuestionnaireResponse.create({
      user_id:           req.user.id,
      answers_json:      answers,
      schema_version:    req.schemaVersion,   // set by validator middleware
      recommended_majors: majors,
      research_context:  prompt
    });
    
    /* 3 ─ Client response */
    res.status(201).json({ majors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate recommendations" });
  }
};

module.exports = { submitQuestionnaire };
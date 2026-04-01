const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { protect } = require("../middleware/auth");
const { generateContent, parseJSON } = require("../config/gemini");
const Analysis = require("../models/analysis");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ── POST /api/ai/analyze-resume ───────────────────────────────
router.post("/analyze-resume", protect, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Please upload a PDF resume" });

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50)
      return res.status(400).json({ message: "Could not extract text from PDF" });

    const prompt = `
You are an expert ATS (Applicant Tracking System) and career coach.
Analyze the following resume and return a JSON object with EXACTLY this structure:
{
  "ats_score": <number between 0-100>,
  "overall_summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "missing_keywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
  "suggestions": [
    {"section": "<section name>", "suggestion": "<specific improvement>"},
    {"section": "<section name>", "suggestion": "<specific improvement>"},
    {"section": "<section name>", "suggestion": "<specific improvement>"}
  ],
  "section_scores": {
    "contact_info": <0-100>,
    "summary": <0-100>,
    "experience": <0-100>,
    "education": <0-100>,
    "skills": <0-100>
  }
}
Return ONLY the JSON object, no markdown, no extra text.

Resume:
${resumeText}
    `;

    const rawResponse = await generateContent(prompt);
    const result = parseJSON(rawResponse);

    // Save to MongoDB
    const analysis = await Analysis.create({
      user: req.user._id,
      type: "resume",
      input: { resumeText: resumeText.substring(0, 2000) },
      result,
    });

    res.json({ ...result, _id: analysis._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/ai/match-job ────────────────────────────────────
router.post("/match-job", protect, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription)
      return res.status(400).json({ message: "Please provide resume text and job description" });

    const prompt = `
You are an expert career coach and recruiter.
Compare the following resume against the job description and return a JSON object with EXACTLY this structure:
{
  "match_score": <number between 0-100>,
  "summary": "<2-3 sentence assessment of the match>",
  "matching_skills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "missing_skills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "matching_experience": ["<point 1>", "<point 2>"],
  "gaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"],
  "cover_letter_tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}
Return ONLY the JSON object, no markdown, no extra text.

Resume:
${resumeText}

Job Description:
${jobDescription}
    `;

    const rawResponse = await generateContent(prompt);
    const result = parseJSON(rawResponse);

    const analysis = await Analysis.create({
      user: req.user._id,
      type: "jobmatch",
      input: {
        resumeText: resumeText.substring(0, 2000),
        jobDescription: jobDescription.substring(0, 2000),
      },
      result,
    });

    res.json({ ...result, _id: analysis._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/ai/skill-gap ────────────────────────────────────
router.post("/skill-gap", protect, async (req, res) => {
  try {
    const { skills, targetRole, experienceLevel } = req.body;

    if (!skills || !targetRole)
      return res.status(400).json({ message: "Please provide your skills and target role" });

    const prompt = `
You are an expert career development coach.
Create a personalized skill gap analysis and learning roadmap for someone who wants to become a ${targetRole}.
Their current skills: ${skills}
Experience level: ${experienceLevel || "beginner"}

Return a JSON object with EXACTLY this structure:
{
  "target_role": "${targetRole}",
  "readiness_score": <number between 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "current_strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "skill_gaps": [
    {"skill": "<skill name>", "priority": "high/medium/low", "reason": "<why this matters>"},
    {"skill": "<skill name>", "priority": "high/medium/low", "reason": "<why this matters>"},
    {"skill": "<skill name>", "priority": "high/medium/low", "reason": "<why this matters>"}
  ],
  "roadmap": [
    {"week": "Week 1-2", "focus": "<focus area>", "tasks": ["<task 1>", "<task 2>"], "resources": ["<resource 1>"]},
    {"week": "Week 3-4", "focus": "<focus area>", "tasks": ["<task 1>", "<task 2>"], "resources": ["<resource 1>"]},
    {"week": "Week 5-6", "focus": "<focus area>", "tasks": ["<task 1>", "<task 2>"], "resources": ["<resource 1>"]},
    {"week": "Week 7-8", "focus": "<focus area>", "tasks": ["<task 1>", "<task 2>"], "resources": ["<resource 1>"]}
  ],
  "estimated_timeline": "<e.g. 3-6 months>",
  "job_ready_checklist": ["<item 1>", "<item 2>", "<item 3>", "<item 4>", "<item 5>"]
}
Return ONLY the JSON object, no markdown, no extra text.
    `;

    const rawResponse = await generateContent(prompt);
    const result = parseJSON(rawResponse);

    const analysis = await Analysis.create({
      user: req.user._id,
      type: "skillgap",
      input: { skills, targetRole, experienceLevel },
      result,
    });

    res.json({ ...result, _id: analysis._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/ai/interview-prep ───────────────────────────────
router.post("/interview-prep", protect, async (req, res) => {
  try {
    const { targetRole, experienceLevel, skills } = req.body;

    if (!targetRole)
      return res.status(400).json({ message: "Please provide the target role" });

    const prompt = `
You are an expert technical interviewer and career coach.
Generate interview preparation material for a ${targetRole} position.
Experience level: ${experienceLevel || "mid-level"}
Candidate skills: ${skills || "not specified"}

Return a JSON object with EXACTLY this structure:
{
  "role": "${targetRole}",
  "intro": "<2 sentence intro about what to expect>",
  "questions": [
    {
      "id": 1,
      "category": "behavioral/technical/situational",
      "question": "<interview question>",
      "tip": "<how to answer this question>",
      "sample_answer": "<a brief sample answer structure>"
    },
    {
      "id": 2,
      "category": "behavioral/technical/situational",
      "question": "<interview question>",
      "tip": "<how to answer this question>",
      "sample_answer": "<a brief sample answer structure>"
    },
    {
      "id": 3,
      "category": "behavioral/technical/situational",
      "question": "<interview question>",
      "tip": "<how to answer this question>",
      "sample_answer": "<a brief sample answer structure>"
    },
    {
      "id": 4,
      "category": "behavioral/technical/situational",
      "question": "<interview question>",
      "tip": "<how to answer this question>",
      "sample_answer": "<a brief sample answer structure>"
    },
    {
      "id": 5,
      "category": "behavioral/technical/situational",
      "question": "<interview question>",
      "tip": "<how to answer this question>",
      "sample_answer": "<a brief sample answer structure>"
    },
    {
      "id": 6,
      "category": "behavioral/technical/situational",
      "question": "<interview question>",
      "tip": "<how to answer this question>",
      "sample_answer": "<a brief sample answer structure>"
    },
    {
      "id": 7,
      "category": "behavioral/technical/situational",
      "question": "<interview question>",
      "tip": "<how to answer this question>",
      "sample_answer": "<a brief sample answer structure>"
    },
    {
      "id": 8,
      "category": "behavioral/technical/situational",
      "question": "<interview question>",
      "tip": "<how to answer this question>",
      "sample_answer": "<a brief sample answer structure>"
    },
    {
      "id": 9,
      "category": "behavioral/technical/situational",
      "question": "<interview question>",
      "tip": "<how to answer this question>",
      "sample_answer": "<a brief sample answer structure>"
    },
    {
      "id": 10,
      "category": "behavioral/technical/situational",
      "question": "<interview question>",
      "tip": "<how to answer this question>",
      "sample_answer": "<a brief sample answer structure>"
    }
  ],
  "general_tips": ["<tip 1>", "<tip 2>", "<tip 3>", "<tip 4>"],
  "questions_to_ask_interviewer": ["<question 1>", "<question 2>", "<question 3>"]
}
Return ONLY the JSON object, no markdown, no extra text.
    `;

    const rawResponse = await generateContent(prompt);
    const result = parseJSON(rawResponse);

    const analysis = await Analysis.create({
      user: req.user._id,
      type: "interview",
      input: { targetRole, experienceLevel, skills },
      result,
    });

    res.json({ ...result, _id: analysis._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
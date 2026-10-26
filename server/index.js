import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. Database Model
const resumeAnalysisSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  resumeText: { type: String, required: true },
  jobDescription: { type: String, required: true },
  atsScore: { type: Number, required: true },
  missingKeywords: [String],
  bulletImprovements: [{ original: String, improved: String, reason: String }],
  coverLetter: String,
  interviewHistory: [{ role: String, content: String, feedback: String }],
}, { timestamps: true });
const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);

// 2. AI Helper
async function callGemini(contents, config = {}) {
  const models = ["gemini-3.8-flash", "gemini-3.5-flash-lite"];
  for (const m of models) {
    try {
      return await ai.models.generateContent({ model: m, contents, config });
    } catch (e) { console.warn(`Model ${m} failed: ${e.message}`); }
  }
  throw new Error("All models failed.");
}

// 3. Routes
app.post("/api/analyze", async (req, res) => {
  try {
    const { jobTitle, resumeText, jobDescription } = req.body;
    const prompt = `Analyze resume vs job description. Return ATS score, missing keywords, 3 bullet rewrites, and a cover letter.\nRESUME:\n${resumeText}\nJOB:\n${jobDescription}`;
    
    const aiRes = await callGemini(prompt, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          atsScore: { type: Type.INTEGER },
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          bulletImprovements: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { original: { type: Type.STRING }, improved: { type: Type.STRING }, reason: { type: Type.STRING } }, required: ["original", "improved", "reason"] } },
          coverLetter: { type: Type.STRING },
        },
        required: ["atsScore", "missingKeywords", "bulletImprovements", "coverLetter"],
      },
    });
    
    const aiResult = JSON.parse(aiRes.text);
    const saved = await ResumeAnalysis.create({ jobTitle: jobTitle || "Role", resumeText, jobDescription, ...aiResult, interviewHistory: [] });
    res.json(saved);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/interview", async (req, res) => {
  try {
    const { analysisId, candidateAnswer } = req.body;
    const session = await ResumeAnalysis.findById(analysisId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    
    if (candidateAnswer) session.interviewHistory.push({ role: "candidate", content: candidateAnswer });
    
    const transcript = session.interviewHistory.map((h) => `${h.role.toUpperCase()}: ${h.content}`).join("\n");
    const prompt = `You are a hiring manager for this role:\n${session.jobDescription}\n\nCONVERSATION:\n${transcript}\n\nCANDIDATE ANSWER:\n${candidateAnswer || "(Ready)"}\n\nReturn feedback and next question.`;
    
    const aiRes = await callGemini(prompt, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { feedback: { type: Type.STRING }, nextQuestion: { type: Type.STRING } },
        required: ["feedback", "nextQuestion"],
      },
    });
    
    const turn = JSON.parse(aiRes.text);
    session.interviewHistory.push({ role: "interviewer", content: turn.nextQuestion, feedback: turn.feedback });
    await session.save();
    res.json(session);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. Start Server
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`🚀 CareerPulse Backend running on http://localhost:${port}`));
mongoose.connect(process.env.MONGODB_URI).then(() => console.log("✅ MongoDB connected")).catch(err => console.error("❌ DB error:", err.message));
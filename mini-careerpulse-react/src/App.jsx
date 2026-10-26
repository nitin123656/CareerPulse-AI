import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clipboard,
  FileText,
  Lightbulb,
  LoaderCircle,
  MessageCircle,
  MessageSquareText,
  Radar,
  Send,
  Sparkles,
  Target,
  WandSparkles,
} from "lucide-react";

const API_BASE = "http://localhost:5001/api";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [analysis?.interviewHistory?.length]);

  async function handleAnalyzeResume(e) {
    e.preventDefault();
    if (!resumeText || !jobDescription) return alert("Please paste both Resume and Job Description.");

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: "Software Engineer", resumeText, jobDescription }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");

      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleInterviewTurn(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: analysis._id, candidateAnswer: interviewAnswer }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Interview failed");

      setAnalysis(data);
      setInterviewAnswer("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const interviewHistory = analysis?.interviewHistory ?? [];
  const score = Number(analysis?.atsScore) || 0;
  const scorePercent = Math.min(100, Math.max(0, score));
  const circumference = 2 * Math.PI * 50;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080d12] text-slate-100 selection:bg-emerald-300/30">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 top-[-15rem] h-[38rem] w-[38rem] rounded-full bg-emerald-500/[0.08] blur-[130px]" />
        <div className="absolute -right-40 top-[22rem] h-[34rem] w-[34rem] rounded-full bg-cyan-500/[0.06] blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.11)_0.7px,transparent_0.7px)] [background-size:26px_26px] opacity-25" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between border-b border-white/[0.07] py-5">
          <a href="#" className="flex items-center gap-3" aria-label="CareerPulse AI home">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-400/[0.09] text-emerald-300 shadow-[0_0_26px_rgba(16,185,129,0.12)]">
              <Radar size={21} strokeWidth={1.8} />
            </span>
            <span>
              <span className="block text-[15px] font-semibold tracking-tight text-white">CareerPulse<span className="text-emerald-300"> AI</span></span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Career intelligence</span>
            </span>
          </a>

          <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs text-slate-400 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            Your next move starts here
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-slate-700 to-slate-900 text-xs font-semibold text-slate-300">
            CP
          </div>
        </header>

        <div className="grid gap-10 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14 lg:py-14">
          <aside className="hidden lg:block">
            <div className="sticky top-10">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">Workspace</p>
              <nav aria-label="Workspace sections" className="space-y-1.5">
                <a href="#analyzer" className="flex items-center gap-3 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.07] px-3.5 py-3 text-sm font-medium text-emerald-200">
                  <FileText size={17} /> Resume analyzer
                  <ChevronRight className="ml-auto" size={15} />
                </a>
                <a href="#results" className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition ${analysis ? "text-slate-400 hover:bg-white/[0.04] hover:text-white" : "pointer-events-none text-slate-700"}`}>
                  <Target size={17} /> Match insights
                </a>
                <a href="#interview" className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition ${analysis ? "text-slate-400 hover:bg-white/[0.04] hover:text-white" : "pointer-events-none text-slate-700"}`}>
                  <MessageCircle size={17} /> Mock interview
                </a>
              </nav>

              <div className="mt-12 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <span className="mb-3 grid h-8 w-8 place-items-center rounded-lg bg-violet-300/10 text-violet-300">
                  <Lightbulb size={16} />
                </span>
                <p className="text-xs font-medium text-slate-300">A little more signal.</p>
                <p className="mt-1.5 text-[11px] leading-5 text-slate-500">Tailor your experience to the role, while keeping your story authentically yours.</p>
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-9">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1.5 text-[11px] font-medium text-emerald-200">
                <Sparkles size={13} /> AI-powered career toolkit
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl lg:text-[3.6rem]">
                Make your next role
                <span className="block bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">feel within reach.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Turn your experience into a stronger application. Get a clear match signal, sharpen your story, and practice what comes next.
              </p>
            </motion.div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-sm text-rose-200">
                <CircleHelp className="mt-0.5 shrink-0" size={17} />
                <span>{error}</span>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {!analysis ? (
                <motion.form
                  key="analyzer"
                  id="analyzer"
                  onSubmit={handleAnalyzeResume}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-3xl border border-white/[0.09] bg-slate-900/65 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-7"
                >
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight text-white">Start with the essentials</h2>
                      <p className="mt-1 text-xs text-slate-500">Your information stays yours. Paste the content below to get started.</p>
                    </div>
                    <span className="hidden items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.025] px-2.5 py-1.5 text-[10px] text-slate-500 sm:flex">
                      <span className="text-emerald-300">01</span> / 02
                    </span>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-2">
                    <label className="group block">
                      <span className="mb-2.5 flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
                          <FileText size={16} className="text-emerald-300" /> Your resume
                        </span>
                        <span className="text-[10px] text-slate-600">Plain text works best</span>
                      </span>
                      <textarea
                        rows="11"
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder={"Paste your resume here...\n\nInclude your experience, skills, and achievements for the most useful feedback."}
                        className="min-h-[250px] w-full resize-y rounded-2xl border border-white/[0.08] bg-[#080d12]/80 px-4 py-4 text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-600 hover:border-white/[0.14] focus:border-emerald-300/40 focus:ring-4 focus:ring-emerald-300/[0.06]"
                      />
                    </label>

                    <label className="group block">
                      <span className="mb-2.5 flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
                          <BriefcaseBusiness size={16} className="text-cyan-300" /> Target job description
                        </span>
                        <span className="text-[10px] text-slate-600">Role &amp; requirements</span>
                      </span>
                      <textarea
                        rows="11"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder={"Paste the job description here...\n\nAdd the responsibilities, requirements, and skills the employer is looking for."}
                        className="min-h-[250px] w-full resize-y rounded-2xl border border-white/[0.08] bg-[#080d12]/80 px-4 py-4 text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-600 hover:border-white/[0.14] focus:border-cyan-300/40 focus:ring-4 focus:ring-cyan-300/[0.06]"
                      />
                    </label>
                  </div>

                  <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center">
                    <p className="flex items-center gap-2 text-[11px] text-slate-500">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      No formatting needed — just paste and go
                    </p>
                    <button type="submit" disabled={loading} className={`group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-[#06231d] shadow-[0_8px_28px_rgba(16,185,129,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(16,185,129,0.3)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto ${loading ? "animate-pulse" : ""}`}>
                      {loading ? <LoaderCircle className="animate-spin" size={17} /> : <WandSparkles size={17} />}
                      {loading ? "Analyzing your fit..." : "Analyze with Gemini"}
                      {!loading && <ArrowRight className="transition-transform group-hover:translate-x-0.5" size={16} />}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="results"
                  id="results"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Your match report</p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">The signal is in.</h2>
                    </div>
                    <button type="button" onClick={() => { setAnalysis(null); setError(""); }} className="inline-flex items-center gap-2 self-start rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-slate-400 transition hover:border-white/20 hover:text-white sm:self-auto">
                      Analyze another role <ArrowUpRight size={14} />
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(250px,0.78fr)_minmax(0,1.5fr)]">
                    <motion.section variants={fadeUp} initial="hidden" animate="visible" className="relative flex min-h-[240px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-emerald-300/[0.14] bg-gradient-to-br from-emerald-400/[0.1] via-slate-900/80 to-slate-900/80 p-6">
                      <div aria-hidden="true" className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-emerald-400/[0.12] blur-3xl" />
                      <div className="relative mb-3">
                        <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90" aria-label={`ATS match score ${score} out of 100`}>
                          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(148,163,184,0.13)" strokeWidth="7" />
                          <motion.circle
                            cx="60" cy="60" r="50" fill="none" stroke="url(#scoreGradient)" strokeWidth="7" strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: circumference * (1 - scorePercent / 100) }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                          <defs><linearGradient id="scoreGradient"><stop stopColor="#34d399" /><stop offset="1" stopColor="#2dd4bf" /></linearGradient></defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[2.6rem] font-semibold leading-none tracking-[-0.06em] text-white">{score}</span>
                          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">out of 100</span>
                        </div>
                      </div>
                      <p className="relative text-sm font-medium text-emerald-100">ATS match score</p>
                      <p className="relative mt-1 text-[11px] text-slate-500">A starting point for a stronger fit</p>
                    </motion.section>

                    <motion.section variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="rounded-3xl border border-white/[0.08] bg-slate-900/60 p-5 backdrop-blur-xl sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-rose-200">
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-400/[0.1]"><Target size={16} /></span>
                            <h3 className="text-sm font-semibold text-slate-100">Keywords to bring forward</h3>
                          </div>
                          <p className="mt-2 text-xs text-slate-500">Consider adding these where they honestly reflect your experience.</p>
                        </div>
                        <span className="rounded-full border border-rose-300/10 bg-rose-300/[0.06] px-2.5 py-1 text-[10px] text-rose-200">
                          {analysis.missingKeywords?.length ?? 0} to explore
                        </span>
                      </div>
                      <div className="mt-5 flex min-h-20 flex-wrap content-start gap-2">
                        {analysis.missingKeywords?.length ? analysis.missingKeywords.map((keyword, index) => (
                          <motion.span key={`${keyword}-${index}`} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + index * 0.04 }} className="rounded-full border border-rose-300/[0.17] bg-gradient-to-r from-rose-400/[0.1] to-pink-400/[0.06] px-3 py-1.5 text-xs text-rose-100/90 transition duration-200 hover:-translate-y-0.5 hover:border-rose-300/35 hover:shadow-[0_0_18px_rgba(244,63,94,0.12)]">
                            {keyword}
                          </motion.span>
                        )) : (
                          <p className="flex items-center gap-2 py-2 text-sm text-emerald-200"><Check size={16} /> No missing keywords found.</p>
                        )}
                      </div>
                    </motion.section>
                  </div>

                  <motion.section variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.15 }} className="rounded-3xl border border-white/[0.08] bg-slate-900/55 p-5 backdrop-blur-xl sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-300/[0.1] text-violet-200"><ArrowUpRight size={16} /></span>
                          <h3 className="text-sm font-semibold text-white">Bullet point upgrades</h3>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">Small edits can make your impact easier to spot.</p>
                      </div>
                      <span className="hidden text-[10px] uppercase tracking-[0.16em] text-slate-600 sm:block">Before <ArrowRight className="mx-1 inline" size={12} /> After</span>
                    </div>
                    <div className="grid gap-3">
                      {analysis.bulletImprovements?.length ? analysis.bulletImprovements.map((bullet, index) => (
                        <motion.div key={`bullet-${index}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.08 }} className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-xl border border-rose-300/[0.1] bg-rose-400/[0.045] p-3.5">
                              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-rose-300/80">Before</p>
                              <p className="text-sm leading-6 text-slate-300">{bullet.original}</p>
                            </div>
                            <div className="rounded-xl border border-emerald-300/[0.12] bg-emerald-400/[0.05] p-3.5">
                              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300">After</p>
                              <p className="text-sm leading-6 text-slate-100">{bullet.improved}</p>
                            </div>
                          </div>
                          {bullet.reason && <p className="mt-3 flex items-start gap-2 px-1 text-xs leading-5 text-slate-500"><Lightbulb size={13} className="mt-0.5 shrink-0 text-amber-300/70" />{bullet.reason}</p>}
                        </motion.div>
                      )) : <p className="py-5 text-center text-sm text-slate-500">No bullet rewrites were returned.</p>}
                    </div>
                  </motion.section>

                  <motion.section variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="rounded-3xl border border-white/[0.08] bg-slate-900/55 p-5 backdrop-blur-xl sm:p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-300/[0.1] text-cyan-200"><Clipboard size={16} /></span>
                      <div>
                        <h3 className="text-sm font-semibold text-white">Your tailored cover letter</h3>
                        <p className="mt-0.5 text-[11px] text-slate-500">A thoughtful first draft, ready for your personal touch.</p>
                      </div>
                    </div>
                    <textarea readOnly value={analysis.coverLetter ?? ""} rows="7" aria-label="Tailored cover letter" className="w-full resize-y rounded-2xl border border-white/[0.07] bg-[#080d12]/70 px-4 py-4 text-sm leading-7 text-slate-300 outline-none" />
                  </motion.section>

                  <motion.section id="interview" variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.25 }} className="overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/65 shadow-[0_24px_90px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-xl border border-emerald-300/10 bg-emerald-300/[0.08] text-emerald-200"><MessageSquareText size={17} /></span>
                        <div>
                          <h3 className="text-sm font-semibold text-white">Live AI mock interview</h3>
                          <p className="mt-0.5 text-[11px] text-slate-500">Hiring manager simulation · Gemini</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 rounded-full border border-emerald-300/10 bg-emerald-300/[0.05] px-2.5 py-1 text-[10px] text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live</span>
                    </div>

                    <div className="flex h-[400px] flex-col">
                      <div className="chat-scroll min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
                        {interviewHistory.length === 0 && (
                          <div className="flex h-full flex-col items-center justify-center text-center">
                            <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.06] text-emerald-200"><MessageCircle size={20} /></span>
                            <p className="text-sm font-medium text-slate-300">Ready when you are</p>
                            <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Start the interview to get your first question. Your role description guides the conversation.</p>
                          </div>
                        )}
                        <AnimatePresence initial={false}>
                          {interviewHistory.map((turn, index) => {
                            const isInterviewer = turn.role === "interviewer";
                            return (
                              <motion.div
                                key={`${turn.role}-${index}-${turn.content}`}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.28 }}
                                className={`flex ${isInterviewer ? "justify-start" : "justify-end"}`}
                              >
                                <div className={`max-w-[88%] sm:max-w-[78%] ${isInterviewer ? "" : "items-end"}`}>
                                  <div className={`mb-1.5 flex items-center gap-2 text-[10px] font-medium ${isInterviewer ? "text-emerald-300" : "justify-end text-sky-300"}`}>
                                    {isInterviewer ? <><span className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-300/[0.1]"><BriefcaseBusiness size={12} /></span>Hiring manager</> : <>You<span className="grid h-6 w-6 place-items-center rounded-lg bg-sky-300/[0.1]"><MessageCircle size={12} /></span></>}
                                  </div>
                                  <div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${isInterviewer ? "rounded-tl-md border border-emerald-300/[0.1] bg-emerald-300/[0.055] text-slate-200" : "rounded-tr-md border border-sky-300/[0.12] bg-sky-300/[0.07] text-slate-100"}`}>
                                    {turn.content}
                                  </div>
                                  {turn.feedback && (
                                    <div className="mt-2 flex gap-2 rounded-xl border border-amber-200/[0.1] bg-amber-200/[0.035] px-3 py-2.5 text-xs italic leading-5 text-amber-100/70">
                                      <Sparkles size={13} className="mt-0.5 shrink-0 text-amber-200/70" />
                                      <span>{turn.feedback}</span>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                        {loading && analysis && (
                          <div className="flex items-center gap-2 text-xs text-slate-500"><LoaderCircle size={14} className="animate-spin text-emerald-300" />Your interviewer is thinking...</div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      <form onSubmit={handleInterviewTurn} className="border-t border-white/[0.07] bg-black/10 p-3 sm:p-4">
                        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#080d12]/70 p-1.5 pl-3 transition focus-within:border-emerald-300/25">
                          <input
                            value={interviewAnswer}
                            onChange={(e) => setInterviewAnswer(e.target.value)}
                            placeholder={interviewHistory.length === 0 ? "Start your interview..." : "Type your answer..."}
                            aria-label="Your interview answer"
                            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-200 outline-none placeholder:text-slate-600"
                          />
                          <button type="submit" disabled={loading} aria-label={interviewHistory.length === 0 ? "Start interview" : "Send answer"} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-emerald-400 px-3.5 py-2.5 text-xs font-semibold text-[#06231d] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">
                            {loading ? <LoaderCircle className="animate-spin" size={15} /> : interviewHistory.length === 0 ? <><span className="hidden sm:inline">Start interview</span><ArrowRight size={15} /></> : <><span className="hidden sm:inline">Send</span><Send size={14} /> </>}
                          </button>
                        </div>
                        <p className="mt-2 px-1 text-[10px] text-slate-600">Take a breath. This is practice, not a test.</p>
                      </form>
                    </div>
                  </motion.section>

                  <div className="flex items-center justify-center gap-2 pb-2 text-[10px] text-slate-600">
                    <CheckCircle2 size={12} /> AI suggestions are a starting point — make every line your own.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!analysis && (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.055] bg-white/[0.02] px-4 py-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-300/[0.08] text-emerald-200"><Target size={15} /></span>
                  <div><p className="text-xs font-medium text-slate-300">Match insights</p><p className="mt-0.5 text-[10px] text-slate-600">See your role fit</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.055] bg-white/[0.02] px-4 py-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-300/[0.08] text-violet-200"><ArrowDown size={15} /></span>
                  <div><p className="text-xs font-medium text-slate-300">Stronger bullets</p><p className="mt-0.5 text-[10px] text-slate-600">Show your impact</p></div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.055] bg-white/[0.02] px-4 py-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-300/[0.08] text-cyan-200"><MessageCircle size={15} /></span>
                  <div><p className="text-xs font-medium text-slate-300">Interview practice</p><p className="mt-0.5 text-[10px] text-slate-600">Build your confidence</p></div>
                </div>
              </div>
            )}

            <footer className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] py-5 text-[10px] text-slate-600 sm:flex-row">
              <span>© 2026 CareerPulse AI · Made for your next chapter</span>
              <span className="flex items-center gap-1.5"><Sparkles size={11} /> Thoughtful career support, powered by AI</span>
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}

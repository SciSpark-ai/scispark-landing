"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Search,
  Filter,
  FileText,
  Brain,
  CheckCircle2,
  Send,
} from "lucide-react";

type Phase = "idle" | "user-q" | "reasoning" | "answer" | "followup";

const reasoningSteps = [
  { icon: Search, text: "Searching 12,847 papers...", duration: 1200 },
  { icon: Filter, text: "Screening 23 relevant results...", duration: 1000 },
  { icon: FileText, text: "Extracting data from 6 key studies...", duration: 1400 },
  { icon: Brain, text: "Synthesizing evidence...", duration: 1000 },
];

const citations = [
  { label: "Cole et al. 2020" },
  { label: "Am J Psychiatry" },
  { label: "Stanford SAINT" },
];

const answerText = `Based on current evidence, **accelerated TMS** (specifically the Stanford SAINT protocol) shows superior outcomes for treatment-resistant depression:\n\n• **SAINT protocol**: 90% remission rate (HAM-D ≤7) vs ~13% standard TMS\n• **Speed**: 5-day intensive course vs 4–6 weeks conventional rTMS\n• **Mechanism**: Individualized targeting via fMRI connectivity to sgACC\n• **Study quality**: RCT (n=29) with sham control — strong but small sample`;

function parseAnswerText(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const lines = text.split("\n");

  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) nodes.push(<br key={`br-${lineIdx}`} />);

    // Replace **bold** with <strong>
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    parts.forEach((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        nodes.push(<strong key={`${lineIdx}-${i}`}>{part.slice(2, -2)}</strong>);
      } else if (part.startsWith("• ")) {
        // orange bullet
        nodes.push(
          <span key={`${lineIdx}-${i}`}>
            <span className="text-orange font-bold">•</span>
            {part.slice(1)}
          </span>
        );
      } else {
        nodes.push(<span key={`${lineIdx}-${i}`}>{part}</span>);
      }
    });
  });

  return nodes;
}

export function ChatMockup() {
  const t = useTranslations("showcase.agent");
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [stepComplete, setStepComplete] = useState<boolean[]>([false, false, false, false]);
  const triggered = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView || triggered.current) return;
    triggered.current = true;

    // 0.8s: show user question
    const t1 = setTimeout(() => setPhase("user-q"), 800);

    // 2.3s: start reasoning
    const t2 = setTimeout(() => {
      setPhase("reasoning");
      setCurrentStep(0);
    }, 2300);

    // Schedule each reasoning step
    let cumulativeDelay = 2300;
    const stepTimers: ReturnType<typeof setTimeout>[] = [];

    reasoningSteps.forEach((step, idx) => {
      cumulativeDelay += step.duration;
      const d = cumulativeDelay;
      const timer = setTimeout(() => {
        setStepComplete((prev) => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
        if (idx < reasoningSteps.length - 1) {
          setCurrentStep(idx + 1);
        }
      }, d);
      stepTimers.push(timer);
    });

    // After all steps done → answer (0.4s delay)
    const answerDelay = cumulativeDelay + 400;
    const t3 = setTimeout(() => setPhase("answer"), answerDelay);

    // 3s after answer → followup
    const t4 = setTimeout(() => setPhase("followup"), answerDelay + 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      stepTimers.forEach(clearTimeout);
    };
  }, [isInView]);

  const showReasoning = phase === "reasoning" || phase === "answer" || phase === "followup";
  const showAnswer = phase === "answer" || phase === "followup";
  const showFollowup = phase === "followup";

  const messagesRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
    }
  }, []);

  // Auto-scroll when phase or steps change
  useEffect(() => { scrollToBottom(); }, [phase, currentStep, stepComplete, scrollToBottom]);

  const stepsToShow =
    phase === "reasoning"
      ? currentStep + 1
      : showReasoning
      ? reasoningSteps.length
      : 0;

  return (
    <div
      ref={ref}
      className="bg-card-surface rounded-card overflow-hidden border border-border-warm/30 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-light-surface border-b border-border-warm/20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold font-body">S</span>
          </div>
          <div>
            <p className="font-body text-sm font-semibold text-espresso leading-tight">SciSpark AI</p>
            <p className="font-body text-[10px] text-muted-text leading-tight">{t("remembers")}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-body text-[10px] font-semibold text-green-600 tracking-wider">{t("online")}</span>
        </div>
      </div>

      {/* Messages area — fixed height, scrolls */}
      <div ref={messagesRef} className="p-4 space-y-4 h-[420px] overflow-y-auto scrollbar-hide">
        {/* User question */}
        <AnimatePresence>
          {phase !== "idle" && (
            <motion.div
              key="user-q"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex justify-end"
            >
              <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-md bg-orange/10 border border-orange/20">
                <p className="font-body text-sm text-espresso leading-relaxed">
                  What&apos;s the latest evidence on TMS protocols for treatment-resistant depression? My patient has failed two SSRIs and one SNRI.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reasoning bubble (AI response) */}
        <AnimatePresence>
          {showReasoning && (
            <motion.div
              key="reasoning-bubble"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white rounded-2xl rounded-bl-md shadow-sm p-3 space-y-2"
            >
              {/* Reasoning steps */}
              {reasoningSteps.slice(0, stepsToShow).map((step, idx) => {
                const Icon = step.icon;
                const isDone = stepComplete[idx];
                const isActive = phase === "reasoning" && idx === currentStep && !isDone;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex items-center gap-2"
                  >
                    {isDone ? (
                      <CheckCircle2
                        className="w-3.5 h-3.5 text-green-500 flex-shrink-0"
                        strokeWidth={2}
                      />
                    ) : (
                      <Icon
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isActive ? "text-orange animate-pulse" : "text-orange"
                        }`}
                        strokeWidth={2}
                      />
                    )}
                    <span
                      className={`font-body text-xs leading-snug ${
                        isDone && !showAnswer
                          ? "text-muted-text/50"
                          : isDone
                          ? "text-muted-text/60"
                          : "text-espresso"
                      }`}
                    >
                      {step.text}
                    </span>
                  </motion.div>
                );
              })}

              {/* AI answer */}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border-warm/20 pt-3 mt-2">
                      <p className="font-body text-xs text-espresso leading-relaxed">
                        {parseAnswerText(answerText)}
                      </p>
                      {/* Citation chips */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {citations.map((c, i) => (
                          <span
                            key={i}
                            className="font-body text-[10px] px-2 py-0.5 rounded-full bg-orange/10 text-orange border border-orange/20"
                          >
                            {c.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Follow-up question */}
        <AnimatePresence>
          {showFollowup && (
            <>
              <motion.div
                key="followup-q"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex justify-end"
              >
                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-md bg-orange/10 border border-orange/20">
                  <p className="font-body text-sm text-espresso leading-relaxed">
                    How does it compare to standard rTMS in terms of durability?
                  </p>
                </div>
              </motion.div>

              {/* Typing indicator */}
              <motion.div
                key="typing"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
                className="flex items-center gap-1 px-3 py-2.5 bg-white rounded-2xl rounded-bl-md shadow-sm w-fit"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted-text/50"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-light-surface rounded-btn px-4 py-2.5 border border-border-warm/30">
          <span className="font-body text-sm text-muted-text/50 flex-1">
            Ask a follow-up question...
          </span>
          <div className="w-7 h-7 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
            <Send className="w-3.5 h-3.5 text-white" strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
}

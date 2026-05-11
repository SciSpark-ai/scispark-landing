"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowUp,
  Brain,
  CheckCircle2,
  FileText,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";

type Phase = "idle" | "user-q" | "reasoning" | "answer";

const REASONING_STEPS = [
  { icon: Search, text: "Searching 12,847 papers...", duration: 1100 },
  { icon: Filter, text: "Screening 23 relevant results...", duration: 900 },
  { icon: FileText, text: "Extracting data from 6 key studies...", duration: 1200 },
  { icon: Brain, text: "Synthesizing evidence...", duration: 900 },
];

const ANSWER_TEXT =
  "Across recent psilocybin RCTs in MDD, **week-6/8 remission rates** cluster in the 30–60% range:\n\n• **This trial (NEJM 2024)**: 57% (vs 28% escitalopram, active placebo)\n• **JAMA Psychiatry 2025 (TRD)**: 37.5% (vs 12.3% niacin)\n• **NEJM 2023 single-dose (TRD)**: 29% (vs 8% niacin)\n• **Pattern**: Larger effects on secondary endpoints; primary endpoint significance varies by design";

const CITATIONS = [
  { label: "NEJM 2024" },
  { label: "JAMA Psych 2025" },
  { label: "NEJM 2023" },
];

const USER_QUESTION =
  "How does the remission rate here compare to other psilocybin RCTs in MDD?";

function parseAnswerText(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const lines = text.split("\n");

  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) nodes.push(<br key={`br-${lineIdx}`} />);
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    parts.forEach((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        nodes.push(<strong key={`${lineIdx}-${i}`}>{part.slice(2, -2)}</strong>);
      } else if (part.startsWith("• ")) {
        nodes.push(
          <span key={`${lineIdx}-${i}`}>
            <span className="text-orange font-bold">•</span>
            {part.slice(1)}
          </span>,
        );
      } else {
        nodes.push(<span key={`${lineIdx}-${i}`}>{part}</span>);
      }
    });
  });

  return nodes;
}

export function DigestChatPreview() {
  const t = useTranslations("showcase.agent");
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [stepComplete, setStepComplete] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const ref = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40px" });
  const loopTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = useCallback(() => {
    loopTimers.current.forEach(clearTimeout);
    loopTimers.current = [];
  }, []);

  const resetState = useCallback(() => {
    setPhase("idle");
    setCurrentStep(0);
    setStepComplete([false, false, false, false]);
  }, []);

  const runSequence = useCallback(() => {
    clearAllTimers();
    resetState();

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase("user-q"), 600));
    timers.push(
      setTimeout(() => {
        setPhase("reasoning");
        setCurrentStep(0);
      }, 1800),
    );

    let cumulativeDelay = 1800;
    REASONING_STEPS.forEach((step, idx) => {
      cumulativeDelay += step.duration;
      const d = cumulativeDelay;
      timers.push(
        setTimeout(() => {
          setStepComplete((prev) => {
            const next = [...prev];
            next[idx] = true;
            return next;
          });
          if (idx < REASONING_STEPS.length - 1) {
            setCurrentStep(idx + 1);
          }
        }, d),
      );
    });

    const answerDelay = cumulativeDelay + 300;
    timers.push(setTimeout(() => setPhase("answer"), answerDelay));

    const restartDelay = answerDelay + 6000;
    timers.push(setTimeout(() => runSequence(), restartDelay));

    loopTimers.current = timers;
  }, [clearAllTimers, resetState]);

  useEffect(() => {
    if (isInView) {
      runSequence();
    } else {
      clearAllTimers();
      resetState();
    }
    return clearAllTimers;
  }, [isInView, runSequence, clearAllTimers, resetState]);

  const scrollToBottom = useCallback(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [phase, currentStep, stepComplete, scrollToBottom]);

  const showReasoning = phase === "reasoning" || phase === "answer";
  const showAnswer = phase === "answer";
  const stepsToShow =
    phase === "reasoning" ? currentStep + 1 : showReasoning ? REASONING_STEPS.length : 0;

  return (
    <div
      ref={ref}
      className="bg-card-surface rounded-[14px] overflow-hidden border border-border-warm/30 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-light-surface border-b border-border-warm/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-bold">S</span>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-espresso leading-tight">
              SciSpark AI
            </p>
            <p className="text-[10px] text-muted-text leading-tight">
              {t("remembers")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[9px] font-semibold text-green-600 tracking-wider">
            {t("online")}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesRef}
        className="p-3 space-y-3 h-[240px] overflow-y-auto scrollbar-hide"
      >
        <AnimatePresence>
          {phase !== "idle" && (
            <motion.div
              key="user-q"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex justify-end"
            >
              <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-br-md bg-orange/10 border border-orange/20">
                <p className="text-[12px] text-espresso leading-relaxed">
                  {USER_QUESTION}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showReasoning && (
            <motion.div
              key="reasoning-bubble"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white rounded-2xl rounded-bl-md shadow-sm p-2.5 space-y-1.5"
            >
              {REASONING_STEPS.slice(0, stepsToShow).map((step, idx) => {
                const Icon = step.icon;
                const isDone = stepComplete[idx];
                const isActive =
                  phase === "reasoning" && idx === currentStep && !isDone;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2"
                  >
                    {isDone ? (
                      <CheckCircle2
                        className="w-3 h-3 text-green-500 flex-shrink-0"
                        strokeWidth={2}
                      />
                    ) : (
                      <Icon
                        className={`w-3 h-3 flex-shrink-0 ${
                          isActive ? "text-orange animate-pulse" : "text-orange"
                        }`}
                        strokeWidth={2}
                      />
                    )}
                    <span
                      className={`text-[11px] leading-snug ${
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

              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border-warm/20 pt-2 mt-1.5">
                      <p className="text-[11px] text-espresso leading-relaxed">
                        {parseAnswerText(ANSWER_TEXT)}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {CITATIONS.map((c, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-1.5 py-0.5 rounded-full bg-orange/10 text-orange border border-orange/20"
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
      </div>

      {/* Input */}
      <div className="bg-page-warm border-t border-border-warm/30 px-3 py-2.5">
        <div className="bg-white rounded-2xl border border-border-warm/30 px-3 pt-2 pb-1.5">
          <span className="text-[11px] text-muted-text">
            Ask a follow-up question...
          </span>
          <div className="flex items-center justify-between mt-2">
            <Plus size={12} className="text-muted-text" />
            <div className="w-6 h-6 rounded-full bg-card-surface flex items-center justify-center">
              <ArrowUp size={11} className="text-muted-text" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

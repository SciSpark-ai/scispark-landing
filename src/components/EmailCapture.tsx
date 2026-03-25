"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { submitToWaitlist } from "@/lib/supabase";

interface EmailCaptureProps {
  source: "hero" | "footer-cta";
  buttonLabel: string;
  className?: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function EmailCapture({ source, buttonLabel, className }: EmailCaptureProps) {
  const t = useTranslations("email");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setStatus("error");
      setErrorMsg(t("errorInvalid"));
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const result = await submitToWaitlist(email, source);
      if (result.success) {
        setStatus("success");
      } else if (result.duplicate) {
        setStatus("error");
        setErrorMsg(t("errorDuplicate"));
      } else {
        setStatus("error");
        setErrorMsg(t("errorInvalid"));
      }
    } catch {
      setStatus("error");
      setErrorMsg(t("errorInvalid"));
    }
  }

  if (status === "success") {
    return (
      <AnimatePresence mode="wait">
        <motion.p
          key="success"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={`text-sm text-espresso font-medium ${className ?? ""}`}
        >
          {t("success")}
        </motion.p>
      </AnimatePresence>
    );
  }

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder={t("placeholder")}
          className="flex-1 px-4 py-3 rounded-[12px] bg-white text-espresso placeholder:text-muted-text/60 border border-border-warm/40 focus:outline-none focus:border-orange transition"
          disabled={status === "loading"}
          required
        />
        <motion.button
          type="submit"
          disabled={status === "loading"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-orange text-white font-medium px-6 py-3 rounded-pill whitespace-nowrap hover:bg-orange/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "..." : buttonLabel}
        </motion.button>
      </form>

      <AnimatePresence>
        {status === "error" && errorMsg && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 text-sm text-center text-red-500"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

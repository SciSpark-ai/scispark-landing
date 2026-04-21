"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MockSidebar, type ViewId } from "./MockSidebar";
import { MockMobileBar } from "./MockMobileBar";
import { HomeView } from "./views/HomeView";
import { NewChatView } from "./views/NewChatView";
import { ProjectsView } from "./views/ProjectsView";
import { LibraryView } from "./views/LibraryView";
import { HistoryView } from "./views/HistoryView";

export function AppShell() {
  const [activeView, setActiveView] = useState<ViewId>("home");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  function handleNavigate(id: ViewId) {
    setActiveView(id);
    setMobileSidebarOpen(false);
  }

  return (
    <div className="relative flex h-[640px] md:h-[720px] bg-page-bg">
      {/* md rail — icon-only */}
      <div className="hidden md:block lg:hidden w-[60px] flex-shrink-0 border-r border-border-warm overflow-hidden">
        <MockSidebar activeView={activeView} onNavigate={handleNavigate} compact />
      </div>

      {/* lg full sidebar */}
      <div className="hidden lg:block w-[240px] flex-shrink-0 border-r border-border-warm overflow-hidden">
        <MockSidebar activeView={activeView} onNavigate={handleNavigate} />
      </div>

      {/* Main pane (with mobile top bar stacked above the view) */}
      <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
        <MockMobileBar onOpenSidebar={() => setMobileSidebarOpen(true)} />
        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="h-full"
            >
              {activeView === "home" && <HomeView />}
              {activeView === "chat" && <NewChatView />}
              {activeView === "projects" && <ProjectsView />}
              {activeView === "library" && <LibraryView />}
              {activeView === "history" && <HistoryView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden absolute inset-0 bg-espresso/20 z-20"
            />
            <motion.div
              key="panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden absolute inset-y-0 left-0 w-[260px] z-30 shadow-lg"
            >
              <MockSidebar
                activeView={activeView}
                onNavigate={handleNavigate}
                onClose={() => setMobileSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";

import { MessageCircle, X, Zap, Headphones } from "lucide-react";

import { AIChat } from "./AiChat";
import { AdminChat } from "./AdminChat";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "ai" | "admin">("menu");

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-slate-800 hover:bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 z-40"
        aria-label="Open chat menu"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Popup Menu */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-xl border border-border z-40 overflow-hidden">
          {activeTab === "menu" ? (
            <div className="flex flex-col divide-y divide-border w-56">
              {/* Chat với AI Option */}
              <button
                onClick={() => setActiveTab("ai")}
                className="px-4 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">
                    Chat với AI
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Hỗ trợ tự động 24/7
                  </div>
                </div>
              </button>

              {/* Chat với Quản trị viên Option */}
              <button
                onClick={() => setActiveTab("admin")}
                className="px-4 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">
                    Chat với Quản trị viên
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Hỗ trợ từ đội ngũ
                  </div>
                </div>
              </button>
            </div>
          ) : activeTab === "ai" ? (
            <AIChat onBack={() => setActiveTab("menu")} />
          ) : (
            <AdminChat onBack={() => setActiveTab("menu")} />
          )}
        </div>
      )}
    </>
  );
}

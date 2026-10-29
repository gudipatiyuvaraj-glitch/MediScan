/**
 * MediScan 7-Minute Internship Defense Presentation Mode
 * Deliverable #7 & Day 15 Milestone: Interactive presentation deck with
 * real-time defense timer, speaker notes, and 1-click live demo launch.
 */

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Presentation,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  X,
} from 'lucide-react';
import { PRESENTATION_SLIDES } from '../data/presentationSlides';

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchLiveDemo: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  isOpen,
  onClose,
  onLaunchLiveDemo,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showNotes, setShowNotes] = useState<boolean>(true);

  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];
  const totalSlides = PRESENTATION_SLIDES.length;

  // Presentation stopwatch timer
  useEffect(() => {
    let interval: any = null;
    if (isOpen && isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isTimerRunning]);

  if (!isOpen) return null;

  // Format seconds to MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleResetTimer = () => {
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07090e] text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Top Presentation Ribbon */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
            {currentSlide.id}
          </div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-wide uppercase">
              15-Day Internship Final Project Defense • Code A Nova 2026
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Slide {currentSlideIndex + 1} of {totalSlides} · Target: {currentSlide.timeTarget}
            </p>
          </div>
        </div>

        {/* Defense Timer Controller */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-md border border-slate-800 font-mono text-xs">
            <span className="text-slate-400 text-[10px] uppercase">Elapsed:</span>
            <span
              className={`font-bold tabular-nums ${
                timerSeconds > 420 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'
              }`}
            >
              {formatTime(timerSeconds)}
            </span>
            <span className="text-slate-500">/ 07:00</span>
          </div>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={handleResetTimer}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-colors ${
              showNotes
                ? 'bg-slate-800 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-850 border-slate-700 text-slate-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Exit Presentation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Slide Canvas Stage */}
      <main className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full flex flex-col justify-center space-y-6">
        <div>
          <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
            {currentSlide.subtitle}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            {currentSlide.title}
          </h1>
        </div>

        {/* Quantitative Highlights Strip if available */}
        {currentSlide.metricsHighlight && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {currentSlide.metricsHighlight.map((m) => (
              <div
                key={m.label}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm"
              >
                <span className="text-[11px] font-mono uppercase text-slate-400">
                  {m.label}
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400 mt-0.5">
                  {m.value}
                </div>
                <span className="text-xs text-slate-400 mt-0.5 block">{m.sublabel}</span>
              </div>
            ))}
          </div>
        )}

        {/* Key Points Accordion/List */}
        <div className="grid grid-cols-1 gap-3.5">
          {currentSlide.keyPoints.map((kp, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-1"
            >
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{kp.heading}</span>
              </h4>
              <p className="text-xs text-slate-300 pl-3.5 leading-relaxed">
                {kp.details}
              </p>
            </div>
          ))}
        </div>

        {/* Slide 7 Specific Live Demo CTA */}
        {currentSlide.id === 7 && (
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Ready for Live Interactive Review</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Demonstrate single-scan inference, real-time Grad-CAM overlay, and DICOM windowing now.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onLaunchLiveDemo();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch Live Classification Demo</span>
            </button>
          </div>
        )}
      </main>

      {/* Speaker Notes Drawer (Optional Toggle) */}
      {showNotes && (
        <aside className="bg-slate-950 border-t border-slate-800 px-6 py-3 max-h-36 overflow-y-auto">
          <div className="max-w-5xl mx-auto flex items-start gap-3 text-xs text-slate-300">
            <span className="font-mono text-cyan-400 font-bold uppercase shrink-0 pt-0.5">
              Speaker Notes:
            </span>
            <p className="leading-relaxed text-slate-300 italic">
              "{currentSlide.speakerNotes}"
            </p>
          </div>
        </aside>
      )}

      {/* Bottom Navigation Toolbar */}
      <footer className="h-16 border-t border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {PRESENTATION_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlideIndex === idx
                  ? 'bg-cyan-400 w-6'
                  : 'bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Jump to Slide ${s.id}: ${s.title}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentSlideIndex === totalSlides - 1}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};

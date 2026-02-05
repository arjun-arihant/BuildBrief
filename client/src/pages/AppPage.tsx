import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Activity, ArrowRight, RotateCcw,
  CheckCircle2, Download, Copy, Check, ChevronRight
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowingButton } from '../components/ui/GlowingButton';
import { Input } from '../components/ui/Input';
import type { AIResponse } from '../types';

const API_Base = '/api';

interface ProjectState {
  projectId: string | null;
  currentStep: AIResponse | null;
  history: AIResponse[];
}

export function AppPage() {
  const navigate = useNavigate();
  const [ideaInput, setIdeaInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<ProjectState>({
    projectId: null,
    currentStep: null,
    history: []
  });
  const [copied, setCopied] = useState(false);

  const startProject = async () => {
    if (!ideaInput.trim()) return;
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_Base}/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: ideaInput })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setState({
        projectId: data.projectId,
        currentStep: data.step,
        history: [data.step]
      });
    } catch (e: any) {
      setError(e.message || "Failed to start");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (answer: string) => {
    if (!state.projectId) return;
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_Base}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: state.projectId, answer })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setState(prev => ({
        ...prev,
        currentStep: data.step,
        history: [...prev.history, data.step]
      }));
    } catch (e: any) {
      setError(e.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetApp = () => {
    setState({ projectId: null, currentStep: null, history: [] });
    setIdeaInput('');
    setError(null);
  };

  const renderStepContent = () => {
    if (!state.currentStep) return null;

    const currentStep = state.currentStep;

    switch (currentStep.type) {
      case 'question':
        return (
          <QuestionStep 
            step={currentStep.content} 
            onSubmit={submitAnswer} 
            loading={loading} 
          />
        );
      
      case 'final_output':
        return (
          <FinalStep 
            step={currentStep.content} 
            onCopy={() => copyToClipboard(currentStep.content.mega_prompt || '')}
            copied={copied}
            onReset={resetApp}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-aurora-bg text-aurora-text">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-aurora-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-96 h-96 bg-aurora-secondary/5 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-aurora-bg/80 backdrop-blur-xl border-b border-aurora-border/30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aurora-primary to-aurora-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold">BuildBrief</span>
          </button>

          {state.projectId && (
            <button
              onClick={resetApp}
              className="flex items-center gap-2 text-sm text-aurora-muted hover:text-aurora-text transition-colors"
            >
              <RotateCcw size={16} />
              Start Over
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!state.projectId ? (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="min-h-[70vh] flex flex-col items-center justify-center text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                                bg-aurora-primary/10 border border-aurora-primary/30 mb-8">
                  <Sparkles size={16} className="text-aurora-primary" />
                  <span className="text-sm font-medium text-aurora-primary">AI Specification Engine</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
                  What's your{' '}
                  <span className="aurora-gradient-text">idea</span>?
                </h1>

                <p className="text-xl text-aurora-muted max-w-xl mb-10">
                  Describe your project and let our AI interview you to create a 
                  production-ready specification.
                </p>

                <div className="w-full max-w-2xl">
                  <GlassCard glow className="p-2">
                    <div className="flex gap-2">
                      <Input
                        value={ideaInput}
                        onChange={(e) => setIdeaInput(e.target.value)}
                        placeholder="e.g., A Tinder for adopting rescue dogs..."
                        className="border-none text-lg h-14 bg-transparent flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && startProject()}
                      />
                      <GlowingButton
                        onClick={startProject}
                        disabled={loading || !ideaInput.trim()}
                        className="h-14 px-6"
                        icon={loading ? <Activity className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                        iconPosition="right"
                      >
                        {loading ? 'Starting...' : 'Start'}
                      </GlowingButton>
                    </div>
                  </GlassCard>

                  {error && (
                    <p className="text-aurora-error mt-4">{error}</p>
                  )}
                </div>

                <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl">
                  {[
                    { label: 'AI Interview', desc: 'Intelligent questions' },
                    { label: 'Smart Decisions', desc: 'Auto-selects tech' },
                    { label: 'Mega-Prompt', desc: 'Ready for AI agents' },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="text-aurora-text font-medium">{item.label}</div>
                      <div className="text-sm text-aurora-muted">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="wizard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8"
              >
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-aurora-muted">Progress</span>
                    <span className="text-sm text-aurora-muted">
                      Step {state.history.length}
                    </span>
                  </div>
                  <div className="h-1 bg-aurora-surface rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-aurora-primary to-aurora-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(state.history.length * 15, 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  {renderStepContent()}
                </AnimatePresence>

                {error && (
                  <p className="text-aurora-error mt-4 text-center">{error}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Sub-components

function QuestionStep({ step, onSubmit, loading }: { 
  step: any; 
  onSubmit: (answer: string) => void;
  loading: boolean;
}) {
  const [answer, setAnswer] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <GlassCard className="mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-aurora-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-aurora-primary" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">{step.question}</h3>
            {step.context && (
              <p className="text-aurora-muted text-sm mb-4">{step.context}</p>
            )}
          </div>
        </div>
      </GlassCard>

      {step.options ? (
        <div className="space-y-3">
          {step.options.map((option: string) => (
            <GlassCard
              key={option}
              hover
              onClick={() => !loading && onSubmit(option)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                <ChevronRight size={18} className="text-aurora-muted" />
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
            className="w-full bg-transparent border-none resize-none focus:outline-none text-aurora-text placeholder:text-aurora-muted"
          />
          
          <div className="flex justify-end mt-4">
            <GlowingButton
              onClick={() => onSubmit(answer)}
              disabled={loading || !answer.trim()}
              loading={loading}
              icon={<ArrowRight size={18} />}
              iconPosition="right"
            >
              Continue
            </GlowingButton>
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
}

function FinalStep({ step, onCopy, copied, onReset }: { 
  step: any; 
  onCopy: () => void;
  copied: boolean;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="w-20 h-20 rounded-full bg-aurora-success/20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} className="text-aurora-success" />
      </div>

      <h2 className="text-3xl font-display font-bold mb-2">
        Your spec is ready!
      </h2>
      
      <p className="text-aurora-muted mb-8">
        Copy your Mega-Prompt and use it with Cursor, Windsurf, or any AI coding agent.
      </p>

      <GlassCard className="mb-6 text-left">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-aurora-muted">Mega-Prompt</span>
          
          <div className="flex gap-2">
            <button
              onClick={onCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-aurora-surface text-sm hover:bg-aurora-surfaceHover transition-colors"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-aurora-surface text-sm hover:bg-aurora-surfaceHover transition-colors"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        <pre className="bg-aurora-bg/50 rounded-lg p-4 overflow-auto max-h-96 text-sm text-aurora-text whitespace-pre-wrap">
          {step.megaPrompt || 'Your Mega-Prompt will appear here...'}
        </pre>
      </GlassCard>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <GlowingButton onClick={onReset} variant="secondary">
          Start New Project
        </GlowingButton>
      </div>
    </motion.div>
  );
}

// LoadingStep component - kept for future use
/*
function LoadingStep({ message }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <div className="relative w-16 h-16 mx-auto mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-aurora-border border-t-aurora-primary"
        />
      </div>
      
      <p className="text-aurora-muted">{message || 'Processing...'}</p>
    </motion.div>
  );
}
*/

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  BarChart3, 
  FileText, 
  Image as ImageIcon, 
  Loader2, 
  ChevronRight,
  ExternalLink,
  History,
  Info,
  TrendingUp,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar 
} from 'recharts';
import Markdown from 'react-markdown';
import { analyzeContent } from './services/gemini';
import { AnalysisResult } from './types';
import { cn } from './lib/utils';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function App() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!input && !imagePreview) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeContent(imagePreview || input, !!imagePreview);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze content. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setInput('');
      };
      reader.readAsDataURL(file);
    }
  };

  const sentimentData = result ? [
    { name: 'Positive', value: result.sentiment.positive },
    { name: 'Neutral', value: result.sentiment.neutral },
    { name: 'Negative', value: result.sentiment.negative },
  ] : [];

  const biasData = result ? [
    { subject: 'Partisan', A: result.bias.partisan, fullMark: 100 },
    { subject: 'Emotional', A: result.bias.emotional, fullMark: 100 },
    { subject: 'Clickbait', A: result.bias.clickbait, fullMark: 100 },
    { subject: 'Source Trust', A: result.sourceCredibility.score, fullMark: 100 },
  ] : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <ShieldCheck className="text-black w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter">VERITAS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/60">
            <a href="#" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="hover:text-white transition-colors">Trends</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all">
              Sign In
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
          >
            Uncover the Truth <br /> with AI Precision
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/40 max-w-2xl mx-auto"
          >
            Verify claims, detect bias, and analyze source credibility in real-time. 
            Powered by advanced multimodal AI for a safer information ecosystem.
          </motion.p>
        </div>

        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#111] border border-white/10 rounded-2xl p-2 shadow-2xl">
              <div className="flex flex-col gap-2">
                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setImagePreview(null);
                  }}
                  placeholder="Paste an article URL, text, or upload an image to verify..."
                  className="w-full bg-transparent border-none focus:ring-0 text-lg p-4 min-h-[120px] resize-none placeholder:text-white/20"
                />
                
                {imagePreview && (
                  <div className="px-4 pb-4">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setImagePreview(null)}
                        className="absolute top-1 right-1 bg-black/50 p-1 rounded-full hover:bg-black"
                      >
                        <AlertTriangle className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white">
                      <Globe className="w-5 h-5" />
                    </button>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || (!input && !imagePreview)}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-black font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Content
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
          )}
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Summary & Score */}
              <div className="lg:col-span-2 space-y-8">
                {/* Score Card */}
                <div className="bg-[#111] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    <div className={cn(
                      "w-24 h-24 rounded-full border-4 flex items-center justify-center text-3xl font-bold",
                      result.credibilityScore > 70 ? "border-emerald-500 text-emerald-500" :
                      result.credibilityScore > 40 ? "border-amber-500 text-amber-500" :
                      "border-red-500 text-red-500"
                    )}>
                      {result.credibilityScore}%
                    </div>
                  </div>
                  <div className="max-w-md">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <ShieldCheck className="text-emerald-500" />
                      Credibility Analysis
                    </h2>
                    <p className="text-white/60 leading-relaxed mb-6">
                      {result.summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.sourceCredibility.flags.map((flag, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/40">
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fact Checks */}
                <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FileText className="text-blue-500" />
                    Claim Verification
                  </h3>
                  <div className="space-y-4">
                    {result.factChecks.map((check, i) => (
                      <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-bold text-lg pr-4">{check.claim}</h4>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                            check.verdict === 'True' ? "bg-emerald-500/20 text-emerald-500" :
                            check.verdict === 'False' ? "bg-red-500/20 text-red-500" :
                            "bg-amber-500/20 text-amber-500"
                          )}>
                            {check.verdict}
                          </span>
                        </div>
                        <p className="text-white/60 text-sm mb-4">{check.explanation}</p>
                        <div className="flex flex-wrap gap-2">
                          {check.sources.map((source, j) => (
                            <a 
                              key={j} 
                              href={source} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-blue-400 hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Source {j + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Analytics */}
              <div className="space-y-8">
                {/* Sentiment Chart */}
                <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <BarChart3 className="text-purple-500" />
                    Sentiment Analysis
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 text-xs text-white/40">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Positive</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Neutral</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Negative</div>
                  </div>
                </div>

                {/* Bias Radar */}
                <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <ShieldAlert className="text-amber-500" />
                    Bias & Risk Profile
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={biasData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                        <Radar
                          name="Profile"
                          dataKey="A"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.5}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Source Credibility */}
                <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
                  <h3 className="text-lg font-bold mb-4">Source Reliability</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/40">Trust Score</span>
                      <span className="font-bold">{result.sourceCredibility.score}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-1000" 
                        style={{ width: `${result.sourceCredibility.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/40 italic">
                      Based on historical reliability, domain authority, and transparency.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid (Visible when no result) */}
        {!result && !isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {[
              { icon: <Search className="text-emerald-500" />, title: "Fact-Checking", desc: "Cross-reference claims with verified global databases and real-time search." },
              { icon: <ShieldAlert className="text-amber-500" />, title: "Bias Detection", desc: "Identify partisan slant, emotional manipulation, and clickbait patterns." },
              { icon: <ImageIcon className="text-blue-500" />, title: "Multimodal Analysis", desc: "Analyze images and videos for deepfakes and contextual consistency." }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-[#111] border border-white/10 rounded-3xl hover:border-white/20 transition-all group">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-500 w-5 h-5" />
            <span className="font-bold tracking-tighter">VERITAS</span>
          </div>
          <p className="text-white/20 text-sm">
            © 2026 Veritas AI. Empowering truth in the digital age.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white transition-colors"><History className="w-5 h-5" /></a>
            <a href="#" className="text-white/40 hover:text-white transition-colors"><Info className="w-5 h-5" /></a>
            <a href="#" className="text-white/40 hover:text-white transition-colors"><TrendingUp className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

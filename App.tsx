
import React, { useState } from 'react';
import { analyzeNurturingFlow } from './services/geminiService';
import { EmailFlowContext, FlowGoal, Industry, Language, OptimizationResult, EmailInput } from './types';
import { 
  LayoutDashboard, Activity, FileSearch, Edit3, Grid, Layers, Target, 
  ChevronRight, Zap, Loader2, Star, CheckCircle2, AlertCircle, Trash2, Plus, 
  Languages, Mail, ArrowRight, BookOpen, Smartphone, ShieldCheck, BookMarked
} from 'lucide-react';

type ActivePage = 'dashboard' | 'health' | 'review' | 'rewrite' | 'hubspot';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [error, setError] = useState<string | null>(null);

  const [emails, setEmails] = useState<EmailInput[]>([
    { id: '1', content: '' },
    { id: '2', content: '' },
    { id: '3', content: '' }
  ]);

  const [context, setContext] = useState({
    industry: 'SaaS' as Industry,
    personaString: 'Head of Growth, Marketing Manager',
    goal: 'trial' as FlowGoal,
    language: 'EN' as Language
  });

  const handleAnalyze = async () => {
    if (emails.some(e => !e.content.trim())) {
      setError("Please fill in all email sequence contents.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const personas = context.personaString.split(',').map(p => p.trim()).filter(Boolean);
      const data = await analyzeNurturingFlow({ 
        ...context, 
        personas, 
        emails 
      });
      setResult(data);
      setActivePage('dashboard');
    } catch (err) {
      setError("Strategic audit failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const PageNav = ({ id, label, icon: Icon }: { id: ActivePage, label: string, icon: any }) => (
    <button 
      onClick={() => setActivePage(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
        activePage === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Layers className="text-white w-5 h-5" />
            </div>
            <h1 className="font-black text-slate-900 tracking-tight text-lg uppercase">
              Mouseflow <span className="text-indigo-600">Lab</span>
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Content Lead Auditor v3.2</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Analysis Pages</div>
          <PageNav id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <PageNav id="health" label="Flow Health" icon={Activity} />
          <PageNav id="review" label="Email-by-Email Review" icon={FileSearch} />
          <PageNav id="rewrite" label="Rewrite: Final Flow" icon={Edit3} />
          <PageNav id="hubspot" label="HubSpot Layout Blocks" icon={Grid} />
          
          <div className="mt-10 px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Configuration</div>
          <div className="px-4 space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Language</label>
              <select 
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                value={context.language}
                onChange={(e) => setContext({...context, language: e.target.value as Language})}
              >
                <option value="EN">English</option>
                <option value="PT-BR">Portuguese (BR)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Industry</label>
              <select 
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                value={context.industry}
                onChange={(e) => setContext({...context, industry: e.target.value as Industry})}
              >
                <option value="SaaS">SaaS</option>
                <option value="Ecommerce">Ecommerce</option>
                <option value="Finance">Finance</option>
                <option value="Automotive">Automotive</option>
                <option value="Telecom">Telecom</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => { setResult(null); setEmails([{id: '1', content: ''}, {id: '2', content: ''}, {id: '3', content: ''}]); }}
            className="w-full text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
          >
            Start New Audit
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* INPUT MODE */}
        {!result && (
          <div className="flex-1 overflow-y-auto p-10 bg-white">
            <div className="max-w-4xl mx-auto space-y-10 pb-20">
              <header className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Lifecycle Nurture Auditor</h2>
                <p className="text-slate-500 max-w-lg mx-auto text-sm">Optimize sequences for leads who've downloaded your educational materials. Bridge the gap from content value to product intent.</p>
              </header>

              <div className="bg-indigo-50/50 border border-indigo-100 rounded-[24px] p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <BookMarked className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Nurture Strategy Context</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Target Personas</label>
                    <input 
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none" 
                      placeholder="e.g. CRO Lead, Growth Manager"
                      value={context.personaString} 
                      onChange={e => setContext({...context, personaString: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Final Flow Goal</label>
                    <select 
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none" 
                      value={context.goal} 
                      onChange={e => setContext({...context, goal: e.target.value as FlowGoal})}
                    >
                      <option value="trial">Start Free Trial</option>
                      <option value="demo">Book Demo</option>
                      <option value="educational">Educational / Deep Consideration</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase text-sm tracking-tight">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    Email Sequence Content
                  </h3>
                  <button onClick={() => emails.length < 6 && setEmails([...emails, {id: String(Date.now()), content: ''}])} className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Email
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {emails.map((e, idx) => (
                    <div key={e.id} className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-100 focus-within:border-indigo-500 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase text-slate-400">Email {idx + 1}</span>
                        {emails.length > 1 && (
                          <button onClick={() => setEmails(emails.filter(item => item.id !== e.id))} className="text-slate-300 hover:text-rose-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <textarea 
                        className="w-full h-32 bg-white border border-slate-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 resize-none font-sans"
                        placeholder={`Paste draft content for email ${idx+1}...`}
                        value={e.content}
                        onChange={val => {
                          const next = [...emails];
                          next[idx].content = val.target.value;
                          setEmails(next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[24px] shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 transition-all hover:-translate-y-1"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Zap className="w-6 h-6 text-amber-400" />}
                AUDIT NURTURE SEQUENCE
              </button>
              {error && <p className="text-center text-rose-600 font-bold text-sm bg-rose-50 p-3 rounded-xl border border-rose-100">{error}</p>}
            </div>
          </div>
        )}

        {/* RESULT MODE */}
        {result && (
          <div className="flex-1 overflow-y-auto p-10">
            <div className="max-w-5xl mx-auto space-y-10 pb-20">
              
              {/* PAGE 1: DASHBOARD */}
              {activePage === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <section className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="p-12 flex-1 space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
                          <Star className="text-white w-8 h-8 fill-white" />
                        </div>
                        <div>
                          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Audit Dashboard</h2>
                          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{context.industry} Lead Flow</p>
                        </div>
                      </div>
                      <p className="text-xl text-slate-700 leading-relaxed font-medium italic">"{result.dashboard.verdict}"</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {result.dashboard.winsRisks.map((item, i) => (
                          <div key={i} className={`p-6 rounded-3xl border flex gap-4 ${item.type === 'win' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                            {item.type === 'win' ? <CheckCircle2 className="shrink-0 w-6 h-6" /> : <AlertCircle className="shrink-0 w-6 h-6" />}
                            <p className="text-sm font-bold">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-full md:w-80 bg-slate-900 text-white p-12 flex flex-col items-center justify-center text-center">
                      <div className="text-7xl font-black mb-2 tracking-tighter">{result.dashboard.score}</div>
                      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-10">Strategy Score</p>
                      <div className="w-full pt-8 border-t border-slate-800">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Priority Improvement</p>
                        <p className="text-sm font-medium leading-relaxed">{result.dashboard.fixFirst}</p>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* PAGE 2: FLOW HEALTH */}
              {activePage === 'health' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm space-y-6">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">Progression Integrity</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Logical Structure</span>
                          <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${result.flowHealth.logicalStructure === 'Yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {result.flowHealth.logicalStructure}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Momentum Drop Check</p>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.flowHealth.momentumCheck}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CTA & Intent Escalation</p>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.flowHealth.ctaProgression}</p>
                        </div>
                      </div>
                    </section>

                    <section className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm space-y-6">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">Sequence Improvements</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-sm italic text-indigo-900">
                          "{result.flowHealth.articleMix}"
                        </div>
                        <div className="space-y-3">
                          {result.flowHealth.improvements.map((imp, i) => (
                            <div key={i} className="flex gap-3 text-sm text-slate-600">
                              <span className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i+1}</span>
                              <p>{imp}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              )}

              {/* PAGE 3: REVIEW */}
              {activePage === 'review' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {result.emailReviews.map((rev, i) => (
                    <div key={i} className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                      <div className="w-full md:w-64 bg-slate-50 p-8 border-r border-slate-100">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black mb-4">E{i+1}</div>
                        <h4 className="font-black text-slate-900 text-lg mb-2 leading-tight">{rev.name}</h4>
                        <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-100 rounded text-indigo-600 uppercase tracking-widest">{rev.role}</span>
                        <div className="mt-8">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Positioning</p>
                          <p className={`text-xs font-bold ${rev.positioning === 'Correct' ? 'text-emerald-600' : 'text-amber-600'}`}>{rev.positioning}</p>
                        </div>
                      </div>
                      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Strengths</p>
                            <ul className="space-y-1.5">
                              {rev.whatWorks.map((item, j) => <li key={j} className="text-xs text-slate-600 flex gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" /> {item}</li>)}
                            </ul>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Audit Fixes</p>
                            <ul className="space-y-1.5">
                              {rev.toImprove.map((item, j) => <li key={j} className="text-xs text-slate-600 flex gap-2"><AlertCircle className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" /> {item}</li>)}
                            </ul>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className={`p-4 rounded-2xl border ${rev.ctaStrength.assessment === 'Strong' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">CTA Impact</p>
                            <p className="text-xs font-black uppercase mb-1">{rev.ctaStrength.assessment}</p>
                            <p className="text-[11px] font-medium italic text-slate-600 leading-relaxed">"{rev.ctaStrength.reasoning}"</p>
                          </div>
                          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Article Relevance</p>
                            <p className="text-xs font-bold mb-1">{rev.articleReview.status}</p>
                            <p className="text-[11px] text-slate-500 font-medium italic">"{rev.articleReview.reasoning}"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PAGE 4: REWRITE */}
              {activePage === 'rewrite' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
                  {result.rewrite.map((em, i) => (
                    <section key={i} className="bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border border-slate-800">
                      <div className="p-10 border-b border-slate-800 flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">{em.name}</div>
                          <div className="space-y-2">
                            {em.subjects.map((s, j) => (
                              <div key={j} className="text-lg font-black text-white flex gap-3">
                                <span className="text-slate-600 text-sm mt-1">{j+1}.</span> {s}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 max-w-xs w-full shrink-0">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Strategy Goal</p>
                          <p className="text-xs text-slate-300 italic">"{em.strategicPurpose}"</p>
                        </div>
                      </div>
                      <div className="p-10 lg:p-16 flex flex-col lg:flex-row gap-16">
                        <div className="flex-1 space-y-6">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest pb-4 border-b border-slate-800 flex items-center gap-2">
                            <Smartphone className="w-3 h-3 text-slate-600" /> Preheader: <span className="text-slate-400 normal-case italic font-medium">"{em.preheader}"</span>
                          </div>
                          <div className="whitespace-pre-wrap text-slate-200 text-base leading-relaxed font-sans prose prose-invert max-w-none">
                            {em.copy}
                          </div>
                        </div>
                        <div className="w-full lg:w-72 space-y-8">
                          {em.suggestedArticles.length > 0 && (
                            <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Article Themes</p>
                              <div className="space-y-3">
                                {em.suggestedArticles.map((art, j) => (
                                  <div key={j} className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 leading-snug">
                                    {art}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="pt-8 border-t border-slate-800">
                            <button className="w-full bg-blue-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-xl shadow-blue-900/50 hover:bg-blue-500 transition-colors">
                              Primary Action <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  ))}
                </div>
              )}

              {/* PAGE 5: HUBSPOT */}
              {activePage === 'hubspot' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
                  {result.hubspotLayout.map((em, i) => (
                    <section key={i} className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col">
                      <div className="flex items-center gap-3 mb-8">
                        <Grid className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">{em.emailName} Layout</h3>
                      </div>
                      <div className="space-y-6 flex-1">
                        {em.blocks.map((block, j) => (
                          <div key={j} className="relative pl-6 border-l-2 border-slate-100 py-1">
                            <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-slate-200 border border-white"></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{block.label}</p>
                            <p className="text-xs font-bold text-slate-700 leading-relaxed">{block.content}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <p className="text-[10px] font-bold text-slate-500 uppercase">HubSpot Editor Compatible</p>
                      </div>
                    </section>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

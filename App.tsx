import React, { useState } from 'react';
import ParticleBackground from './components/ParticleBackground';
import GlassPanel from './components/GlassPanel';
import { CodeLanguage, ProcessMode, ProcessingState } from './types';
import { processCodeWithGemini } from './services/geminiService';
import { 
  Code2, 
  Lock, 
  Unlock, 
  Rocket, 
  Zap, 
  Copy, 
  Check, 
  Terminal,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

const App: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [language, setLanguage] = useState<CodeLanguage>(CodeLanguage.PHP);
  const [mode, setMode] = useState<ProcessMode>(ProcessMode.OBFUSCATE);
  const [state, setState] = useState<ProcessingState>({ isLoading: false, error: null });
  const [copied, setCopied] = useState(false);

  const handleProcess = async () => {
    if (!inputCode.trim()) {
      setState({ isLoading: false, error: "请输入需要处理的代码数据。" });
      return;
    }

    setState({ isLoading: true, error: null });
    try {
      const result = await processCodeWithGemini(inputCode, language, mode);
      setOutputCode(result);
    } catch (err: any) {
      setState({ 
        isLoading: false, 
        error: err.message || "未知错误 (Unknown Error)" 
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen text-gray-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12 flex flex-col h-screen max-h-screen overflow-hidden">
        
        {/* Header */}
        <header className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Rocket className="w-8 h-8 text-blue-400 animate-pulse" />
            <h1 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 tracking-wider">
              星际代码核心
            </h1>
          </div>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            StarCode Core // <span className="text-blue-500">System Online</span>
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">
          
          {/* Controls Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto pr-1">
            <GlassPanel className="h-full flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Language Selector */}
                <div>
                  <label className="block text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> 目标语言
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.values(CodeLanguage).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`
                          relative px-4 py-3 text-left rounded-lg border transition-all duration-300 group
                          ${language === lang 
                            ? 'bg-blue-600/20 border-blue-500/50 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{lang}</span>
                          {language === lang && <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_currentColor]"></div>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode Selector */}
                <div>
                  <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> 操作模式
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setMode(ProcessMode.OBFUSCATE)}
                      className={`
                        flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-300
                        ${mode === ProcessMode.OBFUSCATE
                          ? 'bg-purple-600/20 border-purple-500/50 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'}
                      `}
                    >
                      <Lock className="w-6 h-6 mb-2" />
                      <span className="text-xs font-bold">混淆/加密</span>
                    </button>
                    <button
                      onClick={() => setMode(ProcessMode.DEOBFUSCATE)}
                      className={`
                        flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-300
                        ${mode === ProcessMode.DEOBFUSCATE
                          ? 'bg-green-600/20 border-green-500/50 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'}
                      `}
                    >
                      <Unlock className="w-6 h-6 mb-2" />
                      <span className="text-xs font-bold">解密/还原</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button
                  onClick={handleProcess}
                  disabled={state.isLoading}
                  className={`
                    w-full py-4 rounded-lg font-bold text-lg uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2
                    ${state.isLoading 
                      ? 'bg-gray-700 cursor-not-allowed text-gray-500' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-blue-500/25 active:scale-95'}
                  `}
                >
                  {state.isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      执行操作
                    </>
                  )}
                </button>
                {state.error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-200 text-xs text-center">
                    {state.error}
                  </div>
                )}
              </div>
            </GlassPanel>
          </div>

          {/* Editors */}
          <div className="lg:col-span-9 flex flex-col lg:flex-row gap-6 h-full min-h-0">
            
            {/* Input Editor */}
            <GlassPanel className="flex-1 flex flex-col min-h-[300px] lg:min-h-0">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" /> 源代码输入
                </label>
                <div className="flex gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {language}
                  </span>
                </div>
              </div>
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder={`在此粘贴您的 ${language} 代码...`}
                className="flex-1 w-full bg-black/20 text-gray-300 font-mono text-sm p-4 rounded-lg border border-white/5 focus:border-blue-500/50 focus:bg-black/30 outline-none resize-none placeholder-gray-600 transition-colors scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                spellCheck={false}
              />
            </GlassPanel>

            {/* Output Editor */}
            <GlassPanel className="flex-1 flex flex-col min-h-[300px] lg:min-h-0 relative">
               {/* Loading Overlay */}
               {state.isLoading && (
                  <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-blue-300">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <div className="text-sm font-mono animate-pulse">正在连接核心主机...</div>
                    <div className="text-xs text-blue-500/70 mt-2 font-mono">Quantum Processing</div>
                  </div>
               )}

              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" /> 
                  {mode === ProcessMode.OBFUSCATE ? '混淆结果' : '解密结果'}
                </label>
                <button
                  onClick={copyToClipboard}
                  disabled={!outputCode}
                  className={`
                    flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all
                    ${copied 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}
                  `}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? '已复制' : '复制'}
                </button>
              </div>
              <textarea
                value={outputCode}
                readOnly
                placeholder="等待处理结果..."
                className="flex-1 w-full bg-black/40 text-green-400 font-mono text-sm p-4 rounded-lg border border-white/5 focus:border-purple-500/50 outline-none resize-none placeholder-gray-700 transition-colors scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                spellCheck={false}
              />
            </GlassPanel>

          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
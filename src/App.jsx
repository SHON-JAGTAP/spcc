import React, { useState } from 'react';
import Editor from './components/Editor';
import Console from './components/Console';
import SymbolTable from './components/SymbolTable';
import CodeViewer from './components/CodeViewer';
import { tokenize } from './assembler/tokenizer';
import { parse } from './assembler/parser';
import { execute } from './assembler/engine';
import { generateCodes } from './assembler/generator';
import { getErrorResolution } from './assembler/errors';

const DEFAULT_CODE = `NUM1: DATA 5
NUM2: DATA 10

START: MOV A, NUM1
       ADD A, NUM2
       PRINT A
       HLT`;

const TABS = [
  { id: 'symbols', label: '🗂 Registers', color: 'indigo' },
  { id: 'ic', label: '🔄 Intermediate', color: 'purple' },
  { id: 'mc', label: '💾 Machine Code', color: 'blue' },
];

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(null);
  const [errorResolution, setErrorResolution] = useState(null);
  const [statements, setStatements] = useState(null);
  const [ic, setIc] = useState([]);
  const [mc, setMc] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('symbols');
  const [state, setState] = useState({
    registers: { A: 0, B: 0, R1: 0, R2: 0 },
    symbolTable: {}
  });

  const reset = () => {
    setError(null); setErrorResolution(null); setOutput([]);
    setStatements(null); setIc([]); setMc([]);
    setState({ registers: { A: 0, B: 0, R1: 0, R2: 0 }, symbolTable: {} });
  };

  const handleAssemble = () => {
    reset();
    try {
      const tokens = tokenize(code);
      const parsed = parse(tokens);
      setStatements(parsed);
      const generated = generateCodes(parsed);
      setIc(generated.ic);
      setMc(generated.mc);
      setOutput(['✅ Assembly successful. Ready to run.']);
    } catch (err) {
      setError(err.message);
      setErrorResolution(getErrorResolution(err.message));
    }
  };

  const handleRun = async () => {
    if (!statements) return;
    setIsRunning(true);
    setError(null); setErrorResolution(null);
    setOutput(['🚀 Starting execution...']);
    try {
      await execute(
        statements,
        (msg) => setOutput(prev => [...prev, msg]),
        (newState) => setState(newState),
        () => setIsRunning(false)
      );
    } catch (err) {
      setError(err.message);
      setErrorResolution(getErrorResolution(err.message));
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setCode('');
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-5" style={{ height: 'calc(100vh - 40px)' }}>

        {/* ── Header ── */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-none">
                WEBASM SIMULATOR
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Assembly Simulator · IC & Machine Code Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              v2.0 · Ready
            </div>
          </div>
        </header>

        {/* ── Main Grid ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">

          {/* Left: Editor + Console */}
          <div className="lg:col-span-5 flex flex-col gap-4 h-full">
            <div className="flex-1 min-h-0">
              <Editor
                code={code} setCode={setCode}
                onAssemble={handleAssemble}
                onRun={handleRun}
                onClear={handleClear}
                isRunning={isRunning}
                isAssembled={statements !== null}
              />
            </div>
            <div className="h-56 shrink-0">
              <Console output={output} error={error} errorResolution={errorResolution} />
            </div>
          </div>

          {/* Right: Tabbed Panel */}
          <div className="lg:col-span-7 flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">

            {/* Tab Bar */}
            <div className="flex border-b border-gray-100 bg-gray-50/80">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-3 text-sm font-semibold transition-all border-b-2 ${activeTab === tab.id
                      ? 'bg-white text-indigo-600 border-indigo-500 shadow-sm'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-white/60'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden p-5">
              {activeTab === 'symbols' && (
                <SymbolTable symbolTable={state.symbolTable} registers={state.registers} />
              )}
              {activeTab === 'ic' && (
                <CodeViewer data={ic} label="Intermediate Code" />
              )}
              {activeTab === 'mc' && (
                <CodeViewer data={mc} label="Machine Code" />
              )}
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <footer className="text-center text-xs text-gray-400 pb-1">
          MiniASM · Supports <code className="bg-gray-100 px-1 py-0.5 rounded">DATA</code>&nbsp;
          <code className="bg-gray-100 px-1 py-0.5 rounded">MOV</code>&nbsp;
          <code className="bg-gray-100 px-1 py-0.5 rounded">ADD</code>&nbsp;
          <code className="bg-gray-100 px-1 py-0.5 rounded">SUB</code>&nbsp;
          <code className="bg-gray-100 px-1 py-0.5 rounded">PRINT</code>&nbsp;
          <code className="bg-gray-100 px-1 py-0.5 rounded">HLT</code>
        </footer>
      </div>
    </div>
  );
}

export default App;

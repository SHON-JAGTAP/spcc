import React from 'react';

export default function Editor({ code, setCode, onAssemble, onRun, onClear, isRunning, isAssembled }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="flex items-center gap-2">
          <span className="text-xl">💻</span>
          <span className="font-bold text-white text-sm tracking-wide">Assembly Editor</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="px-3.5 py-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all border border-white/30"
          >
            🗑 Clear
          </button>
          <button
            onClick={onAssemble}
            disabled={isRunning}
            className="px-4 py-1.5 text-xs font-semibold bg-white text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 rounded-lg transition-all shadow-sm"
          >
            🔧 Assemble
          </button>
          <button
            onClick={onRun}
            disabled={!isAssembled || isRunning}
            className="px-4 py-1.5 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-white rounded-lg transition-all shadow-sm flex items-center gap-1.5"
          >
            {isRunning ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running...
              </>
            ) : '▶ Run'}
          </button>
        </div>
      </div>

      {/* Instruction hint bar */}
      <div className="px-5 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center gap-4 flex-wrap">
        {['DATA', 'MOV', 'ADD', 'SUB', 'PRINT', 'HLT'].map(op => (
          <span key={op} className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-100 px-2 py-0.5 rounded-md">{op}</span>
        ))}
        <span className="text-xs text-gray-400 ml-auto italic">e.g.  NUM: DATA 5 &nbsp;|&nbsp; MOV A, NUM</span>
      </div>

      {/* Code Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line numbers */}
        <div className="py-4 pl-3 pr-2 select-none font-mono text-xs text-gray-300 leading-relaxed bg-gray-50 border-r border-gray-100 text-right min-w-[36px]">
          {code.split('\n').map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        {/* Textarea */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
          className="flex-1 p-4 bg-white text-gray-800 font-mono text-sm resize-none focus:outline-none leading-relaxed placeholder-gray-300"
          placeholder={"Enter code here...\n\nNUM1: DATA 5\nSTART: MOV A, NUM1\n       PRINT A\n       HLT"}
        />
      </div>
    </div>
  );
}

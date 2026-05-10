import React, { useRef, useEffect } from 'react';

export default function Console({ output, error, errorResolution }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output, error]);

  const isSuccess = output.some(m => m.includes('successful'));
  const isHalted = output.some(m => m.includes('Halted'));

  return (
    <div className="flex flex-col gap-3 w-full h-full">
      {/* Output Panel */}
      <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden flex flex-col shadow-md">
        <div className="flex items-center gap-2 px-5 py-3 bg-gray-800 border-b border-gray-700">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 font-semibold text-gray-300 text-sm">Output Console</span>
          {isSuccess && !isHalted && (
            <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              ✓ Assembled
            </span>
          )}
          {isHalted && (
            <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
              ⏹ Halted
            </span>
          )}
        </div>
        <div className="p-5 flex-1 overflow-y-auto font-mono text-sm leading-7 bg-gray-950">
          {output.length === 0 ? (
            <div className="text-gray-600 italic text-center mt-4">No output yet. Click Assemble → Run.</div>
          ) : (
            output.map((msg, i) => {
              const isOutputLine = msg.startsWith('OUTPUT:');
              const isHaltLine = msg.includes('Halted');
              const isStartLine = msg.includes('Starting') || msg.includes('successful');
              return (
                <div key={i} className={`flex items-start gap-2 py-0.5 ${
                  isOutputLine ? 'text-yellow-300 font-bold' :
                  isHaltLine ? 'text-red-400' :
                  isStartLine ? 'text-emerald-400' :
                  'text-green-300'
                }`}>
                  <span className="text-gray-600 select-none mt-0.5">{'>'}</span>
                  <span>{msg}</span>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Error Panel */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-sm">
          <div className="font-bold text-red-600 mb-1 flex items-center gap-2 text-sm">
            <span>⚠️</span> Error Detected
          </div>
          <div className="font-mono text-red-700 text-sm mb-2">{error}</div>
          {errorResolution && (
            <div className="mt-2 pt-2 border-t border-red-200 text-sm text-red-600">
              <span className="font-semibold">💡 How to fix:</span> {errorResolution}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

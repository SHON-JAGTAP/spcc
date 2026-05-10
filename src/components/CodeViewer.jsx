import React from 'react';

const STEP_COLORS = [
  'bg-indigo-50 border-indigo-200 text-indigo-800',
  'bg-purple-50 border-purple-200 text-purple-800',
  'bg-blue-50 border-blue-200 text-blue-800',
  'bg-cyan-50 border-cyan-200 text-cyan-800',
  'bg-teal-50 border-teal-200 text-teal-800',
];

export default function CodeViewer({ data, label }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        {data.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm italic">
            <div className="text-4xl mb-3">📭</div>
            Click <strong>Assemble</strong> to generate {label || 'code'}.
          </div>
        ) : (
          <div>
            {data.map((item, i) => (
              <div key={i} className={`flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors`}>
                <span className="text-gray-300 font-mono text-xs w-8 text-right select-none shrink-0">{item.line}</span>
                <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border font-mono ${STEP_COLORS[i % STEP_COLORS.length]}`}>
                  LC {String(i).padStart(2, '0')}
                </div>
                <span className="font-mono text-sm text-gray-800 flex-1">{item.code}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

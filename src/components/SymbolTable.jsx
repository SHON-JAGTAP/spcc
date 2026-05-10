import React from 'react';

const REG_COLORS = {
  A: 'from-indigo-400 to-indigo-600',
  B: 'from-purple-400 to-purple-600',
  R1: 'from-blue-400 to-blue-600',
  R2: 'from-cyan-400 to-cyan-600',
};

export default function SymbolTable({ symbolTable, registers }) {
  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto">
      {/* Registers */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🗂</span>
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Registers</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(registers).map(([reg, val]) => (
            <div key={reg} className={`bg-gradient-to-br ${REG_COLORS[reg] || 'from-gray-400 to-gray-600'} rounded-xl p-4 text-white shadow-sm flex justify-between items-center`}>
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">{reg}</span>
              <span className="text-2xl font-mono font-bold">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-200"></div>

      {/* Symbol Table */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📋</span>
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Memory Variables</h3>
        </div>

        {Object.keys(symbolTable).length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No variables in memory yet.<br />
            <span className="text-xs mt-1 block">Define with: <code className="bg-gray-100 px-1 rounded">NUM: DATA 10</code></span>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700">
                  <th className="py-2.5 px-4 font-semibold text-left text-xs uppercase tracking-wider">Name</th>
                  <th className="py-2.5 px-4 font-semibold text-left text-xs uppercase tracking-wider">Value</th>
                  <th className="py-2.5 px-4 font-semibold text-left text-xs uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(symbolTable).map(([sym, val], i) => (
                  <tr key={sym} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} border-t border-gray-100 hover:bg-indigo-50/30 transition-colors`}>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">{sym}</td>
                    <td className="py-3 px-4 font-mono text-gray-800 font-semibold">{val}</td>
                    <td className="py-3 px-4">
                      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">INT</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

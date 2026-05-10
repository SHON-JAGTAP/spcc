export function generateCodes(statements) {
  const ic = [];
  const mc = [];
  
  const opcodes = { MOV: '01', ADD: '02', SUB: '03', PRINT: '04', HLT: '05', DATA: '00' };
  const regCodes = { A: '1', B: '2', R1: '3', R2: '4' };

  let lc = 0;
  const symTable = {};
  let symIndex = 0;

  // Pass 1: Build symbol table mapping
  for (const stmt of statements) {
    if (stmt.label && stmt.type === 'DATA') {
      if (!symTable[stmt.label]) symTable[stmt.label] = { idx: symIndex++, val: stmt.value, addr: lc };
    }
    if (stmt.type !== 'LABEL_ONLY') lc++;
  }

  // Also collect usage for symbols
  for (const stmt of statements) {
    if (stmt.sourceType === 'VAR' && !symTable[stmt.source]) {
      symTable[stmt.source] = { idx: symIndex++, val: 0, addr: -1 }; 
    }
  }

  // Optional: resolve forward references (simple implementation)
  lc = 0;
  for (const stmt of statements) {
    if (stmt.label && stmt.type !== 'DATA' && symTable[stmt.label]) {
      symTable[stmt.label].addr = lc;
    }
    if (stmt.type !== 'LABEL_ONLY') lc++;
  }

  lc = 0;
  for (const stmt of statements) {
    if (stmt.type === 'LABEL_ONLY') continue;

    let icLine = `(LC, ${lc.toString().padStart(2, '0')}) `;
    let mcLine = `${lc.toString().padStart(3, '0')} `;

    if (stmt.type === 'DATA') {
      icLine += `(DL, 01) (C, ${stmt.value})`;
      mcLine += `+ 00 0 ${stmt.value.toString().padStart(3, '0')}`;
    } else if (['MOV', 'ADD', 'SUB'].includes(stmt.type)) {
      const op = opcodes[stmt.type];
      const reg = regCodes[stmt.target] || '0';
      icLine += `(IS, ${op}) (${reg}) `;
      mcLine += `+ ${op} ${reg} `;

      if (stmt.sourceType === 'LITERAL') {
        icLine += `(C, ${stmt.source})`;
        mcLine += `${stmt.source.toString().padStart(3, '0')}`;
      } else {
        const sym = symTable[stmt.source];
        icLine += `(S, ${sym ? sym.idx : '?'})`;
        mcLine += `${sym && sym.addr !== -1 ? sym.addr.toString().padStart(3, '0') : '000'}`;
      }
    } else if (stmt.type === 'PRINT') {
      const op = opcodes[stmt.type];
      const reg = regCodes[stmt.target] || '0';
      icLine += `(IS, ${op}) (${reg})`;
      mcLine += `+ ${op} ${reg} 000`;
    } else if (stmt.type === 'HLT') {
      icLine += `(IS, 05)`;
      mcLine += `+ 05 0 000`;
    }
    
    ic.push({ line: stmt.line, code: icLine });
    mc.push({ line: stmt.line, code: mcLine });
    lc++;
  }

  return { ic, mc, symTable };
}

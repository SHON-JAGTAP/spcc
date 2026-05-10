export async function execute(statements, onPrint, onStateUpdate, onHalt) {
  const symbolTable = {};
  const registers = { A: 0, B: 0, R1: 0, R2: 0 }; 

  // First pass: collect DATA
  for (const stmt of statements) {
    if (stmt.type === 'DATA') {
      if (symbolTable[stmt.label] !== undefined) {
        throw new Error(`Line ${stmt.line}: Variable '${stmt.label}' is already defined`);
      }
      symbolTable[stmt.label] = stmt.value;
    } else if (stmt.label) {
      // Just register label to avoid undefined variable error if referenced (though we don't have jumps)
      symbolTable[stmt.label] = 0; 
    }
  }

  onStateUpdate({ symbolTable: { ...symbolTable }, registers: { ...registers } });

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // Second pass: execution
  for (const stmt of statements) {
    if (stmt.type === 'DATA' || stmt.type === 'LABEL_ONLY') continue;
    
    await delay(300);

    function getVal(source, type, line) {
      if (type === 'LITERAL') return source;
      if (registers[source] !== undefined) return registers[source];
      if (symbolTable[source] !== undefined) return symbolTable[source];
      throw new Error(`Line ${line}: Undefined variable or register '${source}'`);
    }

    function setTarget(target, value, line) {
      if (registers[target] !== undefined) {
        registers[target] = value;
        onPrint(`${target} = ${value}`);
      } else if (symbolTable[target] !== undefined) {
        symbolTable[target] = value;
        onPrint(`${target} = ${value}`);
      } else {
        throw new Error(`Line ${line}: Undefined variable or register '${target}'`);
      }
    }

    if (stmt.type === 'MOV') {
      const val = getVal(stmt.source, stmt.sourceType, stmt.line);
      setTarget(stmt.target, val, stmt.line);
    } else if (stmt.type === 'ADD') {
      const val = getVal(stmt.source, stmt.sourceType, stmt.line);
      const targetVal = getVal(stmt.target, 'VAR', stmt.line);
      setTarget(stmt.target, targetVal + val, stmt.line);
    } else if (stmt.type === 'SUB') {
      const val = getVal(stmt.source, stmt.sourceType, stmt.line);
      const targetVal = getVal(stmt.target, 'VAR', stmt.line);
      setTarget(stmt.target, targetVal - val, stmt.line);
    } else if (stmt.type === 'PRINT') {
      const val = getVal(stmt.target, 'VAR', stmt.line);
      onPrint(`OUTPUT: ${val}`);
    } else if (stmt.type === 'HLT') {
      onPrint('Program Halted');
      onHalt();
      break;
    }
    
    onStateUpdate({ symbolTable: { ...symbolTable }, registers: { ...registers } });
  }
}

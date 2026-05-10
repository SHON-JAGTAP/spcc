export function parse(tokens) {
  const statements = [];
  let i = 0;

  while (i < tokens.length) {
    // Skip empty lines
    while (i < tokens.length && tokens[i].type === 'NEWLINE') i++;
    if (i >= tokens.length) break;

    const lineNum = tokens[i].line;
    let label = null;

    // Check for label
    if (tokens[i].type === 'IDENTIFIER' && i + 1 < tokens.length && tokens[i+1].type === 'COLON') {
      label = tokens[i].value;
      i += 2; // skip IDENTIFIER and COLON
    }

    // After label, could be end of line or an instruction
    if (tokens[i].type === 'NEWLINE') {
      if (label) {
        statements.push({ type: 'LABEL_ONLY', label, line: lineNum });
      }
      continue;
    }

    if (tokens[i].type !== 'IDENTIFIER') {
      throw new Error(`Line ${tokens[i].line}: Expected instruction, got ${tokens[i].type}`);
    }

    const instr = tokens[i].value;
    i++;

    // Optional LPAREN for backward compatibility
    let hasParens = false;
    if (i < tokens.length && tokens[i].type === 'LPAREN') {
      hasParens = true;
      i++;
    }

    if (instr === 'DATA') {
      if (i < tokens.length && tokens[i].type === 'LPAREN') { hasParens = true; i++; } // support DATA(X,5) or LABEL: DATA 5
      
      // If no label from "LABEL:", check if they used old "DATA(X,5)" syntax
      let dataLabel = label;
      if (!dataLabel) {
        if (tokens[i].type === 'IDENTIFIER' && i + 1 < tokens.length && tokens[i+1].type === 'COMMA') {
          dataLabel = tokens[i].value;
          i += 2; // Skip ID, COMMA
        } else {
          throw new Error(`Line ${lineNum}: DATA instruction requires a label (e.g., NUM1: DATA 5)`);
        }
      }

      if (i >= tokens.length || tokens[i].type !== 'NUMBER') {
        throw new Error(`Line ${lineNum}: DATA expects a number`);
      }
      const val = tokens[i].value;
      i++;
      
      if (hasParens) {
        if (i < tokens.length && tokens[i].type === 'RPAREN') i++;
      }

      statements.push({ type: 'DATA', label: dataLabel, value: val, line: lineNum });
    } else if (['MOV', 'ADD', 'SUB'].includes(instr)) {
      if (i >= tokens.length || tokens[i].type !== 'IDENTIFIER') {
        throw new Error(`Line ${lineNum}: Expected target register for ${instr}`);
      }
      const target = tokens[i].value;
      i++;

      if (i < tokens.length && tokens[i].type === 'COMMA') i++;

      if (i >= tokens.length || (tokens[i].type !== 'IDENTIFIER' && tokens[i].type !== 'NUMBER')) {
        throw new Error(`Line ${lineNum}: Expected source variable or number for ${instr}`);
      }
      const sourceToken = tokens[i];
      i++;
      
      if (hasParens) {
        if (i < tokens.length && tokens[i].type === 'RPAREN') i++;
      }

      statements.push({ 
        type: instr, 
        label,
        target, 
        sourceType: sourceToken.type === 'IDENTIFIER' ? 'VAR' : 'LITERAL',
        source: sourceToken.value, 
        line: lineNum 
      });
    } else if (instr === 'PRINT') {
      if (i >= tokens.length || tokens[i].type !== 'IDENTIFIER') {
        throw new Error(`Line ${lineNum}: PRINT expects a target register/variable`);
      }
      const target = tokens[i].value;
      i++;

      if (hasParens) {
        if (i < tokens.length && tokens[i].type === 'RPAREN') i++;
      }

      statements.push({ type: 'PRINT', label, target, line: lineNum });
    } else if (instr === 'HLT') {
      if (hasParens) {
        if (i < tokens.length && tokens[i].type === 'RPAREN') i++;
      }
      statements.push({ type: 'HLT', label, line: lineNum });
    } else {
      throw new Error(`Line ${lineNum}: Invalid instruction '${instr}'`);
    }

    // Expect end of line
    if (i < tokens.length && tokens[i].type !== 'NEWLINE') {
      throw new Error(`Line ${lineNum}: Unexpected token '${tokens[i].value}' after instruction`);
    }
  }

  return statements;
}

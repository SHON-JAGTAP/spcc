export function tokenize(input) {
  const lines = input.split('\n');
  const tokens = [];

  for (let lineNum = 1; lineNum <= lines.length; lineNum++) {
    const lineStr = lines[lineNum - 1];
    let i = 0;
    while (i < lineStr.length) {
      let char = lineStr[i];
      if (/\s/.test(char)) { i++; continue; }
      
      if (char === ';') { break; } // Comments
      if (char === '/' && lineStr[i+1] === '/') { break; } // Comments
      
      if (char === ':') { tokens.push({ type: 'COLON', value: ':', line: lineNum }); i++; continue; }
      if (char === ',') { tokens.push({ type: 'COMMA', value: ',', line: lineNum }); i++; continue; }
      
      // Keep support for parenthesis if we want backward compatibility, but maybe optional
      if (char === '(') { tokens.push({ type: 'LPAREN', value: '(', line: lineNum }); i++; continue; }
      if (char === ')') { tokens.push({ type: 'RPAREN', value: ')', line: lineNum }); i++; continue; }
      
      if (/[a-zA-Z_]/.test(char)) {
        let value = '';
        while (i < lineStr.length && /[a-zA-Z0-9_]/.test(lineStr[i])) {
          value += lineStr[i];
          i++;
        }
        tokens.push({ type: 'IDENTIFIER', value: value.toUpperCase(), line: lineNum });
        continue;
      }
      
      if (/[0-9]/.test(char) || (char === '-' && /[0-9]/.test(lineStr[i+1]))) {
        let value = '';
        if (char === '-') { value += '-'; i++; }
        while (i < lineStr.length && /[0-9]/.test(lineStr[i])) {
          value += lineStr[i];
          i++;
        }
        tokens.push({ type: 'NUMBER', value: parseInt(value, 10), line: lineNum });
        continue;
      }

      throw new Error(`Line ${lineNum}: Invalid character '${char}'`);
    }
    tokens.push({ type: 'NEWLINE', value: '\n', line: lineNum });
  }
  return tokens;
}

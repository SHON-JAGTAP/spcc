export function getErrorResolution(errorMessage) {
  if (!errorMessage) return null;

  if (errorMessage.includes("Invalid character")) {
    const charMatch = errorMessage.match(/Invalid character '(.+)'/);
    const char = charMatch ? charMatch[1] : '';
    if (char === ':') {
      return "Colons are not supported in MiniASM. Please remove any labels or prefix text like 'Input:'.";
    }
    return `The character '${char}' is not recognized by the assembler. Make sure to only use letters, numbers, parentheses, and commas.`;
  }
  
  if (errorMessage.includes("Expected instruction")) {
    return "Every executable line must start with a valid instruction (e.g., MOV, ADD, PRINT) or a DATA definition.";
  }

  if (errorMessage.includes("Invalid instruction")) {
    return "Check for typos. Supported instructions are: DATA, MOV, ADD, SUB, PRINT, and HLT.";
  }

  if (errorMessage.includes("Expected IDENTIFIER or NUMBER")) {
    return "An instruction is missing an argument, or the argument type is incorrect. For example, ADD(R1, A) requires a register and a variable/number.";
  }

  if (errorMessage.includes("Expected LPAREN")) {
    return "Instructions must be followed by an opening parenthesis. Example: MOV(R1, A)";
  }

  if (errorMessage.includes("Expected RPAREN")) {
    return "Missing a closing parenthesis at the end of the instruction. Example: HLT()";
  }

  if (errorMessage.includes("Expected COMMA")) {
    return "Arguments must be separated by a comma. Example: MOV(R1, A)";
  }

  if (errorMessage.includes("is already defined")) {
    return "You are trying to define a variable with DATA() more than once. Use a different name for the new variable.";
  }

  if (errorMessage.includes("Undefined variable or register")) {
    return "You are trying to use a variable or register that doesn't exist. Check for typos, or make sure the variable is defined first using DATA(Name, Value). Valid registers are R1, R2, R3, R4.";
  }

  if (errorMessage.includes("Unexpected end of input")) {
    return "The code ended unexpectedly. Check if you forgot to close a parenthesis or finish an instruction.";
  }

  return "Review your syntax and ensure it strictly follows the MiniASM rules (e.g., INSTR(ARG1, ARG2)).";
}

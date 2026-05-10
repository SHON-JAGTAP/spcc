# ⚙️ WEBASM SIMULATOR

> A web-based Mini Assembler Simulator built for SPCC (Systems Programming & Compiler Construction) — visualizing the complete pipeline from Assembly source code to Intermediate Code and Machine Code, in real time.

![Version](https://img.shields.io/badge/version-2.0-indigo)
![React](https://img.shields.io/badge/React-18-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-cyan)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📌 Problem Statement

Students studying assembler design in SPCC lack an **interactive tool** to visualize the complete assembler pipeline — from reading source code to generating machine code. This simulator bridges that gap by making every step hands-on and visual.

---

## 🎯 Features

| Feature | Description |
|---|---|
| 🔤 **Lexical Analysis** | Tokenizes the input source code line by line |
| 🌳 **Syntax Validation** | Parses tokens and validates instruction structure |
| 📋 **Symbol Table** | Builds a symbol table from `DATA` label definitions |
| 🔄 **Intermediate Code** | Generates IC with location counter (LC) and operand types |
| 💾 **Machine Code** | Generates binary-style machine code with opcodes |
| ▶️ **Step-by-step Execution** | Executes instructions and updates registers live |
| ⚠️ **Error Detection & Resolution** | Detects errors and suggests how to fix them |
| 🖥️ **Output Console** | Terminal-style console showing execution output |

---

## 🗣️ Supported Instructions

| Instruction | Syntax | Description |
|---|---|---|
| `DATA` | `LABEL: DATA value` | Declare a variable in memory |
| `MOV` | `MOV reg, src` | Move a value into a register |
| `ADD` | `ADD reg, src` | Add source to register |
| `SUB` | `SUB reg, src` | Subtract source from register |
| `PRINT` | `PRINT reg` | Print register value to console |
| `HLT` | `HLT` | Halt the program |

**Registers available:** `A`, `B`, `R1`, `R2`

---

## 📝 Example Program

```asm
NUM1: DATA 5
NUM2: DATA 10

START: MOV A, NUM1
       ADD A, NUM2
       PRINT A
       HLT
```

**Expected Output:**
```
A = 5
A = 15
OUTPUT: 15
Program Halted
```

---

## 🏗️ Project Architecture

```
src/
├── assembler/
│   ├── tokenizer.js     → Lexical Analysis — breaks source into tokens
│   ├── parser.js        → Syntax Analysis — validates grammar, builds AST
│   ├── engine.js        → Execution Engine — runs statements, manages registers
│   ├── generator.js     → IC & MC Generator — two-pass code generation
│   └── errors.js        → Error Handler — maps errors to human-readable hints
│
├── components/
│   ├── Editor.jsx       → Code editor with line numbers and action buttons
│   ├── Console.jsx      → Terminal-style output console
│   ├── SymbolTable.jsx  → Registers and memory variable viewer
│   └── CodeViewer.jsx   → Intermediate and Machine Code viewer
│
├── App.jsx              → Main application layout and state management
└── index.css            → Global styles using Tailwind CSS
```

---

## ⚙️ Two-Pass Assembler Design

### Pass 1 — Symbol Table Construction
- Scans all `DATA` label definitions
- Assigns memory addresses to each variable
- Registers instruction labels for future use

### Pass 2 — Code Generation & Execution
- Maps instructions to opcodes (`MOV=01`, `ADD=02`, `SUB=03`, `PRINT=04`, `HLT=05`)
- Resolves variable references from the symbol table
- Generates Intermediate Code (LC, type, operand notation)
- Generates Machine Code (address + opcode + register + operand)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or above
- npm

### Installation & Run

```bash
# Clone or navigate to the project folder
cd spcc

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🔢 Opcode Table

| Instruction | Opcode | Register Codes |
|---|---|---|
| DATA | `00` | — |
| MOV | `01` | A=1, B=2, R1=3, R2=4 |
| ADD | `02` | A=1, B=2, R1=3, R2=4 |
| SUB | `03` | A=1, B=2, R1=3, R2=4 |
| PRINT | `04` | A=1, B=2, R1=3, R2=4 |
| HLT | `05` | — |

**Machine Code Format:**  
`[LC] + [OPCODE] [REG] [OPERAND_ADDRESS]`

---

## ❌ Error Handling

The simulator detects and explains common errors:

| Error | Cause | Resolution shown |
|---|---|---|
| Invalid character | Special character like `:` used incorrectly | Remove unsupported characters |
| Invalid instruction | Typo in opcode | Use DATA, MOV, ADD, SUB, PRINT, HLT |
| Undefined variable | Variable used before DATA definition | Add `NAME: DATA value` before use |
| Missing parenthesis | Wrong syntax style | Use space-separated syntax |
| Duplicate variable | Same label defined twice | Use unique label names |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework and component state |
| **Tailwind CSS v4** | Styling and responsive layout |
| **Vite** | Development server and build tool |
| **Vanilla JS** | Assembler logic (tokenizer, parser, engine) |

---

## 👨‍💻 Presentation Flow (Demo Steps)

1. Open the app — default code is pre-loaded
2. Click **🔧 Assemble** → Show symbol table built, IC and MC generated
3. Switch to **🔄 Intermediate** tab → explain LC and operand notation
4. Switch to **💾 Machine Code** tab → explain opcodes and addresses
5. Click **▶️ Run** → watch registers update live in the console
6. Introduce an error (type `INVALID()`) → show error + 💡 Resolution hint

---

## 📄 License

MIT © 2025 — Built for SPCC Academic Project

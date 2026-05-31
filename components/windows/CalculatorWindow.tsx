"use client";

import { useCallback, useEffect, useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";

function CalcButton({
  label,
  onClick,
  color = "#000080",
}: {
  label: string;
  onClick: () => void;
  color?: string;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className="flex items-center justify-center cursor-default select-none"
      style={{
        background: "#c0c0c0",
        border: "2px solid",
        borderColor: pressed
          ? "#808080 #ffffff #ffffff #808080"
          : "#ffffff #808080 #808080 #ffffff",
        boxShadow: pressed
          ? "inset 1px 1px 0 #0a0a0a, inset -1px -1px 0 #dfdfdf"
          : "inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #0a0a0a",
        color,
        fontSize: "13px",
        height: "28px",
        paddingTop: pressed ? "1px" : "0px",
        paddingLeft: pressed ? "1px" : "0px",
      }}
    >
      {label}
    </button>
  );
}

export function CalculatorWindow({ playSound }: WindowComponentProps) {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState(0);
  const [hasMemory, setHasMemory] = useState(false);
  const [operand, setOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);

  const current = parseFloat(display);

  const inputDigit = useCallback(
    (digit: string) => {
      playSound("click");
      if (resetNext) {
        setDisplay(digit);
        setResetNext(false);
      } else {
        setDisplay(display === "0" ? digit : display + digit);
      }
    },
    [display, resetNext, playSound],
  );

  const inputDot = useCallback(() => {
    playSound("click");
    if (resetNext) {
      setDisplay("0.");
      setResetNext(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }, [display, resetNext, playSound]);

  const calculate = useCallback(
    (a: number, op: string, b: number): number => {
      switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return b !== 0 ? a / b : NaN;
        default: return b;
      }
    },
    [],
  );

  const handleOperator = useCallback(
    (op: string) => {
      playSound("click");
      if (operator && operand !== null && !resetNext) {
        const result = calculate(operand, operator, current);
        const resultStr = isNaN(result) ? "Error" : String(result);
        setDisplay(resultStr);
        setOperand(result);
      } else {
        setOperand(current);
      }
      setOperator(op);
      setResetNext(true);
    },
    [operator, operand, current, resetNext, calculate, playSound],
  );

  const handleEquals = useCallback(() => {
    playSound("click");
    if (operator && operand !== null) {
      const result = calculate(operand, operator, current);
      const resultStr = isNaN(result) ? "Error" : String(result);
      setDisplay(resultStr);
      setOperand(null);
      setOperator(null);
      setResetNext(true);
    }
  }, [operator, operand, current, calculate, playSound]);

  const clear = useCallback(() => {
    playSound("click");
    setDisplay("0");
    setOperand(null);
    setOperator(null);
    setResetNext(false);
  }, [playSound]);

  const clearEntry = useCallback(() => {
    playSound("click");
    setDisplay("0");
    setResetNext(false);
  }, [playSound]);

  const backspace = useCallback(() => {
    playSound("click");
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  }, [display, playSound]);

  const toggleSign = useCallback(() => {
    playSound("click");
    if (display !== "0") {
      setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
    }
  }, [display, playSound]);

  const percent = useCallback(() => {
    playSound("click");
    if (operand !== null) {
      setDisplay(String(operand * current / 100));
    } else {
      setDisplay(String(current / 100));
    }
    setResetNext(true);
  }, [current, operand, playSound]);

  const sqrt = useCallback(() => {
    playSound("click");
    const result = Math.sqrt(current);
    setDisplay(isNaN(result) ? "Error" : String(result));
    setResetNext(true);
  }, [current, playSound]);

  const reciprocal = useCallback(() => {
    playSound("click");
    const result = current !== 0 ? 1 / current : NaN;
    setDisplay(isNaN(result) ? "Error" : String(result));
    setResetNext(true);
  }, [current, playSound]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
      else if (e.key === ".") inputDot();
      else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") handleOperator(e.key);
      else if (e.key === "Enter" || e.key === "=") handleEquals();
      else if (e.key === "Escape") clear();
      else if (e.key === "Backspace") backspace();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [inputDigit, inputDot, handleOperator, handleEquals, clear, backspace]);

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      {/* Menu bar */}
      <div className="flex items-center h-[20px] px-1 text-[11px] border-b border-[#808080]">
        <span className="px-2 cursor-default hover:bg-[#000080] hover:text-white"><u>E</u>dit</span>
        <span className="px-2 cursor-default hover:bg-[#000080] hover:text-white"><u>V</u>iew</span>
        <span className="px-2 cursor-default hover:bg-[#000080] hover:text-white"><u>H</u>elp</span>
      </div>

      {/* Display */}
      <div className="mx-[8px] mt-[8px] mb-[4px]">
        <div
          className="h-[28px] flex items-center justify-end px-[4px] bg-white font-mono text-right text-[16px]"
          style={{
            border: "2px solid",
            borderColor: "#808080 #ffffff #ffffff #808080",
          }}
        >
          {display}
        </div>
      </div>

      {/* Buttons area */}
      <div className="flex-1 px-[8px] pb-[8px] pt-[4px]">
        {/* Row 1: Memory indicator, Backspace, CE, C */}
        <div className="grid grid-cols-[40px_1fr_1fr_1fr] gap-[4px] mb-[4px]">
          {/* Memory indicator box */}
          <div
            className="h-[28px] flex items-center justify-center text-[11px]"
            style={{
              background: "#c0c0c0",
              border: "2px solid",
              borderColor: "#808080 #ffffff #ffffff #808080",
            }}
          >
            {hasMemory ? "M" : ""}
          </div>
          <CalcButton label="Backspace" onClick={backspace} color="#800000" />
          <CalcButton label="CE" onClick={clearEntry} color="#800000" />
          <CalcButton label="C" onClick={clear} color="#800000" />
        </div>

        {/* Main grid: 4 rows x 6 cols */}
        <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] gap-[4px]">
          {/* Row 1: MC 7 8 9 / sqrt */}
          <CalcButton label="MC" onClick={() => { playSound("click"); setMemory(0); setHasMemory(false); }} color="#800000" />
          <CalcButton label="7" onClick={() => inputDigit("7")} />
          <CalcButton label="8" onClick={() => inputDigit("8")} />
          <CalcButton label="9" onClick={() => inputDigit("9")} />
          <CalcButton label="/" onClick={() => handleOperator("/")} color="#ff0000" />
          <CalcButton label="√" onClick={sqrt} />

          {/* Row 2: MR 4 5 6 * % */}
          <CalcButton label="MR" onClick={() => { playSound("click"); setDisplay(String(memory)); setResetNext(true); }} color="#800000" />
          <CalcButton label="4" onClick={() => inputDigit("4")} />
          <CalcButton label="5" onClick={() => inputDigit("5")} />
          <CalcButton label="6" onClick={() => inputDigit("6")} />
          <CalcButton label="*" onClick={() => handleOperator("*")} color="#ff0000" />
          <CalcButton label="%" onClick={percent} />

          {/* Row 3: MS 1 2 3 - 1/x */}
          <CalcButton label="MS" onClick={() => { playSound("click"); setMemory(current); setHasMemory(true); }} color="#800000" />
          <CalcButton label="1" onClick={() => inputDigit("1")} />
          <CalcButton label="2" onClick={() => inputDigit("2")} />
          <CalcButton label="3" onClick={() => inputDigit("3")} />
          <CalcButton label="-" onClick={() => handleOperator("-")} color="#ff0000" />
          <CalcButton label="1/x" onClick={reciprocal} />

          {/* Row 4: M+ 0 +/- . + = */}
          <CalcButton label="M+" onClick={() => { playSound("click"); setMemory(memory + current); setHasMemory(true); }} color="#800000" />
          <CalcButton label="0" onClick={() => inputDigit("0")} />
          <CalcButton label="+/-" onClick={toggleSign} />
          <CalcButton label="." onClick={inputDot} />
          <CalcButton label="+" onClick={() => handleOperator("+")} color="#ff0000" />
          <CalcButton label="=" onClick={handleEquals} color="#ff0000" />
        </div>
      </div>
    </div>
  );
}

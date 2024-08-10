import { MutableRefObject } from "react";

export function HiddenInput({
  inputRef,
  onKeyDown,
}: {
  inputRef: MutableRefObject<HTMLInputElement>;
  onKeyDown: (_e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      ref={inputRef}
      autoFocus
      onKeyDown={onKeyDown}
      className="absolute h-full w-full left-0 top-0 opacity-0 bg-slate-200 outline-none"
    />
  );
}

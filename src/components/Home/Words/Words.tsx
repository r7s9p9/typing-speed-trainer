import { useWords } from "./useWords";

export function Words() {
  const { text, onKeyDown } = useWords();

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <ul className="w-full px-4 flex flex-wrap opacity-50">{text}</ul>
      <input
        autoFocus
        onKeyDown={onKeyDown}
        className="absolute h-full w-full left-0 top-0 opacity-0 bg-slate-200 outline-none"
      />
    </div>
  );
}

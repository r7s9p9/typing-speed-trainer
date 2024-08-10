import { useWords } from "./useWords";

export function Words() {
  const {
    words,
    onKeyDown,
    cursorRef,
    timerRef,
    inputRef,
    timerSeconds,
    onRestart,
  } = useWords();

  return (
    <div className="relative px-4 w-full h-full flex flex-col items-center justify-center">
      <div
        ref={timerRef}
        className="self-start opacity-0 text-xl font-light duration-150as"
      >
        {timerSeconds}
      </div>
      <ul className="relative w-full flex flex-wrap text-slate-500 text-xl">
        <div
          ref={cursorRef}
          className="h-8 w-0.5 absolute left-0 top-0 bg-slate-600 duration-100"
        />
        {words}
      </ul>
      <input
        ref={inputRef}
        autoFocus
        onKeyDown={onKeyDown}
        className="absolute h-full w-full left-0 top-0 opacity-0 bg-slate-200 outline-none"
      />
      <button
        onClick={onRestart}
        className="z-10 w-full mt-auto p-2 border-2 border-slate-400 rounded-xl"
      >
        Restart
      </button>
    </div>
  );
}

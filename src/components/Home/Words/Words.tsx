import { MutableRefObject } from "react";

export function Words({
  words,
  cursorRef,
}: {
  words: JSX.Element[];
  cursorRef: MutableRefObject<HTMLDivElement>;
}) {
  return (
    <ul className="relative w-full flex flex-wrap text-slate-500 text-2xl">
      {words}
      <div
        ref={cursorRef}
        className="h-8 w-0.5 absolute left-0 top-0 bg-slate-600 duration-100"
      />
    </ul>
  );
}

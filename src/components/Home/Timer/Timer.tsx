import { MutableRefObject } from "react";

export function Timer({
  timerRef,
  countdown,
}: {
  timerRef: MutableRefObject<HTMLDivElement>;
  countdown: number;
}) {
  return (
    <div
      ref={timerRef}
      className="self-start mt-auto opacity-0 text-2xl text-yellow-600"
    >
      {countdown}
    </div>
  );
}

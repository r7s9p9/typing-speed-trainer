import { Header } from "./Header/Header";
import { Words } from "./Words/Words";
import { Timer } from "./Timer/Timer";
import { useHome } from "./useHome";
import { HiddenInput } from "./HiddenInput/HiddenInput";
import { RestartButton } from "./RestartButton/RestartButton";
import { Outlet } from "react-router-dom";

export function Home() {
  const {
    words,
    onKeyDown,
    cursorRef,
    timerRef,
    inputRef,
    timerSeconds,
    onRestart,
  } = useHome();

  return (
    <>
      <div className="w-screen h-screen flex flex-col bg-slate-200">
        <Header />
        <div className="relative p-4 w-full h-full flex flex-col items-center justify-center">
          <Timer timerRef={timerRef} countdown={timerSeconds} />
          <Words words={words} cursorRef={cursorRef} />
          <HiddenInput inputRef={inputRef} onKeyDown={onKeyDown} />
          <RestartButton onRestart={onRestart} />
        </div>
      </div>
      <Outlet />
    </>
  );
}

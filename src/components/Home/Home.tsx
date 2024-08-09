import { Header } from "./Header/Header";
import { Words } from "./Words/Words";

export function Home() {
  return (
    <div className="w-screen h-screen flex flex-col bg-slate-200">
      <Header />
      <Words />
    </div>
  );
}

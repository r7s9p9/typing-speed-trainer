import { Text } from "../../../shared/ui/Text/Text";

export function Header() {
  return (
    <div className="h-12 w-full px-4 flex items-center justify-between border-b-2 border-slate-400 bg-slate-300">
      <Text
        size="xl"
        font="light"
        uppercase
        letterSpacing
        className="m-auto text-slate-600"
      >
        Typing Trainer
      </Text>
    </div>
  );
}

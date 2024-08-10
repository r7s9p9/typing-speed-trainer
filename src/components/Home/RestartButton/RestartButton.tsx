import { Text } from "../../../shared/ui/Text/Text";

export function RestartButton({ onRestart }: { onRestart: () => void }) {
  return (
    <button
      onClick={onRestart}
      className="z-10 w-full mt-auto p-2 border-2 border-slate-400 rounded-xl"
    >
      <Text size="md" font="light" uppercase letterSpacing>
        Restart
      </Text>
    </button>
  );
}

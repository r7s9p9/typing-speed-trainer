import { IconRefresh } from "@tabler/icons-react";
import { Text } from "../../../shared/ui/Text/Text";

export function RestartButton({ onRestart }: { onRestart: () => void }) {
  const iconProps = {
    className: "text-slate-600",
    strokeWidth: "1",
    size: 28,
  };

  return (
    <button
      onClick={onRestart}
      className="z-10 w-full md:w-fit md:px-8 mt-auto p-2 flex gap-4 items-center justify-center border-2 border-slate-400 rounded-xl"
    >
      <IconRefresh {...iconProps} />
      <Text size="md" font="light" uppercase letterSpacing>
        Restart
      </Text>
    </button>
  );
}

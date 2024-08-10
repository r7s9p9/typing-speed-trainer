import { IconKeyboard } from "@tabler/icons-react";
import { Text } from "../../../shared/ui/Text/Text";

export function Header() {
  const iconProps = {
    className: "text-slate-500",
    strokeWidth: "1",
    size: 48,
  };

  return (
    <div className="h-12 w-full px-4 flex items-center gap-2 border-b-2 border-slate-400 bg-slate-300">
      <IconKeyboard {...iconProps} />
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

import { IconRefresh } from "@tabler/icons-react";
import { Text } from "../../../shared/ui/Text/Text";
import { IconButton } from "../IconButton/IconButton";

export function ErrorBoundary({ className }: { className?: string }) {
  const iconProps = {
    className: "text-slate-600",
    strokeWidth: "1",
    size: 32,
  };

  return (
    <div
      className={`md:max-w-[600px] p-4 m-4 rounded-md shadow-md border-2 border-red-400 bg-slate-50 ${className || ""}`}
    >
      <div className="shrink-0 flex items-center gap-2">
        <Text
          size="xl"
          font="thin"
          uppercase
          letterSpacing
          className="select-none grow"
        >
          Something went wrong
        </Text>
        <IconButton title="Refresh" onClick={() => window.location.reload()}>
          <IconRefresh {...iconProps} />
        </IconButton>
      </div>
      <div className="w-full my-2 border-2 border-slate-100" />
      <Text size="md" font="light">
        Try refreshing the page
      </Text>
    </div>
  );
}

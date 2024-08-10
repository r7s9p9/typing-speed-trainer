import { Popup } from "../../../shared/ui/Popup/Popup";
import { Text } from "../../../shared/ui/Text/Text";
import { useScore } from "./useScore";

export function Score() {
  const { score, contentRef, overlayRef, onClose } = useScore();

  return (
    <Popup
      contentRef={contentRef}
      overlayRef={overlayRef}
      onClose={onClose}
      titleText="Score"
    >
      <div className="flex flex-col m-auto">
        <Text size="xl" font="light">
          WPM: {score.wpm}
        </Text>
        <Text size="xl" font="light">
          Time: {score.time} seconds
        </Text>
        <Text size="xl" font="light">
          Accuracy: {score.accuracy}%
        </Text>
      </div>
    </Popup>
  );
}

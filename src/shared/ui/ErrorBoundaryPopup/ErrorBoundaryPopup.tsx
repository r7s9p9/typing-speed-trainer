import { useLocation, useNavigate } from "react-router-dom";
import { Text } from "../../../shared/ui/Text/Text";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { Popup } from "../Popup/Popup";
import { routes } from "../../../constants";

export function ErrorBoundaryPopup({
  disableClickOutside,
}: {
  disableClickOutside?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const onClose = () => {
    if (!disableClickOutside) {
      if (!location.state?.prevPath) {
        navigate(routes.home.path);
        return;
      }
      navigate(location.state?.prevPath);
    }
  };

  const { contentRef, overlayRef } = useOnClickOutside({
    onClickOutside: onClose,
  });

  return (
    <Popup
      titleText="Something went wrong"
      contentRef={contentRef}
      overlayRef={overlayRef}
      onClose={onClose}
      className="border-x-2 border-t-2 md:border-2 border-red-400"
    >
      <Text
        size="md"
        font="light"
        className="m-auto text-justify md:text-center"
      >
        Try refreshing the page
      </Text>
    </Popup>
  );
}

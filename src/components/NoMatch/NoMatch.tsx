import { Text } from "../../shared/ui/Text/Text";
import { Link } from "react-router-dom";
import { routes } from "../../constants";

export function NoMatch() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-200">
      <div className="flex flex-col p-4 m-4 rounded-md shadow-md border-2 border-slate-400 bg-slate-50 ">
        <Text
          size="xl"
          font="thin"
          uppercase
          letterSpacing
          className="select-none"
        >
          Error 404
        </Text>
        <div className="w-full my-2 border-2 border-slate-100" />
        <Text size="md" font="light">
          Apparently this page does not exist
        </Text>
        <Text size="md" font="light">
          However, you can always go&nbsp;
          <Link
            to={routes.home.path}
            className="underline cursor-pointer text-blue-600"
          >
            home
          </Link>
        </Text>
      </div>
    </div>
  );
}

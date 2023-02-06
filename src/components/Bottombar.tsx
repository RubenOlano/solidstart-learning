import { signIn } from "@auth/solid-start/client";
import { For, Switch, Match } from "solid-js";
import { A } from "solid-start";
import { useSession } from "~/utils/auth";
import { getImage } from "~/utils/defaultUserImage";
import { trpc } from "~/utils/trpc";

const routes = {
  H: "/",
  G: "/groups",
  E: "/explore",
} as const;

const BottomBar = () => {
  const context = trpc.useContext();
  const clickSignIn = async () => {
    await context.invalidate();
    signIn();
  };
  const session = useSession();
  const user = () => session()?.user;
  return (
    <div class="btm-nav bg-gradient-to-t from-base-200 md:hidden z-10">
      <For each={Object.keys(routes)}>
        {(item) => (
          <A
            href={routes[item as keyof typeof routes]}
            class="text-xs"
            activeClass="stroke-primary-focus stroke-2"
          >
            {item}
          </A>
        )}
      </For>
      <Switch>
        <Match when={!session()}>
          <div>
            <button
              class="btn btn-primary max-w-sm text-xs font-light"
              onClick={clickSignIn}
            >
              Log In
            </button>
          </div>
        </Match>
        <Match when={session()}>
          <div>
            <img
              src={getImage(user()?.image)}
              alt={user()?.name || "User"}
              class="rounded-md h-4 w-4 avatar"
            />
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default BottomBar;

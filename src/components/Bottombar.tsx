import { getSession } from "@auth/solid-start";
import { signIn } from "@auth/solid-start/client";
import { For, Switch, Match } from "solid-js";
import { A } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { authOpts } from "~/routes/api/auth/[...solidauth]";
import { getImage } from "~/utils/defaultUserImage";

const routes = {
  H: "/",
  G: "/groups",
  E: "/explore",
} as const;

const BottomBar = () => {
  const session = createSession();
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
              onClick={() => signIn()}
            >
              Log In
            </button>
          </div>
        </Match>
        <Match when={session()}>
          <div>
            <img
              src={getImage(session()?.user?.image)}
              alt={session()?.user?.name || "User"}
              class="rounded-md h-4 w-4 avatar"
            />
          </div>
        </Match>
      </Switch>
    </div>
  );
};

const createSession = () => {
  return createServerData$(async (_, event) => {
    return await getSession(event.request, authOpts);
  });
};

export default BottomBar;

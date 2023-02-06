import { For, Match, Switch } from "solid-js";
import { signIn, signOut } from "@auth/solid-start/client";
import { A } from "solid-start";
import { getImage } from "~/utils/defaultUserImage";
import { trpc } from "~/utils/trpc";
import { useSession } from "~/utils/auth";

const routes = {
  Home: "/",
  Groups: "/groups",
  Explore: "/explore",
} as const;

const SideBarContent = () => {
  const context = trpc.useContext();
  const onClick = async (next: () => void) => {
    await context.invalidate();
    next();
  };
  const session = useSession();
  const user = () => session()?.user;
  return (
    <div class="hidden md:block h-[100vh] w-40 fixed z-10 top-0 left-0 bg-base-300 overflow-x-hidden pl-2 py-12 text-center">
      <div class="flex flex-col content-evenly justify-between h-full items-center">
        <A href="/" class="text-2xl font-semibold">
          Group Pray
        </A>
        <div class="flex flex-col h-full  items-center w-full text-left p-2 justify-evenly">
          <For each={Object.keys(routes)}>
            {(item) => (
              <A
                href={routes[item as keyof typeof routes]}
                class="text-xl flex text-left w-full items-center rounded-lg p-2"
                activeClass="stroke-primary-focus stroke-2"
              >
                {item}
              </A>
            )}
          </For>
        </div>
        <Switch>
          <Match when={!session()}>
            <button
              class="btn btn-primary"
              onClick={() => onClick(() => signIn())}
            >
              Sign In
            </button>
          </Match>
          <Match when={session()}>
            <div class="flex flex-col items-center">
              <img
                src={getImage(user()?.image)}
                alt={user()?.name || "User"}
                class="avatar rounded-md w-8 h-8 m-3 cursor-pointer"
              />
              <button
                class="btn btn-primary"
                onClick={() => onClick(() => signOut())}
              >
                Sign Out
              </button>
            </div>
          </Match>
        </Switch>
      </div>
    </div>
  );
};

export default SideBarContent;

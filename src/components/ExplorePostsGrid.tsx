import { For, Match, Switch } from "solid-js";
import { feed } from "~/stores/feedSwitcher";
import { trpc } from "~/utils/trpc";
import ExplorePostCard from "./ExplorePostCard";

const LoadingCard = () => (
  <div class="card bg-base-200 shadow-xL m-3 md:m-5 max-w-lg animate-pulse">
    <div class="card-body">
      <div class="card-actions \ m-2">
        <p class="justify-end text-right text-base-content" />
      </div>
    </div>
  </div>
);

const ExplorePostsGrid = () => {
  const query = trpc.explore.explorePosts.useInfiniteQuery(() => ({}));
  return (
    <div
      class={`md:grid-cols-3 gap-2 ${
        feed() === "groups" ? "hidden" : "block md:grid"
      }`}
    >
      <Switch>
        <Match when={query.isInitialLoading || query.isLoading}>
          <For each={Array.from({ length: 6 })}>{() => <LoadingCard />}</For>
        </Match>
        <Match when={query.isSuccess}>
          <For each={query.data?.pages}>
            {(page) => (
              <For each={page.posts}>
                {(post) => <ExplorePostCard post={post} />}
              </For>
            )}
          </For>
        </Match>
      </Switch>
    </div>
  );
};

export default ExplorePostsGrid;

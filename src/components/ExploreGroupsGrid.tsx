import { For, Match, Switch } from "solid-js";
import { feed } from "~/stores/feedSwitcher";
import { trpc } from "~/utils/trpc";
import ExploreGroupCard from "./ExploreGroupCard";

const LoadingCard = () => (
  <div class="card card-compact bg-base-200 shadow-xl m-3 bg-gradient-to-t from-primary">
    <div class="card-body">
      <div class="card-actions align-middle" />
    </div>
  </div>
);
const ExploreGroupsGrid = () => {
  const query = trpc.explore.exploreGroups.useInfiniteQuery(() => ({}));

  return (
    <div
      class={`md:grid-cols-3 gap-2 ${
        feed() === "posts" ? "hidden" : "block md:grid"
      }`}
    >
      <Switch>
        <Match when={query.isLoading}>
          <For each={Array.from({ length: 6 })}>{() => <LoadingCard />}</For>
        </Match>
        <Match when={query.isSuccess}>
          <For each={query.data?.pages}>
            {(page) => (
              <For each={page.groups}>
                {(group) => <ExploreGroupCard group={group} />}
              </For>
            )}
          </For>
        </Match>
      </Switch>
    </div>
  );
};
export default ExploreGroupsGrid;

import { For } from "solid-js";
import { trpc } from "~/utils/trpc";
import PostCard from "./PostCard";

const MainFeed = () => {
  const query = trpc.post.mainFeed.useInfiniteQuery(() => ({}));

  return (
    <div class="flex items-center flex-col">
      <For each={query.data?.pages}>
        {(page) => (
          <For each={page.posts}>{(post) => <PostCard post={post} />}</For>
        )}
      </For>
      <button
        onClick={() => query.fetchNextPage()}
        disabled={!query.hasNextPage}
        class="btn btn-secondary"
      >
        Load more
      </button>
    </div>
  );
};

export default MainFeed;

import { trpc } from "~/utils/trpc";
import ExploreGroupsGrid from "./ExploreGroupsGrid";
import ExplorePostsGrid from "./ExplorePostsGrid";

const ExploreFeed = () => {
  const context = trpc.useContext();

  context.explore.explorePosts.invalidate();
  context.explore.exploreGroups.invalidate();

  return (
    <div class="p-2 md:p-5 pt-10">
      <ExplorePostsGrid />
      <ExploreGroupsGrid />
    </div>
  );
};

export default ExploreFeed;

import { For } from "solid-js";
import { useParams } from "solid-start";
import { trpc } from "~/utils/trpc";
import GroupPostCard from "./GroupPostCard";

const GroupPostsFeed = () => {
  const params = useParams();
  const query = trpc.group.getGroupPosts.useQuery(() => ({
    groupId: params.id,
  }));

  return (
    <div class="md:grid grid-cols-3 m-5">
      <For each={query.data}>{(post) => <GroupPostCard post={post} />}</For>
    </div>
  );
};

export default GroupPostsFeed;

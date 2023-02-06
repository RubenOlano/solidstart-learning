import type { Component } from "solid-js";
import { Show } from "solid-js";
import { useSession } from "~/utils/auth";
import { trpc } from "~/utils/trpc";

interface Group {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  members: number;
}

const ExploreGroupCard: Component<{ group: Group }> = (props) => {
  const session = useSession();
  const user = () => session()?.user;
  const context = trpc.useContext();
  const mutation = trpc.group.joinExploreGroup.useMutation();

  const onClick = async () => {
    mutation.mutateAsync(
      { groupId: props.group.id },
      {
        onSuccess: async () => {
          const req1 = context.group.getUserGroups.invalidate();
          const req2 = context.explore.exploreGroups.invalidate();
          const req3 = context.explore.explorePosts.invalidate();
          const req4 = context.post.mainFeed.invalidate();
          await Promise.allSettled([req1, req2, req3, req4]);
        },
      }
    );
  };

  return (
    <div class="card card-compact bg-base-200 shadow-xl m-3 bg-gradient-to-t from-primary">
      <div class="card-body">
        <h1 class="card-title font-extrabold text-base-content">
          {props.group.name}
        </h1>
        <p>{props.group.description}</p>
        <div class="card-actions align-middle">
          <p class="card-subtitle">{props.group.members} members</p>
          <Show when={user()}>
            <button onClick={onClick} class="btn btn-primary endi">
              Join
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default ExploreGroupCard;

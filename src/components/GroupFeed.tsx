import { Match, Switch } from "solid-js";
import { useParams } from "solid-start";
import { trpc } from "~/utils/trpc";
import GroupHeder from "./GroupHeader";

const GroupFeed = () => {
  const params = useParams();
  const query = trpc.group.getGroupData.useQuery(() => ({
    groupId: params.id,
  }));
  return (
    <Switch>
      <Match when={query.isLoading}>
        <div class="bg-base-300 w-full flex justify-between h-20 align-middle" />
      </Match>
      <Match when={query.isSuccess}>
        <GroupHeder
          name={query.data?.name || ""}
          members={query.data?.GroupMembers?.length || 0}
        />
      </Match>
      <Match when={query.isError}>
        <div class="bg-base-300 w-full flex justify-between h-20 align-middle" />
      </Match>
    </Switch>
  );
};

export default GroupFeed;

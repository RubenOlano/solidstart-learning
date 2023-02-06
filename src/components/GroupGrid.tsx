import { For } from "solid-js";
import { trpc } from "~/utils/trpc";
import GroupCard from "./GroupCard";

const GroupGrid = () => {
  const query = trpc.group.getUserGroups.useQuery();
  return (
    <div class="md:grid grid-cols-3">
      <For each={query.data}>{(group) => <GroupCard group={group} />}</For>
    </div>
  );
};

export default GroupGrid;

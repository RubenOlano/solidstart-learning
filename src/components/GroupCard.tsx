import type { Group } from "@prisma/client";
import { A } from "solid-start";

interface IGroup {
  group: Group & {
    _count: {
      GroupMembers: number;
    };
  };
}

const GroupCard = (props: IGroup) => {
  return (
    <A
      class="card m-3 bg-base-200 cursor-pointer select-none"
      href={`/groups/${props.group.id}`}
    >
      <div class="card-body">
        <h1 class="card-title font-bold">{props.group.name}</h1>
        <p class="text-base">{props.group.description}</p>
        <div class="card-actions align-middle">
          <p class="text-base">{props.group._count.GroupMembers} members</p>
        </div>
      </div>
    </A>
  );
};

export default GroupCard;

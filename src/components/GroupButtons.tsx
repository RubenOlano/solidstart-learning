import { useNavigate, useParams } from "solid-start";
import { trpc } from "~/utils/trpc";

const GroupButtons = () => {
  const navigate = useNavigate();
  const params = useParams();
  const context = trpc.useContext();

  const clickRefresh = async () => {
    await context.group.getGroupPosts.invalidate({ groupId: params.id });
  };

  return (
    <div class="w-full flex justify-center align-middle p-5">
      <div class="btn-group">
        <button class="btn" onClick={() => navigate("/post")}>
          Create
        </button>
        <button class="btn" onClick={() => clickRefresh()}>
          Refresh
        </button>
        <button class="btn">Invite</button>
      </div>
    </div>
  );
};

export default GroupButtons;

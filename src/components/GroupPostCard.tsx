import type { Component } from "solid-js";
import { Match, Switch } from "solid-js";
import { trpc } from "~/utils/trpc";

interface Post {
  id: string;
  authorName: string | null;
  groupName: string;
  title: string;
  content: string;
  createdAt: Date;
  groupId: string;
  authorImage: string | undefined;
}

const PostLikeButton = (props: { postId: string }) => {
  const context = trpc.useContext();
  const query = trpc.post.postLikes.useQuery(
    () => ({ postId: props.postId }),
    () => ({
      _optimisticResults: "optimistic",
    })
  );
  const liked = trpc.post.userLikedPost.useQuery(
    () => ({ postId: props.postId }),
    () => ({ _optimisticResults: "optimistic" })
  );
  const mutation = trpc.post.likePost.useMutation(() => ({
    async onMutate({ postId }) {
      await context.post.postLikes.cancel({ postId });
      await context.post.userLikedPost.cancel({ postId });

      const prev = context.post.postLikes.getData({ postId });
      const prevLiked = context.post.userLikedPost.getData({ postId });

      context.post.postLikes.setData(
        {
          likes: prevLiked?.liked
            ? (prev?.likes || 1) - 1
            : (prev?.likes || 0) + 1,
        },
        { postId }
      );
      context.post.userLikedPost.setData(
        { liked: !prevLiked?.liked },
        { postId }
      );
      return { prev, prevLiked };
    },
    onError(_, { postId }, ctx) {
      context.post.postLikes.setData(ctx?.prev, { postId });
      context.post.userLikedPost.setData(ctx?.prevLiked, { postId });
    },
    async onSettled() {
      await context.post.postLikes.invalidate({ postId: props.postId });
      await context.post.userLikedPost.invalidate({ postId: props.postId });
    },
  }));

  const onClick = async () => {
    mutation.mutate(
      { postId: props.postId },
      {
        onSuccess: async () =>
          await context.post.postLikes.invalidate({ postId: props.postId }),
      }
    );
  };
  return (
    <Switch>
      <Match when={liked.isSuccess}>
        <button
          class={`btn btn-md ${
            liked.data?.liked ? "btn-success" : "btn-primary"
          }`}
          onClick={onClick}
        >
          Likes: {query.data?.likes}
        </button>
      </Match>
      <Match when={liked.isLoading}>
        <button class="btn btn-md btn-primary" disabled>
          Loading...
        </button>
      </Match>
    </Switch>
  );
};

const PostCard: Component<{ post: Post }> = (props) => {
  return (
    <div class="card bg-base-200 shadow-xl m-3 md:m-5 max-w-lg transition ease-in-out">
      <div class="card-body">
        <div class="card-title">{props.post.title}</div>
        <p>{props.post.content}</p>
        <div class="card-actions flex m-2">
          <p class="text-base-content italic text-sm">
            {props.post.authorName}
          </p>
          <p class="justify-end text-right text-base-content">
            {props.post.groupName}
          </p>
        </div>
        <div class="card-actions flex justify-center md:justify-end m-2">
          <PostLikeButton postId={props.post.id} />
        </div>
      </div>
    </div>
  );
};

export default PostCard;

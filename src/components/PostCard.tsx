import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-zod";
import type { Component } from "solid-js";
import { For } from "solid-js";
import { Match, Switch } from "solid-js";
import { A } from "solid-start";
import type { CreateCommentSchema } from "~/schema/comment.schema";
import { createCommentSchema } from "~/schema/comment.schema";
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

const CommentForm = (props: { postId: string }) => {
  const context = trpc.useContext();
  const mutation = trpc.comment.createComment.useMutation(() => ({
    onSuccess: async () => {
      await context.comment.fetchComments.invalidate({ postId: props.postId });
    },
  }));
  const { form, reset } = createForm<CreateCommentSchema>({
    extend: validator({ schema: createCommentSchema }),
    onSubmit: async (data) => {
      reset();
      await mutation.mutateAsync({ ...data, postId: props.postId });
    },
  });

  return (
    <form ref={form} class="form-control">
      <label for="content" class="label">
        Add a Comment
      </label>
      <textarea name="body" class="input input-bordered" id="body" />
      <input type="hidden" name="postId" value={props.postId} />
      <button type="submit" class="btn btn-primary">
        {mutation.isLoading ? "Loading..." : "Submit"}
      </button>
    </form>
  );
};

const Comments = (props: { postId: string }) => {
  const query = trpc.comment.fetchComments.useQuery(() => ({
    postId: props.postId,
  }));

  return (
    <div class="collapse border border-primary rounded-lg">
      <input type="checkbox" />
      <div class="collapse-title ">
        <div class="flex w-full">
          <h1>Comments</h1>
          <p class="text-right">{query.data?.length}</p>
        </div>
      </div>
      <div class="collapse-content">
        <CommentForm postId={props.postId} />
        <For each={query.data}>
          {(comment) => (
            <div class="card-compact bg-base-200 m-3">
              <div class="card-body">{comment.author.name}</div>
              <p>{comment.content}</p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

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
    onSettled() {
      context.post.postLikes.invalidate({ postId: props.postId });
      context.post.userLikedPost.invalidate({ postId: props.postId });
    },
  }));

  const onClick = async () => {
    mutation.mutate(
      { postId: props.postId },
      {
        onSuccess: async () => {
          await context.post.postLikes.invalidate({ postId: props.postId });
        },
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
    <div class="card bg-base-200 shadow-xl md:w-1/2 m-3 md:m-5 max-w-lg">
      <div class="card-body">
        <div class="card-title">{props.post.title}</div>
        <p>{props.post.content}</p>
        <div class="card-actions flex m-2">
          <p class="text-base-content italic text-sm">
            {props.post.authorName}
          </p>
          <A
            href={`/groups/${props.post.groupId}`}
            class="justify-end text-right text-base-content"
          >
            {props.post.groupName}
          </A>
        </div>
        <div class="card-actions flex justify-center md:justify-end m-2">
          <PostLikeButton postId={props.post.id} />
        </div>
        <Comments postId={props.post.id} />
      </div>
    </div>
  );
};

export default PostCard;

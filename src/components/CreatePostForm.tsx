import type { createPostInput } from "~/schema/post.schema";
import { createPostSchema } from "~/schema/post.schema";
import { trpc } from "~/utils/trpc";
import { For, Show } from "solid-js";
import { useNavigate } from "solid-start";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-zod";

const PostForm = () => {
  const context = trpc.useContext();
  const navigate = useNavigate();
  const mutation = trpc.post.createPost.useMutation(() => ({
    onSuccess: () => navigate("/"),
  }));
  const { form, errors, isValid } = createForm<createPostInput>({
    onSubmit: async (data) => {
      await context.post.mainFeed.invalidate();
      await context.group.getGroupData.invalidate({ groupId: data.groupId });
      await mutation.mutateAsync(data);
    },
    extend: validator({ schema: createPostSchema }),
  });

  const query = trpc.group.getUserGroups.useQuery();
  return (
    <form ref={form} class="form-control">
      <label for="title" class="label">
        Title
      </label>
      <input id="title" type="text" name="title" class="input input-bordered" />
      <Show when={errors().title}>
        <p class="text-error">{errors().title}</p>
      </Show>
      <label for="content" class="label">
        Content
      </label>
      <textarea
        name="content"
        class="input textarea-lg textarea-bordered"
        id="content"
      />
      <Show when={errors().content}>
        <p class="text-error">{errors().content}</p>
      </Show>
      <label for="group" class="label">
        Group
      </label>
      <select name="groupId" class="select" id="groupId">
        <For each={query.data}>
          {(group) => <option value={group.id}>{group.name}</option>}
        </For>
      </select>
      <Show when={errors().groupId}>
        <p class="text-error">{errors().groupId}</p>
      </Show>
      <button type="submit" class="btn btn-primary" disabled={!isValid()}>
        {mutation.isLoading ? "Loading..." : "Submit"}
      </button>
      <Show when={!isValid()}>
        <p class="text-error">Cannot submit</p>
      </Show>
    </form>
  );
};

const FormContainer = () => {
  return (
    <div class="p-5 flex align-middle justify-center w-1/2">
      <PostForm />
    </div>
  );
};

export default FormContainer;

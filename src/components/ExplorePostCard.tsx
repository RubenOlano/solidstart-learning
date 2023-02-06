import type { Component } from "solid-js";

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

const ExplorePostCard: Component<{ post: Post }> = (props) => (
  <div class="card bg-base-200 shadow-xL m-3 md:m-5 max-w-lg">
    <div class="card-body">
      <div class="card-title">{props.post.title}</div>
      <p>{props.post.content}</p>
      <div class="card-actions \ m-2">
        <p class="text-base-content italic text-sm">{props.post.authorName}</p>
        <p class="justify-end text-right text-base-content">
          {props.post.groupName}
        </p>
      </div>
    </div>
  </div>
);

export default ExplorePostCard;

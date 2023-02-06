import { createSignal } from "solid-js";
export type Feed = "posts" | "groups";

const [feed, setFeed] = createSignal<Feed>("posts");
const onChange = (val: Feed) => {
  setFeed(val);
};

const map = (e: Feed) => {
  switch (e) {
    case "posts":
      return false;
    case "groups":
      return true;
  }
};
export { onChange, map, feed };

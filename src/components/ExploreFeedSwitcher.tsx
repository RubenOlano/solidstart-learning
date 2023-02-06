import { feed, onChange } from "~/stores/feedSwitcher";

const Switcher = () => {
  return (
    <div class="tabs p-5 w-full justify-center sticky bg-gradient-to-t from-base-100 to-base-300 top-0 z-10 md:opacity-50 md:hover:opacity-100 transition ease-in-out">
      <a
        onClick={[onChange, "posts"]}
        class={`tab tab-lg tab-bordered ${
          feed() === "posts" ? "tab-active" : ""
        }`}
      >
        Posts
      </a>
      <a
        onClick={[onChange, "groups"]}
        class={`tab tab-lg tab-bordered ${
          feed() === "groups" ? "tab-active" : ""
        } `}
      >
        Groups
      </a>
    </div>
  );
};

export default Switcher;

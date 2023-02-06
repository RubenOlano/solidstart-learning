import { type VoidComponent } from "solid-js";
import { Head, Title, Meta, Link } from "solid-start";
import GroupFeed from "~/components/GroupFeed";
import GroupPostsFeed from "~/components/GroupPostsFeed";
import GroupSwitcher from "~/components/GroupButtons";
import Protected from "~/components/Protected";

const Home: VoidComponent = () => {
  return (
    <>
      <Head>
        <Title>Group Pray - Groups</Title>
        <Meta name="description" content="Pray with company" />
        <Link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div class="md:pl-40 pb-16 md:pb-0">
          <GroupFeed />
          <GroupSwitcher />
          <GroupPostsFeed />
        </div>
      </main>
    </>
  );
};

export const { routeData, Page } = Protected(() => <Home />);

export default Page;

import { type VoidComponent } from "solid-js";
import { Head, Title, Meta, Link } from "solid-start";
import ExploreFeed from "~/components/ExploreFeed";
import ExploreFeedSwitcher from "~/components/ExploreFeedSwitcher";

const Home: VoidComponent = () => {
  return (
    <>
      <Head>
        <Title>Group Pray - Explore</Title>
        <Meta name="description" content="Pray with company" />
        <Link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div class="md:pl-40 pb-16 md:pb-0">
          <ExploreFeedSwitcher />
          <ExploreFeed />
        </div>
      </main>
    </>
  );
};

export default Home;

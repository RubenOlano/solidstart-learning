import { type VoidComponent } from "solid-js";
import { Head, Title, Meta, Link } from "solid-start";
import MainFeed from "~/components/MainFeed";
import Protected from "~/components/Protected";

const Home: VoidComponent = () => {
  return (
    <>
      <Head>
        <Title>Group Pray</Title>
        <Meta name="description" content="Pray with company" />
        <Link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div class="lg:pl-40">
          <MainFeed />
        </div>
      </main>
    </>
  );
};

export const { routeData, Page } = Protected(() => <Home />);

export default Page;

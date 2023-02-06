import { type VoidComponent } from "solid-js";
import { Head, Title, Meta, Link } from "solid-start";
import GroupGrid from "~/components/GroupGrid";
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
          <div class="flex justify-center m-3">
            <h1 class="text-3xl font-bold">Your Groups</h1>
          </div>
          <GroupGrid />
        </div>
      </main>
    </>
  );
};

export const { routeData, Page } = Protected(() => <Home />);

export default Page;

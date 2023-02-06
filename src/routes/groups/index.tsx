import { getSession } from "@auth/solid-start";
import { type VoidComponent } from "solid-js";
import { Head, Title, Meta, Link } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import GroupGrid from "~/components/GroupGrid";
import { authOpts } from "../api/auth/[...solidauth]";

const Home: VoidComponent = () => {
  createSession();
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

export default Home;

const createSession = () => {
  return createServerData$(async (_, event) => {
    const session = await getSession(event.request, authOpts);
    if (!session || !session.user) throw redirect("/explore");
    return session;
  });
};

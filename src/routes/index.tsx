import { getSession } from "@auth/solid-start";
import { type VoidComponent } from "solid-js";
import { Head, Title, Meta, Link } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import MainFeed from "~/components/MainFeed";
import { authOpts } from "./api/auth/[...solidauth]";

const Home: VoidComponent = () => {
  // Only show the page if the user is logged in
  // otherwise redirect to the explore page
  createSession();
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

export default Home;

const createSession = () => {
  return createServerData$(async (_, event) => {
    const session = await getSession(event.request, authOpts);
    if (!session || !session.user) throw redirect("/explore");
    return session;
  });
};

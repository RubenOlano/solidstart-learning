import { getSession } from "@auth/solid-start";
import { type VoidComponent } from "solid-js";
import { Head, Title, Meta, Link } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import FormContainer from "~/components/CreatePostForm";
import { authOpts } from "./api/auth/[...solidauth]";

const Home: VoidComponent = () => {
  createSession();
  return (
    <>
      <Head>
        <Title>Group Pray - Create Post</Title>
        <Meta name="description" content="Pray with company" />
        <Link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div class="md:pl-40 pb-16 md:pb-0 flex justify-center">
          <FormContainer />
        </div>
      </main>
    </>
  );
};

export default Home;

const createSession = () => {
  return createServerData$(async (_, { request }) => {
    const session = await getSession(request, authOpts);
    if (!session || !session.user) throw redirect("/explore");
    return session;
  });
};

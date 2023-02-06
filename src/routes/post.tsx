import { type VoidComponent } from "solid-js";
import { Head, Title, Meta, Link } from "solid-start";
import FormContainer from "~/components/CreatePostForm";
import Protected from "~/components/Protected";

const Home: VoidComponent = () => {
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

export const { routeData, Page } = Protected(() => <Home />);

export default Page;

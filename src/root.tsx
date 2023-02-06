// @refresh reload
import "./root.css";
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import { trpc, queryClient } from "~/utils/trpc";
import SideBarContent from "./components/Sidebar";
import BottomBar from "./components/Bottombar";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Group Pray</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <trpc.Provider queryClient={queryClient}>
          <Suspense>
            <ErrorBoundary>
              <SideBarContent />
              <BottomBar />
              <Routes>
                <FileRoutes />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </trpc.Provider>
        <Scripts />
      </Body>
    </Html>
  );
}

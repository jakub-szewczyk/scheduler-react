import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { createLazyFileRoute } from "@tanstack/react-router";

const Dashboard = () => <p>Dashboard</p>;

export const Route = createLazyFileRoute("/")({
  component: () => (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  ),
});

import { SignUp as ClerkSignUp, useClerk } from "@clerk/clerk-react";
import { createLazyFileRoute } from "@tanstack/react-router";

const SignUp = () => {
  const { loaded } = useClerk();

  return loaded ? <ClerkSignUp /> : <p>Loading...</p>;
};

export const Route = createLazyFileRoute("/sign-up")({
  component: SignUp,
});

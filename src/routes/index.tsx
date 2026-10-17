import { createFileRoute } from "@tanstack/react-router";
import { AkarApp } from "@/components/akar-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <AkarApp />;
}

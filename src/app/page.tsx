import { AwwwardsShell } from "@/components/AwwwardsShell";

interface PageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Home({ searchParams }: PageProps) {
  const isDev =
    searchParams?.dev === "true" ||
    searchParams?.dev === "1" ||
    searchParams?.test === "true" ||
    searchParams?.test === "1";

  return (
    <main className="w-full min-h-screen">
      <AwwwardsShell initialDevMode={Boolean(isDev)} autoStart={Boolean(isDev)} />
    </main>
  );
}

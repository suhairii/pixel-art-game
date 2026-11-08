import { Metadata } from "next";
import { AwwwardsShell } from "@/components/AwwwardsShell";

export const metadata: Metadata = {
  title: "Dev & Stage Testing Hub • Nusantara Cyber Pixel Adventure",
  description:
    "Developer stage testing hub for skip stages, boss encounters, companion debugging, and combat sandbox.",
};

export default function DevPage() {
  return (
    <main className="w-full min-h-screen">
      <AwwwardsShell initialDevMode={true} autoStart={true} />
    </main>
  );
}

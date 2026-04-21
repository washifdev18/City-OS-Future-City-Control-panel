import { AppShell } from "@/components/shell/AppShell";
import { MainModuleRouter } from "@/components/MainModuleRouter";

export default function Home() {
  return (
    <AppShell>
      <MainModuleRouter />
    </AppShell>
  );
}

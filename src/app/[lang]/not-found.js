import Link from "next/link";

import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOCALE } from "@/lib/site_config";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center">
      <Container>
        <div className="mx-auto flex max-w-md flex-col items-center py-32 text-center">
          <p className="text-6xl font-semibold tracking-tight text-muted-foreground/40">
            404
          </p>
          <Button asChild className="mt-8">
            <Link href={`/${DEFAULT_LOCALE}`}>Knotfix</Link>
          </Button>
        </div>
      </Container>
    </main>
  );
}

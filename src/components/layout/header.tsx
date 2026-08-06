import Link from "next/link";
import dynamic from "next/dynamic";
import { ModeToggle } from "@/components/mode-toggle";

const Search = dynamic(() => import("@/components/search").then((mod) => mod.Search), { 
  loading: () => <div className="h-9 w-9 md:w-64 bg-muted animate-pulse rounded-md border border-input" />
});

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-14 items-center justify-between">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold inline-block">Frontend Engine</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/topics"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Topics
            </Link>
            <Link
              href="/questions"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Interview Questions
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <Search />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

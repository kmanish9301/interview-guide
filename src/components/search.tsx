"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import Fuse from "fuse.js";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

import { topics } from "#velite";

const searchIndex = topics.map((t) => ({
  title: t.title,
  slug: t.slug,
  category: t.category,
  permalink: t.permalink,
  tags: t.tags
}));

const fuse = new Fuse(searchIndex, {
  keys: ["title", "category", "tags"],
  threshold: 0.3
});

export function Search() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const results = query
    ? fuse.search(query).map((r) => r.item)
    : searchIndex.slice(0, 5);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-sm w-full md:w-64 justify-between text-muted-foreground"
      >
        <span className="flex items-center">
          <SearchIcon className="mr-2 h-4 w-4" />
          Search topics...
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Search topics, tags..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Topics">
              {results.map((topic) => (
                <CommandItem
                  key={topic.slug}
                  value={topic.title}
                  onSelect={() => {
                    runCommand(() => router.push(topic.permalink as string));
                  }}
                >
                  <span>{topic.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({topic.category})
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

"use client";

import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { AlertTriangle, Loader2 } from "lucide-react";

export interface MermaidProps {
  chart?: string;
  children?: React.ReactNode;
  className?: string;
  caption?: string;
}

const emptySubscribe = () => () => {};

export function Mermaid({ chart, children, className = "", caption }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Idiomatic React 19 check for client mount without cascading render warnings
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const { resolvedTheme } = useTheme();

  // Create a safe, unique HTML element ID derived from useId()
  const rawId = useId();
  const safeId = `mermaid-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // Support either `chart` prop or string children
  const rawChart = typeof chart === "string" ? chart : typeof children === "string" ? children : "";
  const chartCode = rawChart.trim();

  useEffect(() => {
    if (!isClient) return;

    if (!chartCode) {
      return;
    }

    let isCancelled = false;

    async function renderChart() {
      setIsLoading(true);
      setError(null);

      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        const isDark = resolvedTheme === "dark";

        // Initialize Mermaid with theme matching next-themes
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          themeVariables: isDark
            ? {
                darkMode: true,
                background: "#18181b",
                primaryColor: "#0284c7",
                primaryTextColor: "#f4f4f5",
                primaryBorderColor: "#38bdf8",
                lineColor: "#a1a1aa",
                secondaryColor: "#27272a",
                tertiaryColor: "#18181b"
              }
            : {
                darkMode: false,
                background: "#ffffff",
                primaryColor: "#0284c7",
                primaryTextColor: "#09090b",
                primaryBorderColor: "#0ea5e9",
                lineColor: "#71717a",
                secondaryColor: "#f4f4f5",
                tertiaryColor: "#fafafa"
              }
        });

        // Test parse first if available to catch syntax issues cleanly
        if (typeof mermaid.parse === "function") {
          try {
            await mermaid.parse(chartCode);
          } catch (parseErr: unknown) {
            if (!isCancelled) {
              const message = parseErr instanceof Error ? parseErr.message : String(parseErr);
              setError(message);
              setIsLoading(false);
            }
            return;
          }
        }

        // Render the SVG
        const { svg } = await mermaid.render(safeId, chartCode);

        if (!isCancelled) {
          setSvgContent(svg);
          setError(null);
          setIsLoading(false);
        }
      } catch (renderErr: unknown) {
        if (!isCancelled) {
          const message = renderErr instanceof Error ? renderErr.message : String(renderErr);
          setError(message);
          setSvgContent(null);
          setIsLoading(false);
        }
      } finally {
        // Clean up any temporary DOM elements Mermaid creates on error
        const tempElement = document.getElementById(`d${safeId}`);
        if (tempElement) {
          tempElement.remove();
        }
      }
    }

    renderChart();

    return () => {
      isCancelled = true;
      const tempElement = document.getElementById(`d${safeId}`);
      if (tempElement) {
        tempElement.remove();
      }
    };
  }, [chartCode, resolvedTheme, isClient, safeId]);

  // Server-side rendering fallback
  if (!isClient) {
    return (
      <div className="my-6 w-full rounded-xl border border-border/60 bg-muted/20 p-6 flex flex-col items-center justify-center min-h-[140px] text-muted-foreground animate-pulse">
        <Loader2 className="w-5 h-5 animate-spin mb-2 text-muted-foreground/60" />
        <span className="text-xs">Preparing diagram...</span>
      </div>
    );
  }

  if (!chartCode) {
    return (
      <div className="my-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center">
        <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
        <span>No diagram syntax provided to Mermaid component.</span>
      </div>
    );
  }

  return (
    <figure className={`my-6 w-full flex flex-col items-center ${className}`}>
      <div className="w-full overflow-x-auto rounded-xl border border-border/60 bg-muted/10 dark:bg-muted/5 p-4 md:p-6 shadow-sm transition-colors">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-sm">
            <Loader2 className="w-5 h-5 animate-spin mb-2 text-primary" />
            <span>Rendering diagram...</span>
          </div>
        )}

        {error && !isLoading && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm space-y-2">
            <div className="flex items-center font-semibold">
              <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
              <span>Diagram Rendering Error</span>
            </div>
            <p className="text-xs font-mono break-all opacity-90">{error}</p>
            <details className="text-xs pt-1">
              <summary className="cursor-pointer hover:underline opacity-80">
                View diagram source
              </summary>
              <pre className="mt-2 p-2 rounded bg-background/80 text-[11px] overflow-x-auto border border-border/40 font-mono">
                {chartCode}
              </pre>
            </details>
          </div>
        )}

        {!isLoading && !error && svgContent && (
          <div
            ref={containerRef}
            className="flex justify-center min-w-0 max-w-full overflow-x-auto [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:mx-auto"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>

      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground font-medium">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

import Link from "next/link";
import {
  Clock,
  BarChart,
  Code2,
  Blocks,
  Type,
  Server,
  Paintbrush
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categoryConfig: Record<string, { color: string; icon: React.ReactNode }> =
  {
    JavaScript: {
      color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
      icon: <Code2 className="w-3.5 h-3.5 mr-1.5" />
    },
    React: {
      color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
      icon: <Blocks className="w-3.5 h-3.5 mr-1.5" />
    },
    TypeScript: {
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      icon: <Type className="w-3.5 h-3.5 mr-1.5" />
    },
    "System Design": {
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      icon: <Server className="w-3.5 h-3.5 mr-1.5" />
    },
    CSS: {
      color: "text-pink-500 bg-pink-500/10 border-pink-500/20",
      icon: <Paintbrush className="w-3.5 h-3.5 mr-1.5" />
    }
  };

const frequencyColor: Record<string, string> = {
  Low: "text-muted-foreground",
  Medium: "text-green-500",
  High: "text-orange-500",
  "Very High": "text-red-500"
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TopicCard({ topic }: { topic: any }) {
  const config = categoryConfig[topic.category] || {
    color: "text-primary bg-primary/10 border-primary/20",
    icon: <Code2 className="w-3.5 h-3.5 mr-1" />
  };

  return (
    <Link href={topic.permalink} className="group outline-none block h-full">
      <div className="relative h-full rounded-2xl border border-border/60 bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 overflow-hidden flex flex-col">
        {/* Subtle gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="p-6 flex flex-col flex-1 relative z-10">
          <div className="flex items-center justify-between mb-5">
            <Badge variant="outline" className={`font-medium ${config.color}`}>
              {config.icon}
              {topic.category}
            </Badge>
            <span
              className={`text-[11px] uppercase tracking-wider font-bold ${frequencyColor[topic.interviewFrequency] || "text-muted-foreground"}`}
            >
              {topic.interviewFrequency} Freq
            </span>
          </div>

          <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {topic.title}
          </h3>

          <div className="flex flex-wrap gap-1.5 mt-auto pt-4">
            {topic.companies?.slice(0, 3).map((company: string) => (
              <span
                key={company}
                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 border border-border/40 px-2 py-1 rounded-md"
              >
                {company}
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border/40 bg-muted/10 text-xs text-muted-foreground flex items-center justify-between relative z-10">
          <div className="flex items-center font-medium">
            <BarChart className="w-4 h-4 mr-1.5 text-muted-foreground/70" />
            {topic.difficulty}
          </div>
          <div className="flex items-center font-medium">
            <Clock className="w-4 h-4 mr-1.5 text-muted-foreground/70" />
            {topic.estimatedReadTime} min
          </div>
        </div>
      </div>
    </Link>
  );
}

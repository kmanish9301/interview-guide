import { Suspense } from "react";
import fs from "fs/promises";
import path from "path";
import { QuestionsList, Question } from "@/components/questions-list";
import { Skeleton } from "@/components/ui/skeleton";

function QuestionsSkeleton() {
  return (
    <>
      <div className="mb-12">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-full max-w-2xl mb-8" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </>
  );
}

export default async function QuestionsPage() {
  // Read JSON directly from filesystem (runs only on server/build)
  const filePath = path.join(process.cwd(), "public", "questions.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const questions: Question[] = JSON.parse(fileContents);

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 max-w-4xl">
      <Suspense fallback={<QuestionsSkeleton />}>
        <QuestionsList initialQuestions={questions} />
      </Suspense>
    </div>
  );
}

import { PracticeClient } from "@/components/PracticeClient";
import { questions } from "@/data/questions";

export default function PracticePage({ searchParams }: { searchParams: { set?: string } }) {
  return <PracticeClient questions={questions} selectedSet={searchParams.set} />;
}

import { VocabularyClient } from "@/components/VocabularyClient";
import { vocabulary } from "@/data/vocabulary";

export default function VocabularyPage() {
  return <VocabularyClient words={vocabulary} />;
}

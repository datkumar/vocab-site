import type { EnglishWordEntry } from "@/models/EnglishWord";
import { HighlightedExamples } from "@/components/highlighted-egs";

// Preferred ordering of PartsOfSpeech when showing word meanings
const posOrdering = [
  "verb",
  "adjective",
  "noun",
  "adverb",
  "proper noun",
  "preposition",
  "conjunction",
  "interjection",
];

export const WordMeaningCard = ({
  wordData,
}: {
  wordData: EnglishWordEntry;
}) => {
  const sortedMeanings = [...wordData.meanings].sort((w1, w2) => {
    const w1Idx = posOrdering.indexOf(w1.partOfSpeech);
    const w2Idx = posOrdering.indexOf(w2.partOfSpeech);
    return w1Idx - w2Idx;
  });

  return (
    <div>
      {/* WORD */}
      <h2 className="font-serif text-5xl pb-5">{wordData.word}</h2>

      {/* PRONUNCIATION AUDIO (if exists) */}
      {wordData.audio && (
        <audio
          src={wordData.audio}
          controls={true}
          className="mt-3 mb-2"
        ></audio>
      )}

      {/* MEANINGS */}
      {sortedMeanings.map((entry, index) => (
        <div className="pt-5" key={index}>
          <span className="font-mono font-semibold text-xl pb-3">{`[${entry.partOfSpeech}]`}</span>
          <ul className="list-disc">
            {entry.definitions.map((definition) => (
              <li className="text-lg" key={definition}>
                {definition}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* SYNONYMS */}
      {wordData.synonyms.length > 0 && (
        <div className="pt-10">
          <h3 className="font-mono font-semibold text-xl">Synonyms</h3>
          <div className="text-lg">{wordData.synonyms.join(", ")}</div>
        </div>
      )}
      {/* ANTONYMS */}
      {wordData.antonyms.length > 0 && (
        <div className="pt-10">
          <h3 className="font-mono font-semibold text-xl">Antonyms</h3>
          <div className="text-lg">{wordData.antonyms.join(", ")}</div>
        </div>
      )}

      {/* EXAMPLES */}
      {wordData.examples.length > 0 && (
        <div className="pt-10">
          <h3 className="font-mono font-semibold text-xl">Examples</h3>
          <HighlightedExamples
            word={wordData.word}
            examples={wordData.examples}
          />
        </div>
      )}
    </div>
  );
};

import type { EnglishWordEntry } from "@/models/EnglishWord";
import { HighlightedExamples } from "@/components/highlighted-egs";

export const WordMeaningCard = ({
  wordData,
}: {
  wordData: EnglishWordEntry;
}) => {
  return (
    <div>
      {/* WORD */}
      <h2 className="font-serif text-5xl pb-5">{wordData.word}</h2>

      {wordData.audio && (
        <audio className="mt-3 mb-2" controls src={wordData.audio}></audio>
      )}

      {/* MEANINGS */}
      {wordData.meanings.map((entry, index) => (
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
          <h3 className="font-semibold text-xl">Synonyms</h3>
          <div className="text-lg">{wordData.synonyms.join(", ")}</div>
        </div>
      )}
      {/* ANTONYMS */}
      {wordData.antonyms.length > 0 && (
        <div className="pt-10">
          <h3 className="font-semibold text-xl">Antonyms</h3>
          <div className="text-lg">{wordData.antonyms.join(", ")}</div>
        </div>
      )}
      {/* EXAMPLES */}
      {wordData.examples.length > 0 && (
        <div className="pt-10">
          <h3 className="font-semibold text-xl">Examples</h3>
          <HighlightedExamples
            word={wordData.word}
            examples={wordData.examples}
          />
          {/* <ul className="list-disc">
            {wordData.examples.map((example, index) => (
              <li className="text-lg" key={index}>
                {example}
              </li>
            ))}
          </ul> */}
        </div>
      )}
    </div>
  );
};

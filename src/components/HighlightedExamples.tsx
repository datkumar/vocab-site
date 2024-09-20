export const HighlightedExamples = ({
  word,
  examples,
}: {
  word: string;
  examples: string[];
}) => {
  const getHighlightedExample = (example: string, word: string) => {
    const wordMatch = new RegExp(word, "gi");
    const highlightedContent = example.replace(
      wordMatch,
      `<strong>${wordMatch.source}</strong>`
    );
    return <span dangerouslySetInnerHTML={{ __html: highlightedContent }} />;
  };

  return (
    <ul className="list-disc">
      {examples.map((example, index) => (
        <li key={index} className="text-lg">
          {getHighlightedExample(example, word)}
        </li>
      ))}
    </ul>
  );
};

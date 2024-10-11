import clsx from "clsx";
import Link from "next/link";

// Have to specify safelist patterns for dynamic class names in Tailwind
const colorPaletteNames = [
  "gray",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];
const colorLevels = ["100", "200", "300", "400"];

const getRandomBgColor = (): string => {
  const randomColorFamily =
    colorPaletteNames[Math.floor(Math.random() * colorPaletteNames.length)];
  const randomColorLevel =
    colorLevels[Math.floor(Math.random() * colorLevels.length)];
  const result = `bg-${randomColorFamily}-${randomColorLevel}`;
  // console.log(result);
  return result;
};

export const WordCloud = ({ words }: { words: string[] }) => {
  const workingWords = words.slice(0, 40);

  return (
    <div className="max-w-6xl flex flex-wrap gap-x-3 gap-y-4 mx-auto py-10 px-5 content-evenly">
      {workingWords.map((word) => (
        <Link key={word} href={`/words/${word}`} prefetch={false}>
          <button
            key={word}
            className={clsx(
              getRandomBgColor(),
              "px-3 py-2 mx-auto rounded-md shadow-md"
            )}
          >
            <div className="font-medium ">{word}</div>
          </button>
        </Link>
      ))}
    </div>
  );
};

import clsx from "clsx";
import Link from "next/link";

// Have to specify safelist patterns for dynamic class names in Tailwind
const colorFamilies = [
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
const colorLevels = [100, 200, 300, 500, 600, 700];

const applyRandomBgAndTextColor = (): string => {
  const bgColorFamily =
    colorFamilies[Math.floor(Math.random() * colorFamilies.length)];

  const bgColorLevel =
    colorLevels[Math.floor(Math.random() * colorLevels.length)];

  const textColor = bgColorLevel < 500 ? "text-slate-900" : "text-white";

  const result = `bg-${bgColorFamily}-${bgColorLevel} ${textColor} `;
  return result;
};

export const TiledWords = ({ words }: { words: string[] }) => {
  const workingWords = words.slice(0, 40);

  return (
    <div className="max-w-6xl flex flex-wrap gap-x-4 gap-y-5 mx-auto py-12 px-6 content-evenly bg-slate-50">
      {workingWords.map((word) => (
        <Link key={word} href={`/words/${word}`} prefetch={false}>
          <button
            key={word}
            className={clsx(
              applyRandomBgAndTextColor(),
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

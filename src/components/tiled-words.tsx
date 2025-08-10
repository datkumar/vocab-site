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
const colorLevels = [200, 300, 400, 600, 700, 800];

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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {workingWords.map((word) => (
        <Link key={word} href={`/words/${word}`}>
          <div
            className={clsx(
              applyRandomBgAndTextColor(),
              "backdrop-blur-lg rounded-md shadow-md flex items-center justify-center h-16 text-center text-lg font-serif font-semibold transition hover:scale-105"
            )}
          >
            {word}
          </div>
        </Link>
      ))}
    </div>
  );
};

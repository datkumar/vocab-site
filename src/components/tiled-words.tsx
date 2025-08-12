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
    <div className="w-full grid grid-cols-3 md:grid-cols-5 gap-5 bg-orange-50 p-6 rounded-xl shadow-lg border-2 border-amber-900">
      {workingWords.map((word) => (
        <Link key={word} href={`/words/${word}`}>
          <div
            className={clsx(
              applyRandomBgAndTextColor(),
              "flex items-center justify-center h-16 text-center text-xl font-serif backdrop-blur-lg rounded-2xl shadow-md hover:scale-105"
            )}
          >
            {word}
          </div>
        </Link>
      ))}
    </div>
  );
};

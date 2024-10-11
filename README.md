# Vocabinary

- A site to store your vocabulary words and keep revising them
- Meanings and other data for your words is fetched from the [Free Dictionary API](https://dictionaryapi.dev/) and stored in your MongoDB database

## Initialization

- Install project dependencies: `pnpm i`
- Rename `.env.sample` to `.env` and set values for your environment variables
- Add a `words.txt` file in the `src/init` folder containing your list of words, where you have only **one word per line** (no need of commas)
- Run the init script: `pnpm init-words`

## Usage

- Start server for your local network: `pnpm dev-local`
- Go to `localhost:3000/words` to see a randomly generated gallery of few words. You can click on any one and you'll be taken to the details of that word

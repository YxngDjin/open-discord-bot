# open-discord-bot

A modular, multilingual Discord bot you can host yourself.

> **Status:** early development. Things will change, and there is no stable release yet.

## Features

Everything is split into **modules** that server admins can turn on and off per server with `/module`.

| Module | What it does |
|---|---|
| **Welcome** | Welcome and goodbye messages with placeholders, automatic roles for new members (with optional delay) |
| **Moderation** | Warn, timeout, kick, ban and unban with numbered cases per server and a case history per user |
| **Utility** | `/ping` |

Further modules (mod log, self roles, levels, tickets, …) are planned.

**Languages:** English and German. Command descriptions follow each user's Discord language. Public bot messages use the server language, which admins can change with `/language`.

## Commands

| Command | Who | Description |
|---|---|---|
| `/ping` | everyone | Shows the bot's latency |
| `/module list \| enable \| disable` | Manage Server | Show modules and turn them on or off |
| `/language [language]` | Manage Server | Show or change the server language |
| `/welcome show \| channel \| message \| goodbye` | Manage Server | Configure welcome and goodbye messages |
| `/welcome autorole-add \| autorole-remove \| autorole-delay` | Manage Server | Configure automatic roles |
| `/mod warn \| timeout \| kick \| ban \| unban` | Moderate Members* | Moderation actions, each creates a numbered case |
| `/mod cases` | Moderate Members | Show the last cases of a user |

\* Kick and ban additionally require the *Kick Members* or *Ban Members* permission. The bot checks this itself, and it also makes sure moderators can only act on members below their highest role.

**Placeholders** for welcome and goodbye messages: `{user}` (mention), `{username}`, `{server}`, `{memberCount}`.

## Self-hosting

### Requirements

- [Node.js](https://nodejs.org) 22 or newer
- [Docker](https://www.docker.com) with Docker Compose (for the PostgreSQL database)
- A Discord application with a bot

### 1. Create the Discord bot

1. Open the [Discord Developer Portal](https://discord.com/developers/applications) and create a **New Application**.
2. **Bot** tab:
   - Click **Reset Token** and copy the token. You need it in step 3. Never share it.
   - Under **Privileged Gateway Intents**, enable **Server Members Intent**. Without it, the welcome module does not work and the bot will not start.
3. **OAuth2 → URL Generator**:
   - Scopes: `bot` and `applications.commands`
   - Bot permissions: *View Channels*, *Send Messages*, *Manage Roles*, *Moderate Members*, *Kick Members*, *Ban Members*
   - Open the generated URL and invite the bot to your server.
4. In your server settings, drag the bot's role **above** all roles it should assign or moderate. Discord does not allow bots to manage roles above their own.

### 2. Get the code

```bash
git clone https://github.com/YxngDjin/open-discord-bot.git
cd open-discord-bot
npm ci
```

### 3. Configure

```bash
cp .env.example .env
```

Open `.env` and fill in the values. Every variable is explained in the file.

| Variable | Required | Description |
|---|---|---|
| `DISCORD_TOKEN` | yes | Your bot token |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | yes | Credentials for the database container. Choose your own password. |
| `DATABASE_URL` | yes | Connection URL for the bot, built from the three values above |
| `LOG_LEVEL` | no | `fatal`, `error`, `warn`, `log` (default), `debug` or `verbose` |
| `DEV_GUILD_ID` | no | For development only: registers commands instantly on this one server |

The bot checks the configuration on startup and tells you exactly what is missing.

### 4. Start the database

```bash
docker compose up -d
```

Wait until `docker compose ps` shows the database as **healthy**.

### 5. Prepare the database

```bash
npx prisma generate
npx prisma migrate deploy
```

### 6. Start the bot

```bash
npm run build
npm run start:prod
```

The bot logs `Logged in as …` when it is ready. Slash commands can take a moment to appear the first time.

Then, on your server:

1. `/module enable module:welcome` and/or `/module enable module:moderation`
2. Configure the modules, e.g. `/welcome channel channel:#welcome`

## Development

```bash
npm run start:dev    # start with auto-reload
npm run lint         # lint
npm run format       # format with Prettier
npm test             # run tests
```

Set `DEV_GUILD_ID` in your `.env` so command changes show up instantly on your test server.

After changing `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name <describe-your-change>
npx prisma generate
```

### Project structure

```
src/
├── core/        Foundation: config, database, Discord connection, guild sync,
│                languages, module registry. Does not know any feature module.
└── modules/     Feature modules. Each module brings its own commands,
                 listeners, settings schema and translations.
prisma/          Database schema and migrations
```

**Ground rules:**

- `core/` never imports from `modules/`. Modules register themselves with the core.
- Modules do not import each other.
- Everything a module needs lives in its own folder.
- Commands and listeners stay thin. Logic belongs in services.
- Every field in a module's settings schema has a default or is optional, and only uses JSON-compatible types.
- Every user-facing text is translated. New texts go into the module's `i18n/en.ts` and `i18n/de.ts`.

## Contributing

Bug reports and feature ideas are welcome. Please use the issue templates.

## License

[MIT](LICENSE)

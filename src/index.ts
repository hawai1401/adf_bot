import {
  Partials,
  Collection,
  Client,
  ClientUser,
  type Interaction,
} from "discord.js";
import { config } from "dotenv";
config({ quiet: true });
import { deployementEvent } from "./handlers/events.js";

export class botClient extends Client {
  public commands: Collection<
    string,
    (client: botClient, interaction: Interaction) => Promise<void>
  >;

  constructor(options: ConstructorParameters<typeof Client>[0]) {
    super(options);
    this.commands = new Collection();
  }
  // @ts-expect-error
  override user: ClientUser;
}

const client = new botClient({
  intents: 53608447,
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.SoundboardSound,
    Partials.User,
    Partials.ThreadMember,
  ],
}).setMaxListeners(0);

// Déployer les events
console.log("Déploiement des events ...");
await deployementEvent(client);
console.log("Events déployés avec succès !");
client.login(process.env.TOKEN);

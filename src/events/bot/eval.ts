import { EmbedBuilder, Message } from "discord.js";
import config from "../../../config.json" with { type: "json" };
import type { botClient } from "../../index.js";
import { createRequire } from "module";

export const type = "messageCreate";

export const event = async (client: botClient, message: Message) => {
  if (
    !message.content.startsWith(String(`${config.prefix}eval`)) ||
    (!config["owner-id"].includes(message.author.id) &&
      !config["beta-id"].includes(message.author.id))
  )
    return;

  const require = createRequire(import.meta.url);
  const { handleStop } = require("./clientReady");
  try {
    
    const code = message.content.slice(String(`${config.prefix}eval`).length + 1)
    const result = await eval(
      `(async () => {
        const stop = async () => handleStop(await client.channels.fetch("1413831946492055552"));
      ${code}
      })()`
    );
    const embed = new EmbedBuilder()
      .setTitle(
        `Commande eval effectué par ${message.author.username} (${message.author.id})`
      )
      .setFields(
        {
          name: ":computer: - Code",
          value: `\`\`\`js\n${message.content.slice(
            String(`${config.prefix}eval`).length + 1
          )}\`\`\``,
        },
        {
          name: "<:coche:1408551329026146334> - Succès",
          value: `\`\`\`${result ? result.toString() : "null"}\`\`\``,
        }
      )
      .setColor(config.embed.success)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  } catch (e: unknown) {
    const embed = new EmbedBuilder()
      .setTitle(
        `Commande eval effectué par ${message.author.username} (${message.author.id})`
      )
      .setFields(
        {
          name: ":computer: - Code",
          value: `\`\`\`js\n${message.content.slice(
            String(`${config.prefix}eval`).length + 1
          )}\`\`\``,
        },
        {
          name: "<:croix:1408551342821212230> - Erreur",
          value: `\`\`\`${String(e)}\`\`\``,
        }
      )
      .setColor(config.embed.error)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};

import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder,
} from "discord.js";
import config from "../../../config.json" with { type: "json" };
import type { botClient } from "../../index.js";
import { prisma } from "../../db/prisma.js";

export const name = "ping";
export const description =
  "Connaître la latence du bot, de la base de données et de l'API de discord.";

export const cmd_builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ]);

export const command = async (
  bot: botClient,
  interaction: ChatInputCommandInteraction
) => {
  await interaction.deferReply();

  const now = performance.now();
  await prisma.$queryRaw`SELECT 1`;
  const ping_db = performance.now() - now;

  const start = performance.now();
  await fetch("https://discord.com/api");
  const ping_api = (performance.now() - start) / 2;

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(config.embed.normal)
        .setFields(
          {
            name: "🔷 - API Discord",
            value: `**${ping_api.toFixed(2)}** ms`,
          },
          { name: ":robot: - Bot", value: `**${bot.ws.ping}** ms` },
          {
            name: ":file_cabinet: - Base de données",
            value: `**${ping_db.toFixed(2)}** ms`,
          }
        )
        .setFooter({
          text: `Demandé par ${interaction.user.tag}`,
          iconURL: interaction.user.avatarURL() as string,
        })
        .setTimestamp(),
    ],
  });
};

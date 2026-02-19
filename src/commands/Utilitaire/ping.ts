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
import { getDb } from "../../db/mongo.js";

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
  client: botClient,
  interaction: ChatInputCommandInteraction
) => {
  await interaction.deferReply();

  const now_prisma = performance.now();
  await prisma.$queryRaw`SELECT 1`;
  const ping_prisma = performance.now() - now_prisma;

  const db = getDb()
  const now_mongodb = performance.now();
  await db.admin().ping()
  const ping_mongodb = performance.now() - now_mongodb;

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
          { name: ":robot: - Bot", value: `**${client.ws.ping}** ms` },
          {
            name: ":file_cabinet: - Base de données (Prisma)",
            value: `**${ping_prisma.toFixed(2)}** ms`,
          },
          {
            name: ":file_cabinet: - Base de données (MongoDB)",
            value: `**${ping_mongodb.toFixed(2)}** ms`,
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

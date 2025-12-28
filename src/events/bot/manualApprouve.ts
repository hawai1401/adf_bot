import { EmbedBuilder, Message, TextChannel } from "discord.js";
import config from "../../../config.json" with { type: "json" };
import type { botClient } from "../../index.js";
import { prisma } from "../../db/prisma.js";

export const type = "messageCreate";

export const event = async (client: botClient, message: Message) => {
  if (
    !message.content.startsWith(String(`${config.prefix}approuve`)) ||
    !config["owner-id"].includes(message.author.id)
  )
    return;
  const guildIdError = async () => {
    const embed = new EmbedBuilder()
      .setFields({
        name: ":x: - Erreur",
        value: `> guildId invalide`,
      })
      .setColor(config.embed.error)
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  };

  const guildId = message.content.split(" ")[1];
  if (!guildId) return guildIdError();
  const serveur = await prisma.serveur.findUnique({
    where: { id: guildId },
  });
  if (!serveur) return guildIdError();
  await prisma.serveur.update({
    where: { id: guildId },
    data: {
      approuved: true,
      description: serveur.description_pending,
      description_pending: "",
      tags: serveur.tags_pending,
      tags_pending: [],
      link: serveur.link_pending,
      link_pending: "",
      pending: false,
    },
  });

  const embed = new EmbedBuilder()
    .setFields({
      name: ":white_check_mark: - Succès",
      value: `> Serveur approuvé`,
    })
    .setColor(config.embed.success)
    .setTimestamp();

  await message.reply({ embeds: [embed] });
};

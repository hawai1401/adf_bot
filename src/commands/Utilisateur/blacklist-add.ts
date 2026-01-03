import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder,
  MessageFlags,
  PermissionFlagsBits,
} from "discord.js";
import type { botClient } from "../../index.js";
import { prisma } from "../../db/prisma.js";
import config from "../../../config.json" with { type: "json" };

export const name = "blacklist-add";
export const description = "Blacklist un utilisateur.";

export const cmd_builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addUserOption((o) =>
    o
      .setName("user")
      .setDescription("L'utilisateur à blacklist.")
      .setRequired(true)
  )
  .addStringOption((o) =>
    o
      .setName("raison")
      .setDescription("La raison pour laquelle l'utilisateur sera blacklist.")
      .setRequired(true)
  )
  .addStringOption((o) =>
    o
      .setName("lien_message")
      .setDescription("Le lien vers le message contenant les preuves.")
      .setRequired(true)
  )
  .setContexts([InteractionContextType.Guild])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const command = async (
  client: botClient,
  interaction: ChatInputCommandInteraction
) => {
  await interaction.deferReply();
  const user = interaction.options.getUser("user", true);
  const raison = interaction.options.getString("raison", true);
  const lien_message = interaction.options.getString("lien_message", true);
  try {
    const blacklisted_user = await prisma.blacklist.findUniqueOrThrow({
      where: {
        id: user.id,
      },
    });
    return await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(config.embed.error)
          .setThumbnail(user.displayAvatarURL())
          .setDescription(`### :x: - ${user} est déjà blacklist !`)
          .addFields({
            name: "✏️ - raison",
            value: `> ${blacklisted_user.raison}`,
          })
          .addFields({
            name: "💬 - Message",
            value: `> ${blacklisted_user.message}`,
          }),
      ],
    });
  } catch {}

  await prisma.blacklist.create({
    data: {
      id: user.id,
      raison,
      message: lien_message,
    },
  });

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(config.embed.normal)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(
          `### :white_check_mark: - ${user} a bien été blacklist !`
        )
        .addFields({
          name: "✏️ - raison",
          value: `> ${raison}`,
        })
        .addFields({
          name: "💬 - Message",
          value: `> ${lien_message}`,
        }),
    ],
  });
};

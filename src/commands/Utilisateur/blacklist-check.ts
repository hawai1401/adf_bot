import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import type { botClient } from "../../index.js";
import { prisma } from "../../db/prisma.js";
import config from "../../../config.json" with { type: "json" };
import erreur from "../../functions/error.js";

export const name = "blacklist-check";
export const description = "Vérifier si un utilisateur est blacklist.";

export const cmd_builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addUserOption((o) =>
    o
      .setName("user")
      .setDescription("L'utilisateur à vérifier.")
      .setRequired(true)
  )
  .setContexts([InteractionContextType.Guild])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall]);

export const command = async (
  client: botClient,
  interaction: ChatInputCommandInteraction
) => {
  await interaction.deferReply();
  const user = interaction.options.getUser("user", true);
  try {
    const blacklisted_user = await prisma.blacklist.findUniqueOrThrow({
      where: {
        id: user.id,
      },
    });
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(config.embed.success)
          .setThumbnail(user.displayAvatarURL())
          .setDescription(`### :white_check_mark: - ${user} est blacklist !`)
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
  } catch {
    await erreur(`${user} n'est pas blacklist !`, interaction, {
      defered: true,
    });
  }
};

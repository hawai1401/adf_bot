import { MessageFlags, type ButtonInteraction } from "discord.js";
import type { botClient } from "../../index.js";
import { prisma } from "../../db/prisma.js";
import Container from "../../class/container.js";

export const event = async (
  client: botClient,
  interaction: ButtonInteraction
) => {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const guildId = interaction.customId.split("_")[1]!;
  const serveur = await prisma.serveur.findUnique({
    where: { id: guildId },
  });
  await prisma.serveur.update({
    where: { id: guildId },
    data: {
      approuved: true,
      description: serveur!.description_pending,
      description_pending: "",
      tags: serveur!.tags_pending,
      tags_pending: [],
      link: serveur!.link_pending,
      link_pending: "",
      pending: false,
    },
  });
  await interaction.message.delete();
  if (interaction.customId.split("_")[2] === "edited")
    await interaction.editReply({
      components: [
        new Container("success").addText(
          `### :white_check_mark: - Modifications acceptées !`
        ),
      ],
      flags: MessageFlags.IsComponentsV2,
    });
  await interaction.editReply({
    components: [
      new Container("success").addText(
        `### :white_check_mark: - Serveur accepté !`
      ),
    ],
    flags: MessageFlags.IsComponentsV2,
  });
};

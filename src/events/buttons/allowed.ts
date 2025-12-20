import { MessageFlags, type ButtonInteraction } from "discord.js";
import type { botClient } from "../../index.js";
import prisma from "../../db/prisma.js";
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
    },
  });
  await interaction.message.delete();
  await interaction.editReply({
    components: [
      new Container("success").addText(
        `### :white_check_mark: - Serveur accepté !`
      ),
    ],
    flags: MessageFlags.IsComponentsV2,
  });
};

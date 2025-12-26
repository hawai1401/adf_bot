import { MessageFlags, type ButtonInteraction } from "discord.js";
import type { botClient } from "../../index.js";
import Container from "../../class/container.js";
import prisma from "../../db/prisma.js";

export const event = async (
  client: botClient,
  interaction: ButtonInteraction
) => {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const guildId = interaction.customId.split("_")[1]!;
  await prisma.serveur.update({
    where: { id: guildId },
    data: {
      description_pending: "",
      badges_pending: [],
      link_pending: "",
      pending: false,
    },
  });
  await interaction.message.delete();
  await interaction.editReply({
    components: [
      new Container("error").addText(`### :x: - Modifications refusées !`),
    ],
    flags: MessageFlags.IsComponentsV2,
  });
};

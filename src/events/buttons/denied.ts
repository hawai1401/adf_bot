import { MessageFlags, type ButtonInteraction } from "discord.js";
import type { botClient } from "../../index.js";
import Container from "../../class/container.js";
import { prisma } from "../../db/prisma.js";

export const event = async (
  client: botClient,
  interaction: ButtonInteraction
) => {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const guildId = interaction.customId.split("_")[1]!;
  await prisma.serveur.delete({
    where: {
      id: guildId,
    },
  });
  await interaction.message.delete();
  await interaction.editReply({
    components: [new Container("error").addText(`### :x: - Serveur refusé !`)],
    flags: MessageFlags.IsComponentsV2,
  });
};

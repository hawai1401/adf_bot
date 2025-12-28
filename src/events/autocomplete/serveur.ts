import type { Interaction } from "discord.js";
import type { botClient } from "../../index.js";
import { prisma } from "../../db/prisma.js";

export const type = "interactionCreate";

export const event = async (client: botClient, interaction: Interaction) => {
  if (!interaction.isAutocomplete()) return;

  const value = interaction.options.getFocused();
  const guilds = await prisma.serveur.findMany({
    where: {
      owner: {
        discord_id: interaction.user.id,
      },
    },
  });
  if (guilds.length === 0)
    return interaction.respond([
      {
        name: "Vous n'avez aucun serveur.",
        value: "null",
      },
    ]);

  await interaction.respond(guilds.map((g) => ({ name: g.nom, value: g.id })));
};

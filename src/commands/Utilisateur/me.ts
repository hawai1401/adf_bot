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
import erreur from "../../functions/error.js";
import config from "../../../config.json" with { type: "json" };

export const name = "me";
export const description =
  "Connaître vos informations stocker en base de données.";

export const cmd_builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .setContexts([InteractionContextType.Guild])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall]);

export const command = async (
  client: botClient,
  interaction: ChatInputCommandInteraction
) => {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const user = await prisma.user.findFirst({
    where: {
      discord_id: interaction.user.id,
    },
  });

  if (!user)
    return erreur(
      "Votre id discord n'est pas dans la base de données !\nConnectez-vous au [site](https://adf.hawai1401.fr/) afin de vous enregistrer.",
      interaction,
      { defered: true }
    );

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(config.embed.normal)
        .setThumbnail(user.image)
        .addFields({
          name: "ℹ️ - Informations",
          value: `>>> **ID en base de données** : ${user.id}\n**Nom** : ${
            user.name
          }\n**Adresse mail** : ${user.email}\n**Créé le** <t:${Math.floor(
            user.createdAt.getTime() / 1000
          )}:F>\n**Mis à jour le** <t:${Math.floor(
            user.updatedAt.getTime() / 1000
          )}:F>`,
        }),
    ],
  });
};

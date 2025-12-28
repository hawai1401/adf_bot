import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  PermissionFlagsBits,
} from "discord.js";
import type { botClient } from "../../index.js";
import { prisma } from "../../db/prisma.js";
import erreur from "../../functions/error.js";
import success from "../../functions/success.js";

export const name = "whitelist";
export const description = "Whitelist un serveur.";

export const cmd_builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addStringOption((o) =>
    o
      .setName("serveur-id")
      .setDescription("L'id du serveur à whitelist")
      .setRequired(true)
  )
  .addStringOption((o) =>
    o
      .setName("user-id")
      .setDescription(
        "L'id de la base de données du owner du serveur à whitelist"
      )
      .setRequired(true)
  )
  .setContexts([InteractionContextType.Guild])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const command = async (
  client: botClient,
  interaction: ChatInputCommandInteraction
) => {
  const guildId = interaction.options.getString("serveur-id", true);
  const id = interaction.options.getString("user-id", true);
  const owner = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!owner) return erreur("ID utilisateur invalide !", interaction);
  interaction.guild?.members.me?.permissions.toArray();
  await prisma.serveur.create({
    data: {
      id: guildId,
      whitelist: true,
      pending: false,
      link_pending: "",
      tags_pending: [],
      description_pending: "",
      member_count: 0,
      nom: "",
      owner: {
        connect: {
          id,
        },
      },
    },
  });
  return success("Serveur whitelist avec succès !", interaction);
};

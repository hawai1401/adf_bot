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
  .addUserOption((o) =>
    o
      .setName("user")
      .setDescription("Le propriétaire du serveur à whitelist")
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
  const user = interaction.options.getUser("user", true);
  const owner = await prisma.user.findFirst({
    where: {
      discord_id: user.id,
    },
  });
  if (!owner)
    return erreur(
      "Cet id discord n'est pas dans la base de données !\nL'utilisateur doit se connecter au [site](https://adf.hawai1401.fr/) afin de s'enregistrer.",
      interaction
    );
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
          id: owner.id,
        },
      },
    },
  });
  return success("Serveur whitelist avec succès !", interaction);
};

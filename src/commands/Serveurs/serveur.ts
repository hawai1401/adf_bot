import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder,
} from "discord.js";
import type { botClient } from "../../index.js";
import { prisma } from "../../db/prisma.js";
import erreur from "../../functions/error.js";
import config from "../../../config.json" with { type: "json" };

export const name = "serveur";
export const description = "Connaître le status d'une de ses serveurs.";

export const cmd_builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addStringOption((o) =>
    o
      .setName("serveur")
      .setDescription("Le serveur dont vous souhaitez connaître le status.")
      .setRequired(true)
      .setAutocomplete(true)
  )
  .setContexts([InteractionContextType.Guild])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall]);

export const command = async (
  client: botClient,
  interaction: ChatInputCommandInteraction
) => {
  await interaction.deferReply();
  const guildId = interaction.options.getString("serveur", true);
  if (guildId === "null")
    return erreur(
      "Vous n'avez aucun serveur ou votre id discord n'est pas dans la base de données !",
      interaction
    );
  const guild = await prisma.serveur.findUnique({
    where: {
      id: guildId,
    },
  });
  const owner = await prisma.user.findFirst({
    where: {
      discord_id: interaction.user.id,
    },
  });
  if (!owner || owner.discord_id === "")
    return erreur(
      "Votre id discord n'est pas dans la base de données !\nConnectez-vous au [site](https://adf.hawai1401.fr/) afin de vous enregistrer.",
      interaction,
      { defered: true }
    );
  if (!guild || guild.userId !== owner?.id)
    return erreur("Merci de choisir une option valide !", interaction, {
      defered: true,
    });

  const getEmoji = (boolean: boolean) =>
    boolean ? ":white_check_mark:" : ":x:";

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(config.embed.normal)
        .setThumbnail(guild.logoURL)
        .addFields({
          name: "ℹ️ - Informations",
          value: `>>> **ID** : ${guild.id}\n**Nom** : ${
            guild.nom
          }\n**Nombre de membre** : ${
            guild.member_count
          }\n**Créé le** <t:${Math.floor(
            guild.createAt.getTime() / 1000
          )}:F>\n**Mis à jour le** <t:${Math.floor(
            guild.updatedAt.getTime() / 1000
          )}:F>`,
        })
        .addFields({
          name: "🔧 - Avancé",
          value: `>>> **Approuvé** : ${getEmoji(
            guild.approuved
          )}\n**En attente** : ${getEmoji(
            guild.pending
          )}\n**Whitelist** : ${getEmoji(guild.whitelist)}`,
        })
        .addFields({
          name: "💬 - Description",
          value:
            guild.description.length > 0
              ? guild.description
              : guild.description_pending.length > 0
              ? guild.description_pending
              : "> Aucune",
        })
        .addFields({
          name: "🎈 - Tags",
          value: `>>> ${
            guild.tags.length > 0
              ? guild.tags.map((t) => `- ${t}`).join("\n")
              : guild.tags_pending.length > 0
              ? guild.tags_pending.map((t) => `- ${t}`).join("\n")
              : "Aucun"
          }`,
        })
        .addFields({
          name: "🔗 - Lien",
          value: `> ${
            guild.link.length > 0
              ? guild.link
              : guild.link_pending.length > 0
              ? guild.link_pending
              : "Aucun"
          }`,
        }),
    ],
  });
};

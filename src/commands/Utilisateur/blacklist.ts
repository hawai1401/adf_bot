import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder,
  PermissionFlagsBits,
  User,
} from "discord.js";
import type { botClient } from "../../index.js";
import { prisma } from "../../db/prisma.js";
import config from "../../../config.json" with { type: "json" };

export const name = "blacklist";
export const description = "Blacklist des utilisateurs.";

export const cmd_builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addSubcommand((sub) =>
    sub
      .setName("add")
      .setDescription("Blacklist un utilisateur")
      .addUserOption((o) =>
        o
          .setName("user")
          .setDescription("L'utilisateur à blacklist.")
          .setRequired(true)
      )
      .addStringOption((o) =>
        o
          .setName("raison")
          .setDescription(
            "La raison pour laquelle l'utilisateur sera blacklist."
          )
          .setRequired(true)
      )
      .addStringOption((o) =>
        o
          .setName("lien_message")
          .setDescription("Le lien vers le message contenant les preuves.")
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("mass")
      .setDescription("Blacklist plusieurs utilisateurs pour le même motif.")
      .addStringOption((o) =>
        o
          .setName("raison")
          .setDescription(
            "La raison pour laquelle l'utilisateur sera blacklist."
          )
          .setRequired(true)
      )
      .addStringOption((o) =>
        o
          .setName("lien_message")
          .setDescription("Le lien vers le message contenant les preuves.")
          .setRequired(true)
      )
      .addUserOption((o) =>
        o
          .setName("user-1")
          .setDescription("Le 1er utilisateur à blacklist.")
          .setRequired(true)
      )
      .addUserOption((o) =>
        o
          .setName("user-2")
          .setDescription("Le 2e utilisateur à blacklist.")
          .setRequired(true)
      )
      .addUserOption((o) =>
        o
          .setName("user-3")
          .setDescription("Le 3e utilisateur à blacklist.")
          .setRequired(false)
      )
      .addUserOption((o) =>
        o
          .setName("user-4")
          .setDescription("Le 4e utilisateur à blacklist.")
          .setRequired(false)
      )
      .addUserOption((o) =>
        o
          .setName("user-5")
          .setDescription("Le 5e utilisateur à blacklist.")
          .setRequired(false)
      )
      .addUserOption((o) =>
        o
          .setName("user-6")
          .setDescription("Le 6e utilisateur à blacklist.")
          .setRequired(false)
      )
      .addUserOption((o) =>
        o
          .setName("user-7")
          .setDescription("Le 7e utilisateur à blacklist.")
          .setRequired(false)
      )
      .addUserOption((o) =>
        o
          .setName("user-8")
          .setDescription("Le 8e utilisateur à blacklist.")
          .setRequired(false)
      )
      .addUserOption((o) =>
        o
          .setName("user-9")
          .setDescription("Le 9e utilisateur à blacklist.")
          .setRequired(false)
      )
      .addUserOption((o) =>
        o
          .setName("user-10")
          .setDescription("Le 10e utilisateur à blacklist.")
          .setRequired(false)
      )
  )
  .setContexts([InteractionContextType.Guild])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const command = async (
  client: botClient,
  interaction: ChatInputCommandInteraction
) => {
  await interaction.deferReply();
  const raison = interaction.options.getString("raison", true);
  const lien_message = interaction.options.getString("lien_message", true);

  if (interaction.options.getSubcommand(true) === "add") {
    const user = interaction.options.getUser("user", true);
    try {
      const blacklisted_user = await prisma.blacklist.findUniqueOrThrow({
        where: {
          id: user.id,
        },
      });
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.embed.error)
            .setThumbnail(user.displayAvatarURL())
            .setDescription(`### :x: - ${user} est déjà blacklist !`)
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
    } catch {}

    await prisma.blacklist.create({
      data: {
        id: user.id,
        raison,
        message: lien_message,
      },
    });

    return await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(config.embed.success)
          .setThumbnail(user.displayAvatarURL())
          .setDescription(
            `### :white_check_mark: - ${user} a bien été blacklist !`
          )
          .addFields({
            name: "✏️ - raison",
            value: `> ${raison}`,
          })
          .addFields({
            name: "💬 - Message",
            value: `> ${lien_message}`,
          }),
      ],
    });
  }

  const users: User[] = [];

  for (let i = 1; i < 11; i++) {
    const user = interaction.options.getUser(`user-${i}`);
    if (!user) break;
    users.push(user);
  }

  await prisma.blacklist.createMany({
    data: users.map((user) => ({
      id: user.id,
      raison,
      message: lien_message,
    })),
  });

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(config.embed.success)
        .setThumbnail(
          interaction.guild?.iconURL() ?? client.user.displayAvatarURL()
        )
        .setDescription(
          `### :white_check_mark: - Tout les utilisateurs ont bien été blacklist !`
        )
        .addFields({
          name: "👥 - Utilisateurs",
          value:
            ">>> " + users.map((user) => `- ${user} (${user.id})`).join("\n"),
        })
        .addFields({
          name: "✏️ - raison",
          value: `> ${raison}`,
        })
        .addFields({
          name: "💬 - Message",
          value: `> ${lien_message}`,
        }),
    ],
  });
};

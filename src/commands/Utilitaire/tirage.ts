import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  PermissionFlagsBits,
} from "discord.js";
import type { botClient } from "../../index.js";
import erreur from "../../functions/error.js";

export const name = "tirage";
export const description =
  "Effectue un tirage au sort parmi les propriétaires.";

export const cmd_builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const command = async (
  client: botClient,
  interaction: ChatInputCommandInteraction,
) => {
  await interaction.deferReply();

  const owners = await interaction.guild?.roles.fetch("1432328421010313256");

  if (!owners)
    return await erreur(
      "Impossible de récupérer les propriétaires.",
      interaction,
      {
        defered: true,
      },
    );

  const members = owners.members;

  if (!members)
    return await erreur("Impossible de récupérer les membres.", interaction, {
      defered: true,
    });

  const randomMember = members.random();

  if (!randomMember)
    return await erreur("Impossible de récupérer un membre.", interaction, {
      defered: true,
    });

  await interaction.editReply(
    `Le propriétaire choisit est ${randomMember} :tada:`,
  );
};

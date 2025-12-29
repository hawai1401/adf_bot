import {
  ActionRowBuilder,
  ButtonBuilder,
  ContainerBuilder,
  MessageFlags,
  TextDisplayBuilder,
  type APIActionRowComponent,
  type APIButtonComponentWithCustomId,
  type APIContainerComponent,
  type APITextDisplayComponent,
  type ButtonInteraction,
} from "discord.js";
import type { botClient } from "../../index.js";
import Container from "../../class/container.js";

export const event = async (
  client: botClient,
  interaction: ButtonInteraction
) => {
  type APIButtonV2 = {
    type: 2;
    data: APIButtonComponentWithCustomId;
    url: never;
    style: never;
  };

  const vote = interaction.customId.split("_")[1] as "pour" | "contre";
  const votants = interaction.customId.split("_").slice(2);

  if (votants.includes(interaction.user.id))
    return await interaction.reply({
      components: [
        new Container("error").addText(`### :x: - Vous avez déjà voté !`),
      ],
      flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
    });

  const containerData = interaction.message
    .components[0] as APIContainerComponent;
  const container = new ContainerBuilder(
    JSON.parse(JSON.stringify(containerData))
  );

  const pour = Number(
    (containerData.components[2] as APITextDisplayComponent).content.slice(4)
  );
  const pour_btn = (container.components[6]! as ActionRowBuilder<ButtonBuilder>)
    .components[0]!;
  const pour_votants = (
    containerData.components[6]! as APIActionRowComponent<APIButtonV2>
  ).components[0]!.data.custom_id.split("_").slice(2);
  const contre = Number(
    (containerData.components[4] as APITextDisplayComponent).content.slice(4)
  );
  const contre_btn = (
    container.components[6]! as ActionRowBuilder<ButtonBuilder>
  ).components[1]!;
  const contre_votants = (
    containerData.components[6]! as APIActionRowComponent<APIButtonV2>
  ).components[1]!.data.custom_id.split("_").slice(2);

  votants.push(interaction.user.id);

  if (vote === "pour") {
    (container.components[2] as TextDisplayBuilder).setContent(
      `✅ : ${pour + 1}`
    );
    if (contre_votants.includes(interaction.user.id))
      (container.components[4] as TextDisplayBuilder).setContent(
        `❌ : ${contre - 1}`
      );
    pour_btn.setCustomId(`sondageAnonyme_pour_${votants.join("_")}`);
    contre_btn.setCustomId(
      `sondageAnonyme_contre_${contre_votants
        .filter((v) => v !== interaction.user.id)
        .join("_")}`
    );
  } else {
    (container.components[4] as TextDisplayBuilder).setContent(
      `❌ : ${contre + 1}`
    );
    if (pour_votants.includes(interaction.user.id))
      (container.components[2] as TextDisplayBuilder).setContent(
        `✅ : ${pour - 1}`
      );
    pour_btn.setCustomId(
      `sondageAnonyme_pour_${pour_votants
        .filter((v) => v !== interaction.user.id)
        .join("_")}`
    );
    contre_btn.setCustomId(`sondageAnonyme_contre_${votants.join("_")}`);
  }

  await interaction.update({
    components: [container],
    flags: MessageFlags.IsComponentsV2,
  });
};

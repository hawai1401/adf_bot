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
import { getDb } from "../../db/mongo.js";
import { ObjectId } from "mongodb";

export const event = async (
  client: botClient,
  interaction: ButtonInteraction
) => {
  interface sondage {
    _id?: ObjectId;
    name: string;
    pour: string[];
    contre: string[];
    ended: boolean;
  }

  const vote = interaction.customId.split("_")[1] as "pour" | "contre";
  const db = getDb().collection("sondage");
  const userId = interaction.user.id;

  const container = new ContainerBuilder(
    JSON.parse(JSON.stringify(interaction.message
    .components[0] as APIContainerComponent))
  );
  
  const id = interaction.customId.split("_")[2]!;
  const sondage = (await db.findOne({
    _id: new ObjectId(id),
  })) as sondage | null;
  if (!sondage)
    throw new Error("Une erreur est survenue pour trouver le sondage en db");

  if (sondage[vote].includes(userId))
    return await interaction.reply({
      components: [
        new Container("error").addText(`### :x: - Vous avez déjà voté !`),
      ],
      flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
    });

  const pour = sondage.pour.length;
  const contre = sondage.contre.length;

  if (vote === "pour") {
    (container.components[2] as TextDisplayBuilder).setContent(
      `✅ : ${pour + 1}`
    );
    sondage.pour.push(userId);
    if (sondage.contre.includes(userId)) {
      (container.components[4] as TextDisplayBuilder).setContent(
        `❌ : ${contre - 1}`
      );
      sondage.contre = sondage.contre.filter((v) => v !== userId);
    }
  } else {
    (container.components[4] as TextDisplayBuilder).setContent(
      `❌ : ${contre + 1}`
    );
    sondage.contre.push(userId);
    if (sondage.pour.includes(userId)) {
      (container.components[2] as TextDisplayBuilder).setContent(
        `✅ : ${pour - 1}`
      );
      sondage.pour = sondage.pour.filter((v) => v !== userId);
    }
  }

  delete sondage._id;
  db.findOneAndReplace({ _id: new ObjectId(id) }, sondage);

  await interaction.update({
    components: [container],
    flags: MessageFlags.IsComponentsV2,
  });
};

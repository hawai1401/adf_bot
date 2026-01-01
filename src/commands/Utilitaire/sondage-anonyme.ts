import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  MessageFlags,
  PermissionFlagsBits,
  ChannelType,
  type GuildTextBasedChannel,
  type APIContainerComponent,
  type APITextDisplayComponent,
  ContainerBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  TextDisplayBuilder,
  type APIActionRowComponent,
  type APIButtonComponentWithCustomId,
} from "discord.js";
import type { botClient } from "../../index.js";
import erreur from "../../functions/error.js";
import Container from "../../class/container.js";
import Button from "../../class/button.js";
import success from "../../functions/success.js";
import { getDb } from "../../db/mongo.js";
import { ObjectId } from "mongodb";

export const name = "sondage-anonyme";
export const description = "Faire un sondage anonyme.";
export const cmd_builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(description)
  .addSubcommand((sub) =>
    sub
      .setName("commencer")
      .setDescription("Commencer un sondage anonyme.")
      .addStringOption((o) =>
        o
          .setName("raison")
          .setDescription("Quel est la raison du sondage ?")
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("terminer")
      .setDescription("Terminer un sondage anonyme.")
      .addChannelOption((o) =>
        o
          .setName("salon")
          .setDescription(
            "Quel est le salon du message du sondage à terminer ?"
          )
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      )
  )
  .setContexts([InteractionContextType.Guild])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const command = async (
  client: botClient,
  interaction: ChatInputCommandInteraction
) => {
  if (!interaction.channel?.isSendable())
    return erreur(
      "Je ne peux pas envoyer de message dans ce salon, veuillez vérifier mes permissions !",
      interaction,
      { ephemeral: true }
    );
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const db = getDb().collection("sondage");
  if (interaction.options.getSubcommand(true) === "commencer") {
    const raison = interaction.options.getString("raison", true);
    const id = new ObjectId();
    await db.insertOne({
      _id: id,
      name: raison,
      pour: [],
      contre: [],
      ended: false,
    });
    const msg = await interaction.channel.send({
      components: [
        new Container("normal")
          .addText(`## ${raison}`)
          .addSeparator("Large")
          .addText(`✅ : 0`)
          .addSeparator("Large")
          .addText("❌ : 0")
          .addSeparator("Large")
          .addButtons(
            new Button(
              "vert",
              { text: "Pour", emoji: "✔️" },
              `sondageAnonyme_pour_${id.toString()}`
            ),
            new Button(
              "rouge",
              { text: "Contre", emoji: "✖️" },
              `sondageAnonyme_contre_${id.toString()}`
            )
          ),
      ],
      flags: MessageFlags.IsComponentsV2,
    });
    await msg.pin("Sondage, ne pas desépingler !");
    await success("Sondage envoyé avec succès !", interaction, {
      defered: true,
    });
    return;
  } else {
    const channel = interaction.options.getChannel(
      "salon",
      true
    ) as GuildTextBasedChannel;
    const pins = await channel.messages.fetchPins();
    const sondage = pins.items.find(
      (v) => v.message.author.id === client.user.id
    );
    if (!sondage)
      return erreur(
        "Sondage introuvable, vérifiez que le message est épinglé !",
        interaction,
        { defered: true }
      );
    const containerData = sondage.message
      .components[0] as APIContainerComponent;
    const container = new ContainerBuilder(
      JSON.parse(JSON.stringify(containerData))
    );

    sondage.message.unpin("Sondage terminé");

    let err = false;

    (
      container.components[6]! as ActionRowBuilder<ButtonBuilder>
    ).components.forEach((b) => {
      if (b.data.disabled) return (err = true);
      b.setDisabled(true);
    });

    if (err)
      return erreur("Sondage déjà terminé !", interaction, { defered: true });

    const pour = Number(
      (containerData.components[2] as APITextDisplayComponent).content.slice(4)
    );
    const contre = Number(
      (containerData.components[4] as APITextDisplayComponent).content.slice(4)
    );

    (container.components[2] as TextDisplayBuilder).setContent(
      `✅ : ${pour} (${((pour / (pour + contre)) * 100).toFixed(2)}%)`
    );
    (container.components[4] as TextDisplayBuilder).setContent(
      `❌ : ${contre} (${((contre / (pour + contre)) * 100).toFixed(2)}%)`
    );

    type APIButtonV2 = {
      type: 2;
      data: APIButtonComponentWithCustomId;
      url: never;
      style: never;
    };

    const id = (
      containerData.components[6] as APIActionRowComponent<APIButtonV2>
    ).components[0]!.data.custom_id.split("_")[2]!;

    await db.findOneAndUpdate({ _id: new ObjectId(id) }, { ended: true });

    await sondage.message.edit({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
    });
    await success("Sondage terminé avec succès !", interaction, {
      defered: true,
    });
  }
};

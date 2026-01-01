import { EmbedBuilder, Message } from "discord.js";
import config from "../../../config.json" with { type: "json" };
import type { botClient } from "../../index.js";
import { prisma } from "../../db/prisma.js";
import { PrismaClientKnownRequestError } from "@prisma/client-runtime-utils";

export const type = "messageCreate";

export const event = async (client: botClient, message: Message) => {
  if (
    !message.content.startsWith(String(`${config.prefix}cleardbcache`)) ||
    !config["owner-id"].includes(message.author.id)
  )
    return;

  try {
    await prisma.$accelerate.invalidateAll();
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P6003") {
        await message.reply({
          embeds: [
            new EmbedBuilder()
              .setFields({
                name: ":x: - Erreur",
                value: `> Rate Limit, réessayez plus tard.`,
              })
              .setColor(config.embed.error)
              .setTimestamp(),
          ],
        });
      }
    }
    await message.reply({
      embeds: [
        new EmbedBuilder()
          .setFields({
            name: ":x: - Erreur",
            value: `> Une erreur est survenue`,
          })
          .setColor(config.embed.error)
          .setTimestamp(),
      ],
    });
    throw e;
  }

  await message.reply({
    embeds: [
      new EmbedBuilder()
        .setFields({
          name: ":white_check_mark: - Succès",
          value: `> Serveur approuvé`,
        })
        .setColor(config.embed.success)
        .setTimestamp(),
    ],
  });
};

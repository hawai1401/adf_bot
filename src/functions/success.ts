import {
  ChatInputCommandInteraction,
  ButtonInteraction,
  type AnySelectMenuInteraction,
} from "discord.js";
import Container from "../class/container.js";

export default async function success(
  message: string,
  interaction:
    | ChatInputCommandInteraction
    | ButtonInteraction
    | AnySelectMenuInteraction,
  options?: {
    defered?: boolean;
    ephemeral?: boolean;
  }
) {
  const res = {
    components: [
      new Container("success").addText(`### :white_check_mark: - ${message}`),
    ],
    flags: 32768,
  };
  if (!options?.defered && options?.ephemeral) res.flags = 32832;
  if (options?.defered) return interaction.editReply(res);
  if (interaction instanceof ChatInputCommandInteraction)
    return interaction.reply(res);
  return interaction.update(res);
}

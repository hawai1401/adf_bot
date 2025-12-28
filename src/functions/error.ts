import {
  ChatInputCommandInteraction,
  ButtonInteraction,
  type AnySelectMenuInteraction,
} from "discord.js";
import Container from "../class/container.js";

export default async function erreur(
  erreur: string,
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
    components: [new Container("error").addText(`### :x: - ${erreur}`)],
    flags: 32768,
  };
  if (!options?.defered && options?.ephemeral) res.flags = 32832;
  if (options?.defered) return interaction.editReply(res);
  if (interaction instanceof ChatInputCommandInteraction)
    return interaction.reply(res);
  return interaction.update(res);
}

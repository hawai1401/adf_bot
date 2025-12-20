import {
  StringSelectMenuOptionBuilder,
  type ComponentEmojiResolvable,
} from "discord.js";

export default class selectMenuOption extends StringSelectMenuOptionBuilder {
  optionBuilder = new StringSelectMenuOptionBuilder();

  constructor(
    label: string,
    value: string,
    options?: {
      emoji?: ComponentEmojiResolvable;
      description?: string;
      default?: boolean;
    }
  ) {
    super();
    this.optionBuilder.setLabel(label).setValue(value);
    if (options?.emoji) this.optionBuilder.setEmoji(options.emoji);
    if (options?.description)
      this.optionBuilder.setDescription(options.description);
    if (options?.default) this.optionBuilder.setDefault(options.default);
  }

  toJSON() {
    return this.optionBuilder.toJSON();
  }
}

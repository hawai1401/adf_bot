import {
  ButtonBuilder,
  ButtonStyle,
  type ComponentEmojiResolvable,
} from "discord.js";

type btn_color = "bleu" | "gris" | "rouge" | "vert";
type btn_link = "lien";
type btn = btn_color | btn_link;
const color_buttonStyle: Record<btn, ButtonStyle> = {
  bleu: ButtonStyle.Primary,
  gris: ButtonStyle.Secondary,
  vert: ButtonStyle.Success,
  rouge: ButtonStyle.Danger,
  lien: ButtonStyle.Link,
};

/**
 * Créer un bouton
 */
export default class Button extends ButtonBuilder {
  button = new ButtonBuilder();

  /**
   * Créer un bouton de type lien
   * @param type Type de bouton
   * @param content Contenu du bouton
   * @param link Lien
   */
  constructor(
    type: btn_link,
    content: { text?: string; emoji?: ComponentEmojiResolvable },
    link: string
  );
  /**
   * Créer un bouton classique
   * @param color Couleur
   * @param content Contenu
   * @param customID CustomID
   */
  constructor(
    color: btn_color,
    content: { text?: string; emoji?: ComponentEmojiResolvable },
    customID?: string
  );
  constructor(
    color: btn,
    content: { text?: string; emoji?: ComponentEmojiResolvable },
    customID_Link: string | undefined
  ) {
    super();
    this.button.setStyle(color_buttonStyle[color]);
    if (content.text) this.button.setLabel(content.text);
    if (content.emoji) this.button.setEmoji(content.emoji);
    if (color === "lien") {
      this.button.setURL(customID_Link as string);
    } else if (customID_Link) {
      this.button.setCustomId(customID_Link);
    }
  }

  /**
   * Changer la couleur du bouton
   * @param color Nouvelle couleur du bouton
   */
  setColor(color: btn_color) {
    this.button.setStyle(color_buttonStyle[color]);
    return this;
  }

  /**
   * Changer le contenu du bouton
   * @param content Contenu du bouton
   */
  setContent(content: { text?: string; emoji?: ComponentEmojiResolvable }) {
    if (content.text) this.button.setLabel(content.text);
    if (content.emoji) this.button.setEmoji(content.emoji);
    return this;
  }

  /**
   * Changer/Set le customID
   * @param customID CustomID
   */
  setCustomID(customID: string) {
    this.button.setCustomId(customID);
    return this;
  }

  /**
   * Désactiver le bouton
   */
  setDisabled() {
    this.button.setDisabled(true);
    return this;
  }

  toJSON() {
    return this.button.toJSON()
  }
}

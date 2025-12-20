import {
  SeparatorSpacingSize,
  ButtonBuilder,
  ChannelSelectMenuBuilder,
  ContainerBuilder,
  FileBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  SectionBuilder,
  SeparatorBuilder,
  StringSelectMenuBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  UserSelectMenuBuilder,
  ActionRowBuilder,
} from "discord.js";
import colors from "../../config.json" with { type: "json" }
import Button from "./button.js";

type embedColor =
  | "normal"
  | "success"
  | "success_2"
  | "warn"
  | "error"
  | "question";
type size = "Small" | "Large";
type selector =
  | StringSelectMenuBuilder
  | UserSelectMenuBuilder
  | ChannelSelectMenuBuilder
  | MentionableSelectMenuBuilder
  | RoleSelectMenuBuilder;

type Component =
  | "Separator"
  | "Text"
  | "Button"
  | "Selector"
  | "Section"
  | "File"
  | "Media";
type ComponentArgs<T extends Component> = T extends "Separator"
  ? [size: size, visible?: boolean]
  : T extends "Text"
  ? [content: string]
  : T extends "Button"
  ? [component: ButtonBuilder]
  : T extends "Selector"
  ? [component: selector]
  : T extends "Section"
  ? [content: string, accessory?: ButtonBuilder | ThumbnailBuilder]
  : T extends "File"
  ? [url: string, spoiler: boolean]
  : T extends "Media"
  ? [url: string, spoiler: boolean, description?: string]
  : [];

/**
 * Créer un nouveau container de composants.
 */
export default class Container {
  readonly container = new ContainerBuilder();

  /**
   * @param color La couleur de l'embed :
   * - `normal` : Couleur normale.
   * - `succes` : Couleur verte, semblable à celle du succès.
   * - `warn` : Couleur orange, semblable à celle d'un avertissement.
   * - `error` : Couleur rouge, semblabla à celle d'une erreur.
   * - `question` : Couleur bleue, semblable à celle d'une interrogation.
   */
  constructor(color?: embedColor) {
    if (color) this.container.setAccentColor(colors.embed[color]);
  }

  /**
   * Retourne le nombre de composant du container.
   */
  get length() {
    return this.container.components.length;
  }

  /**
   * @param color La couleur de l'embed :
   * - `normal` : Couleur normale.
   * - `succes` : Couleur verte, semblable à celle du succès.
   * - `warn` : Couleur orange, semblable à celle d'un avertissement.
   * - `error` : Couleur rouge, semblabla à celle d'une erreur.
   * - `question` : Couleur bleue, semblable à celle d'une interrogation.
   */
  setColor(color: embedColor) {
    this.container.setAccentColor(colors.embed[color]);
    return this;
  }

  /**
   * Ajouter un séparateur.
   * @param size La taille de l'espacement créer par le séparateur :
   * - `Small` : Petit
   * - `Large` : Grand
   * @param visible Le trait du séparateur doit-il apparaître ?
   */
  addSeparator(size: size, visible: boolean = true) {
    this.container.addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize[size])
        .setDivider(visible)
    );
    return this;
  }

  /**
   * Ajouter un bloc de texte.
   * @param text Le texte à ajouter.
   */
  addText(text: string) {
    this.container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(text)
    );
    return this;
  }

  /**
   * Ajouter un ou plusieurs boutons.
   * @param component Les boutons à ajouter. La limite est de 5 boutons !
   */
  addButtons(...component: Button[]) {
    if (component.length > 5)
      throw new Error(
        "Vous ne pouvez pas ajouter plus de 5 boutons à la fois."
      );

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(...component);
    this.container.addActionRowComponents(row);
    return this;
  }

  /**
   * Ajouter un sélécteur.
   * @param component Le sélecteur à ajouter.
   */
  addSelectMenu(component: selector) {
    this.container.addActionRowComponents(
      new ActionRowBuilder<selector>().addComponents(component)
    );
    return this;
  }

  /**
   * Ajouter une section.
   * @param content Le texte de la section.
   * @param accessory Ajouter un bouton OU un thumbail à la section.
   */
  addSection(content: string, accessory: Button | ThumbnailBuilder) {
    const sectionBuilder = new SectionBuilder().addTextDisplayComponents(
      new TextDisplayBuilder().setContent(content)
    );

    if (accessory?.constructor.name === "Button")
      sectionBuilder.setButtonAccessory(accessory as ButtonBuilder);
    if (accessory?.constructor.name === "ThumbnailBuilder")
      sectionBuilder.setThumbnailAccessory(accessory as ThumbnailBuilder);

    this.container.addSectionComponents(sectionBuilder);
    return this;
  }

  /**
   * Ajouter un fichier.
   * @param url L'url vers le fichier à ajouter.
   * @param spoiler Le fichier doit-il être défini comme spoiler ?
   */
  addFile(url: string, spoiler: boolean = false) {
    this.container.addFileComponents(
      new FileBuilder().setURL(url).setSpoiler(spoiler)
    );
    return this;
  }

  /**
   * Ajouter une image.
   * @param url L'url vers l'image à ajouter.
   * @param spoiler L'image doit-elle être définie comme spoiler ?
   * @param description Une description de l'image.
   */
  addMedia(url: string, spoiler: boolean = false, description?: string) {
    const item = new MediaGalleryItemBuilder().setURL(url).setSpoiler(spoiler);
    if (description) item.setDescription(description);
    this.container.addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(item)
    );
    return this;
  }

  /**
   * Supprimer et/ou ajouter des composants à un index précis.
   * @param index L'index sur lequel vous voulez vous positionner.
   * @param deleteCount Le nombre de composants à supprimer.
   */
  splice(index: number, deleteCount: number): this;
  /**
   * Supprimer et/ou ajouter des composants à un index précis.
   * @param index L'index sur lequel vous voulez vous positionner.
   * @param deleteCount Le nombre de composants à supprimer.
   * @param type Le type de composants à ajouter.
   * @param args Les arguments correspondant au type.
   */
  splice<T extends Component>(
    index: number,
    deleteCount: number,
    type?: T,
    ...args: ComponentArgs<T>
  ): this;
  splice<T extends Component>(
    index: number,
    deleteCount: number,
    type?: T,
    ...args: ComponentArgs<T>
  ) {
    if (type && args) {
      if (type === "Separator") {
        const isVisible = (args[1] as boolean) || true;
        this.container.spliceComponents(
          index,
          deleteCount,
          new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize[args[0] as size])
            .setDivider(isVisible)
        );
      }
      if (type === "Text")
        this.container.spliceComponents(
          index,
          deleteCount,
          new TextDisplayBuilder().setContent(args[0] as string)
        );
      if (type === "Button")
        this.container.spliceComponents(
          index,
          deleteCount,
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            args[0] as ButtonBuilder
          )
        );
      if (type === "Selector")
        this.container.spliceComponents(
          index,
          deleteCount,
          new ActionRowBuilder<selector>().setComponents(args[0] as selector)
        );
      if (type === "Section") {
        const accessory = args[1] as ButtonBuilder | ThumbnailBuilder;
        const sectionBuilder = new SectionBuilder().addTextDisplayComponents(
          new TextDisplayBuilder().setContent(args[0] as string)
        );

        if (accessory) {
          if (accessory instanceof ButtonBuilder) {
            sectionBuilder.setButtonAccessory(accessory);
          } else {
            sectionBuilder.setThumbnailAccessory(accessory);
          }
        }

        
        this.container.spliceComponents(index, deleteCount, sectionBuilder);
      }
      if (type === "File")
        this.container.spliceComponents(
          index,
          deleteCount,
          new FileBuilder()
            .setURL(args[0] as string)
            .setSpoiler((args[1] as boolean) || false)
        );
      if (type === "Media")
        this.container.spliceComponents(
          index,
          deleteCount,
          new MediaGalleryBuilder().addItems(
            new MediaGalleryItemBuilder()
              .setURL(args[0] as string)
              .setSpoiler((args[1] as boolean) || false)
          )
        );
        return this;
      }
    this.container.spliceComponents(index, deleteCount);
    return this;
  }

  toJSON() {
    return this.container.toJSON();
  }

  /**
   * Supprime le dernier composant du container.
   */
  pop() {
    this.container.components.pop()
    return this
  }
}

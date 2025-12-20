import type { botClient } from "../index.js";

import { REST, Routes } from "discord.js";
import config from "../../config.json" with {type: "json"};
import * as logs from "../logger.js";
import fs from "fs";

export const deployementSlash = async (bot: botClient) => {
  // Création de la liste des commandes

  const tab_commands = [];

  // Ajout des commandes à la liste

  const categorie = fs.readdirSync("./dist/commands", { encoding: "utf-8" });

  for (const folderName of categorie) {
    const commands = fs.readdirSync(`./dist/commands/${folderName}`, {
      encoding: "utf-8",
    });
    for (const command of commands) {
      if (command.endsWith(".js")) {
        const actual_command = await import(
          `../commands/${folderName}/${command}`
        );
        if (actual_command.name && actual_command.description) {
          tab_commands.push(actual_command.cmd_builder.toJSON());

          // Config la commande
          try {
            bot.commands.set(actual_command.name, actual_command.command);
            logs.deployementSlash(actual_command.name, true);
          } catch (error) {
            // Gestion des erreurs
            logs.deployementSlash(actual_command.name, false);

            console.error(`Une erreur est survenue avec une commande !`);
            console.group();
            console.log(`Commande : ${command}`);
            console.log(`Raison : Impossible de set la commande`);
            console.log(`Erreur : ${error}`);
            console.groupEnd();
          }
        } else {
          // Gestion des erreurs
          logs.deployementSlash(command, false);

          console.error(`Une erreur est survenue avec une commande !`);
          console.group();
          console.log(`Raison : Des propriétées sont manquantes.`);
          console.log(`Emplacement : /commands/${folderName}/`);
          console.log(`Fichier : ${command}`);
          console.groupEnd();
        }
      } else {
        // Gestion des erreurs
        console.info(`Un fichier inconnu a été trouvé !`);
        console.group();
        console.log(`Emplacement : /commands/${folderName}/`);
        console.log(`Fichier : ${command}`);
        console.groupEnd();
      }
    }
  }

  // Déployer les commandes slash globalement

  const rest = new REST({ version: "10" }).setToken(
    process.env.TOKEN as string
  );

  try {
    console.log("Déploiement globales des slash commandes ...");

    await rest.put(Routes.applicationCommands(config["bot-id"]), {
      body: tab_commands,
    });

    console.log("Commandes globales déployées avec succès !");
  } catch (error) {
    console.error(error);
  }
};

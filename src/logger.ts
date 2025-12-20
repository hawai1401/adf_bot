interface str {
  [key: string]: string;
}

const colorCodes: str = {
  noir: "0",
  rouge: "1",
  vert: "2",
  jaune: "3",
  bleu: "4",
  violet: "5",
  ciel: "6",
  blanc: "7",
};
const params: str = {
  b: "1",
  intensité: "2",
  i: "3",
  u: "4",
  inversé: "7",
  barré: "9",
};

export const erreur = (origin: any, err: any) => {
  console.group(
    `\x1b[1;31m[\x1b[0m\x1b[41;1m Erreur \x1b[0m\x1b[1;31m] \x1b[0m\x1b[31mUne erreur est survenue !\x1b[0m`
  );
  console.log(
    `\x1b[1;31m[\x1b[0m\x1b[41;1m Origine \x1b[0m\x1b[1;31m] \x1b[0m`,
    origin
  );
  console.log(
    `\x1b[1;31m[\x1b[0m\x1b[41;1m Erreur \x1b[0m\x1b[1;31m] \x1b[0m\x1b[31m${err}\x1b[0m`
  );
  console.groupEnd();
};

const color_normal = 4;
export const normal = (message: string) =>
  console.log(
    `\x1b[1;3${color_normal}m[\x1b[0m\x1b[4${color_normal};1m Log \x1b[0m\x1b[1;3${color_normal}m] \x1b[0m\x1b[3${color_normal}m${message}\x1b[0m`
  );

const color = (color: string, nom: string, contenu: string) => {
  let code = colorCodes[color];
  console.log(
    `\x1b[1;3${code}m[\x1b[0m\x1b[4${code};37;1m ${nom} \x1b[0m\x1b[1;3${code}m] \x1b[0m\x1b[3${code}m${contenu}\x1b[0m`
  );
};

export function custom() {
  let parametres = "";
  for (let i = 1; i < arguments.length; i++) {
    const element: string = arguments[i];
    parametres += ";";
    if (element && i === 1) {
      parametres += "3" + colorCodes[element];
    }
    if (element && i === 2) {
      arguments[0] = ` ${arguments[0]} `;
      parametres += "4" + colorCodes[element];
    }
    if (i > 2) {
      parametres += params[element];
    }
  }
  console.log(`\x1b[${parametres}m${arguments[0]}\x1b[0m`);
}

export function eventSlash(
  name: string,
  user_name: string,
  user_id: string,
  server_name: string,
  server_id: string
) {
  const reset_color = `\x1b[0m\x1b[3${colorCodes.blanc}m`;
  const text_color = `\x1b[0m\x1b[3${colorCodes.bleu}m`;

  const now = new Date();
  const heure =
    now.getHours().toString().length === 1
      ? `0${now.getHours()}`
      : now.getHours();
  const minute =
    now.getMinutes().toString().length === 1
      ? `0${now.getMinutes()}`
      : now.getMinutes();
  const seconde =
    now.getSeconds().toString().length === 1
      ? `0${now.getSeconds()}`
      : now.getSeconds();

  const time = text_color + `${heure}:${minute}:${seconde}` + reset_color;
  const type = text_color + "CMD" + reset_color;
  const cmd = text_color + name + reset_color;
  const user = text_color + `${user_name} | ${user_id}` + reset_color;
  const server =
    text_color +
    `${server_name.length > 0 ? `${server_name} | ${server_id}` : server_id}` +
    reset_color;

  console.log(
    `\x1b[3${colorCodes.blanc}m` +
      `[ ${time} ][ ${type} ][ ${cmd} ][ ${user} ][ ${server} ]` +
      "\x1b[0m"
  );
}

export function deployementSlash(name: string, success: boolean) {
  const reset_color = `\x1b[0m\x1b[3${colorCodes.blanc}m`;
  const text_color = `\x1b[0m\x1b[3${colorCodes.bleu}m`;
  const cmd = text_color + name + reset_color;
  const nom = text_color + "CMD" + reset_color;

  if (success === true) {
    const status_color = `\x1b[0m\x1b[3${colorCodes.vert}m`;
    const statut = status_color + "Success" + reset_color;

    console.log(`${reset_color}[ ${nom} ][ ${statut} ][ ${cmd} ]`);
  } else {
    const status_color = `\x1b[0m\x1b[3${colorCodes.rouge}m`;
    const statut = status_color + "Failed" + reset_color;

    console.log(`${reset_color}[ ${nom} ][ ${statut} ][ ${cmd} ]`);
  }
}

export function deployementPrefix(name: string, success: boolean) {
  const reset_color = `\x1b[0m\x1b[3${colorCodes.blanc}m`;
  const text_color = `\x1b[0m\x1b[3${colorCodes.jaune}m`;
  const status_color = `\x1b[0m\x1b[3${colorCodes.vert}m`;

  const cmd = text_color + name + reset_color;
  const nom = text_color + "CMD" + reset_color;
  const statut = status_color + "Success" + reset_color;

  if (success === true) {
    const status_color = `\x1b[0m\x1b[3${colorCodes.vert}m`;
    const statut = status_color + "Success" + reset_color;

    console.log(`${reset_color}[ ${nom} ][ ${statut} ][ ${cmd} ]`);
  } else {
    const status_color = `\x1b[0m\x1b[3${colorCodes.rouge}m`;
    const statut = status_color + "Failed" + reset_color;

    console.log(`${reset_color}[ ${nom} ][ ${statut} ][ ${cmd} ]`);
  }
}

export function deployementEvent(name: string, success: boolean) {
  const reset_color = `\x1b[0m\x1b[3${colorCodes.blanc}m`;
  const text_color = `\x1b[0m\x1b[3${colorCodes.violet}m`;
  const cmd = text_color + name + reset_color;
  const nom = text_color + "EVENT" + reset_color;

  if (success === true) {
    const status_color = `\x1b[0m\x1b[3${colorCodes.vert}m`;
    const statut = status_color + "Success" + reset_color;

    console.log(`${reset_color}[ ${nom} ][ ${statut} ][ ${cmd} ]`);
  } else {
    const status_color = `\x1b[0m\x1b[3${colorCodes.rouge}m`;
    const statut = status_color + "Failed" + reset_color;

    console.log(`${reset_color}[ ${nom} ][ ${statut} ][ ${cmd} ]`);
  }
}

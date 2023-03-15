export const preloadHandlebarsTemplates = async function () {
  // Define template paths to load
  let templatePaths = {};

  const templates = {
    "ItemSheets": [
      "sheets/items/elements-sheet.hbs",
      "sheets/items/goals-sheet.hbs"
    ],
    "ActorSheets": [
      "sheets/actors/hero-sheet.hbs"
    ],
    "Dialogs": [
      "dialogs/modify-attrs-roll.hbs",
      "dialogs/actor-item-remove.hbs"
    ],
    "Chats": [
      "chats/weapon-roll.hbs",
      "chats/attrs-roll.hbs"
    ]
  };

  for (const [group, tpls] of Object.entries(templates)) {
    tpls.forEach(el => {
      const key = el.split(/(.*)\.hbs/)[1].replaceAll("/", '-');
      templatePaths[key] = `${game.system_path}/templates/${el}`;
    })
  };

  // Load the template parts
  return await loadTemplates(templatePaths); 
};
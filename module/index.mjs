import { CZT } from "./config.mjs";
import { initializeHandlebars } from "./handlebars/init.mjs";
import { registerSettings } from "./settings.mjs";

import * as CztUtility from "./utilities/_module.mjs";

/* multicontrollers */
/*
import { CztItemSheet } from "./items/ProxyItemSheet.mjs";
import { CztItem } from "./items/ProxyItem.mjs";
import { CztActorSheet } from "./actors/ProxyActorSheet.mjs";
import { CztActor } from "./actors/ProxyActor.mjs";
*/
/* single controller */
import { CztItemSheet } from "./items/SimpleItemSheet.mjs";
import { CztItem } from "./items/SimpleItem.mjs";
import { CztActorSheet } from "./actors/SimpleActorSheet.mjs";
import { CztActor } from "./actors/SimpleActor.mjs";

Hooks.once("init", function () {
  
  game.logger = new CztUtility.Log(true);

  CONFIG.CZT = CZT;
  // Необходимо для вызова шаблонов из кода
  // чтобы не прописывать полные пути, 
  // а потом их вечно менять, менять, менять
  game.system_path = `systems/${game.system.id}`;
  CONFIG.Item.documentClass = CztItem;
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(game.system.id, CztItemSheet, {
    label: "CZT.Sheet.Item",
    makeDefault: true
  });

  CONFIG.Actor.documentClass = CztActor;
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(game.system.id, CztActorSheet, {
    label: "CZT.Sheet.Actor",
    makeDefault: true 
  });
  
  // Pre-load HTML templates
  initializeHandlebars();
  registerSettings();
});

// Activate chat listeners
// eslint-disable-next-line no-unused-vars
Hooks.on("renderChatLog", (log, html, data) => {
  
});
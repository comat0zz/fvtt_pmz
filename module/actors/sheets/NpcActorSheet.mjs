import { BaseActorSheet } from "../BaseActorSheet.mjs";

/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class NpcActorSheet extends BaseActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [game.system.id, "sheet", "actor", "actor-npc"],
      width: 720,
      height: 800,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "properties"}]
    });
  }

  /** @inheritdoc */
  getData(options) {
    const context = super.getData(options);

    context.config = CONFIG.CZT;
    context.systemData = context.data.system;
    
    context.isWeapons = context.items.filter((i) => i.type === "weapon");
    context.isArmor = context.items.filter((i) => i.type === "armor");
    context.isEquip = context.items.filter((i) => i.type === "equipment");

    game.logger.log(context)
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

  }
}
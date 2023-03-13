import { BaseItemSheet } from "./BaseItemSheet.mjs";

export class CztItemSheet extends BaseItemSheet {
  
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [game.system.id, "sheet", "item", "item-simple"],
      width: 520,
      height: 410,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "properties"}]
    });
  }

}
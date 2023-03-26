import { BaseActorSheet } from "./BaseActorSheet.mjs";
import * as CztUtility from "../utilities/_module.mjs";

/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class CztActorSheet extends BaseActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [game.system.id, "sheet", "actor", "actor-simple"],
      width: 1000,
      height: 800,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "properties"}],
      dragDrop: [
        {
          dropSelector: ".actor-items-equipment", 
          dragSelector: ".item"
        }
      ]
    });
  }

  /** @inheritdoc */
  getData(options) {
    const context = super.getData(options);

    context.systemData = context.data.system;
    context.config = CONFIG.CZT;

    game.logger.log(context)
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('.approach-block').click(evt => this._onApprClick(evt));
    html.find('.click-cube-live').click(evt => this._onCubeClick(evt));
    html.find('.put-goals').click(evt => this._putHeroGoal(evt));
    html.find('.goal-delete').click(evt => this._delHeroGoal(evt));
  }

  async _delHeroGoal(evt) {
    evt.preventDefault();
    const hero_id = $(evt.currentTarget).closest('table').attr('hero-id');
    const item_id = $(evt.currentTarget).closest('td').attr('item-id');
    const heroes = duplicate(this.actor.system.subHeroes);
    const goals = heroes[hero_id].goals;
    let els = [];
    goals.forEach(element => {
      if(element.id != item_id) {
        els.push(element);
      }
    });
    heroes[hero_id].goals = els;
    await this.actor.update({ "system.subHeroes" : heroes } );
  }

  async _putHeroGoal(evt) {
    evt.preventDefault();
    const hero_id = $(evt.currentTarget).closest('div').attr('hero-id');
    const heroes = duplicate(this.actor.system.subHeroes);
    if(heroes[hero_id].goals.length == 2) return;
    let cards = game.items.filter((i) => i.type === "goals");
    let cards_len = cards.length;
    if(cards_len === 0) {
      const pack = game.packs.get(game.system.id + '.goals');
      cards = await pack.getDocuments();
      cards_len = cards.length;
    } 
    const rnd = CztUtility.getRandomInt(0, cards_len - 1);
    const item = cards[rnd];

    heroes[hero_id].goals.push({
      "id": randomID(),
      "name": item.name,
      "desc": item.system.description,
      "item_id": item._id,
      "img": item.img
    });
    
    await this.actor.update({ "system.subHeroes" : heroes } );
  }

  _onCubeClick(evt) {
    evt.preventDefault();
    const hero_id = $(evt.currentTarget).closest('span').attr('hero-id');
    const cube_id = $(evt.currentTarget).attr('item-id');
    let subHeroes = duplicate(this.actor.system.subHeroes);
    subHeroes[hero_id].cubeLive[cube_id] = !subHeroes[hero_id].cubeLive[cube_id];
    this.actor.update({ "system.subHeroes" : subHeroes } );
  }

  _onApprClick(evt) {
    evt.preventDefault();
    const appr_id = $(evt.currentTarget).closest('span').attr('appr-id');
    let approaches = duplicate(this.actor.system.approaches);
    if(approaches[appr_id] != game.user.color) {
      approaches[appr_id] = game.user.color;
    }else{
      approaches[appr_id] = "";
    }
    this.actor.update({ "system.approaches" : approaches } );
  }
 
  /** @override */
  async _onDrop(evt) { 
    evt.preventDefault();
    const dragData = JSON.parse(evt.dataTransfer.getData("text/plain"));
    const typeHero = $(evt.currentTarget).closest('.actor-items-equipment').attr('hero-id');
    if(dragData.type != 'Item') return;
    const Item = await CztUtility.extractItem(dragData);
    if(Item.type != 'elements') return;
    let elements = duplicate(this.actor.system.subHeroes[typeHero].elements);
    elements.push(
      {
        "id": randomID(),
        "name": Item.name,
        "item_id": Item._id,
        "img": Item.img
      }
    );
    await this.actor.update({ [`system.subHeroes.${typeHero}.elements`] : elements } );
  }
}
import * as CztUtility from "../utilities/_module.mjs";

export class BaseActorSheet extends ActorSheet {
  /** @override */
  get template() {
    return `${game.system_path}/templates/sheets/actors/${this.actor.type}-sheet.hbs`;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('.actor-item-remove').click(evt => this._onActorItemRemove(evt));
  }
  
  async _deleteItem(item_id, hero_id) {
    console.log(item_id, hero_id);
    const elements = duplicate(this.actor.system.subHeroes[hero_id].elements);
    let elmnts = [];

    elements.forEach(element => {
      if(element.id != item_id) {
        elmnts.push(element)
      }
    });

    await this.actor.update({ [`system.subHeroes.${hero_id}.elements`] : elmnts } );
  }

  async _onActorItemRemove(evt) {
    evt.preventDefault();
    const item_id = $(evt.currentTarget).closest('.actor-items-single').attr('item-id');
    const hero_id = $(evt.currentTarget).closest('.actor-items-equipment').attr('hero-id');
    const tpl = await renderTemplate(`${game.system_path}/templates/dialogs/actor-item-remove.hbs`);
    return new Promise(resolve => {
      const data = {
        title: game.i18n.localize("CZT.Common.DelConfirm"),
        content: tpl,
        buttons: {
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize("CZT.Common.Buttons.Cancel"),
            callback: html => resolve({cancelled: true})
          },
          yes: {
            icon: '<i class="fas fa-check"></i>',
            label: game.i18n.localize("CZT.Common.Buttons.Remove"),
            callback: html => resolve(this._deleteItem(item_id, hero_id))
           }        
        },
        default: "cancel",
        close: () => resolve({cancelled: true})
      }
      new Dialog(data, null).render(true);
    });
  }
}
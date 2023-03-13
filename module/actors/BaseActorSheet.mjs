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

  /** @override */
  async _onDrop(evt) { 
    evt.preventDefault();
    const dragData = JSON.parse(evt.dataTransfer.getData("text/plain"));
  
    if(dragData.type != "Item") return;

    var item = await CztUtility.extractItem(dragData);
    await this.actor.createEmbeddedDocuments("Item", [{
      "name": item.name,
      "img": item.img,
      "type": item.type,
      "system.orig_id": item._id
    }]);
  }

  async _onActorItemRemove(evt) {
    evt.preventDefault();
    const item_id = $(evt.currentTarget).closest('.actor-items-single').attr('item-id');
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
            callback: html => resolve(this.actor.deleteEmbeddedDocuments("Item", [item_id]))
           }        
        },
        default: "cancel",
        close: () => resolve({cancelled: true})
      }
      new Dialog(data, null).render(true);
    });
  }
}
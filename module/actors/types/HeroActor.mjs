export class HeroActor extends Actor {
  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
    game.logger.log("prepareBaseData")
  }

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();

    game.logger.log("prepareData")
  }

  prepareDerivedData() {
    game.logger.log("prepareDerivedData")
  }
};
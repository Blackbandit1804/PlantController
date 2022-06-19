import alt from 'alt-server';
import { ItemEffects } from '../../../../server/systems/itemEffects';
import { INVENTORY_TYPE } from '../../../../shared/enums/inventoryTypes';
import { Item } from '../../../../shared/interfaces/item';
import { PlantControllerItemEvents } from './enums/itemEvents';
import { PlantController } from './controller';

ItemEffects.add(PlantControllerItemEvents.createPot, handlePotCreation);
function handlePotCreation(player: alt.Player, _item: Item, _slot: number, _type: INVENTORY_TYPE) {
    PlantController.createPot(player);
}
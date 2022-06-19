import alt, { Vector3 } from 'alt-server';
import { config } from './config';
import IPlantDocument from './interfaces/iPlant';
import { ItemFactory } from '../../../../server/systems/item';
import items from './config/items';
import Database from '@stuyk/ezmongodb';
import { ServerObjectController } from '../../../../server/streamers/object';
import { getVectorInFrontOfPlayer } from '../../../../server/utility/vector';
import { ServerTextLabelController } from '../../../../server/streamers/textlabel';

export class PlantController {
    static async init() {
        for (const item in items) {
            const data = items[item];
            const itemExists = await ItemFactory.get(data.dbName);

            if (itemExists) {
                await ItemFactory.update(itemExists.dbName, itemExists)
                continue;
            }

            await ItemFactory.add(data);
        }
    }

    static async createPot(player: alt.Player) {
        const playerDocument = await Database.fetchData<IPlantDocument>('owner', player.data._id, config.dbCollection);
        if (playerDocument) {
            const fwdVector = getVectorInFrontOfPlayer(player, 1);

            playerDocument.data.push({
                _id: player.data._id,
                model: 'prop_weed_02',
                textLabel: `${player.data.name}'s plant`,

                seeds: false,
                fertilized: false,
                watered: false,

                growth: 0,
                timeLeft: 0,

                position: { x: fwdVector.x, y: fwdVector.y, z: fwdVector.z - 1 } as Vector3,
            });

            await Database.updatePartialData(playerDocument._id, { data: playerDocument.data }, config.dbCollection);

            ServerObjectController.append({
                model: 'prop_weed_02',
                pos: { x: fwdVector.x, y: fwdVector.y, z: fwdVector.z - 1 },
                rot: player.rot,
                uid: player.data._id,
            });

            ServerTextLabelController.append({
                pos: { x: fwdVector.x, y: fwdVector.y, z: fwdVector.z - 1 },
                data: `${player.data.name}'s plant`,
                uid: player.data._id,
            });
        }
    }

    public static async loadAllPlantPots() {
        const allPlants = await this.getAllPlants();
        for (const plant of allPlants) {
            for (const pot of plant.data) {
                ServerObjectController.append({
                    model: pot.model,
                    pos: pot.position,
                    uid: plant._id,
                });
            }
        }
    }

    private static async getDocumentById(ownerId: string) {
        return Database.fetchData<IPlantDocument>('owner', ownerId, config.dbCollection);
    }

    private static async getAllPlants() {
        return Database.fetchAllData<IPlantDocument>(config.dbCollection);
    }

    private static async updatePlant(plant: IPlantDocument, newData: Object) {
        return Database.updatePartialData(plant, newData, config.dbCollection);
    }
}

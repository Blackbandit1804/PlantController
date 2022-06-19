import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { PlayerEvents } from '../../../../server/events/playerEvents';
import { ATHENA_EVENTS_PLAYER } from '../../../../shared/enums/athenaEvents';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';
import IPlantDocument from './interfaces/iPlant';
import { config } from './config';
import { PlantController } from './controller';

PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, async (player: alt.Player) => {
    const documentExists = await Database.fetchData<IPlantDocument>('owner', player.data._id, config.dbCollection);
    if (documentExists === null) {
        const newDocument: IPlantDocument = {
            owner: player.data._id,
            data: [],
        };
        await Database.insertData(newDocument, config.dbCollection);
    }
});

alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, async () => {
    await PlantController.loadAllPlantPots();
});

import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { PluginSystem } from '../../../server/systems/plugins';
import { config } from './src/config';
import { PlantController } from './src/controller';

import './src/events';
import './src/itemEvents';

const PLUGIN_NAME = 'PlantController';

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    await Database.createCollection(config.dbCollection);
    await PlantController.init();

    alt.log(`~lg~[PLUGIN] ==> ${PLUGIN_NAME} successfully loaded!`);
});


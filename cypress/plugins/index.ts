import type Cypress from 'cypress';
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin';

export default function configurePlugins(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) {
  getCompareSnapshotsPlugin(on, config);
}
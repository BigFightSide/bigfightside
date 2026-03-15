import * as migration_20260312_190002 from './20260312_190002';
import * as migration_20260313_083206_add_fighter_nationality_team_fight_history from './20260313_083206_add_fighter_nationality_team_fight_history';
import * as migration_20260313_083432_add_rankings_collection from './20260313_083432_add_rankings_collection';
import * as migration_20260313_083929_add_fighters_social_media_and_stats from './20260313_083929_add_fighters_social_media_and_stats';
import * as migration_20260313_090045_add_fighter_status_and_leg_reach from './20260313_090045_add_fighter_status_and_leg_reach';
import * as migration_20260313_134933 from './20260313_134933';
import * as migration_20260315_110724 from './20260315_110724';

export const migrations = [
  {
    up: migration_20260312_190002.up,
    down: migration_20260312_190002.down,
    name: '20260312_190002',
  },
  {
    up: migration_20260313_083206_add_fighter_nationality_team_fight_history.up,
    down: migration_20260313_083206_add_fighter_nationality_team_fight_history.down,
    name: '20260313_083206_add_fighter_nationality_team_fight_history',
  },
  {
    up: migration_20260313_083432_add_rankings_collection.up,
    down: migration_20260313_083432_add_rankings_collection.down,
    name: '20260313_083432_add_rankings_collection',
  },
  {
    up: migration_20260313_083929_add_fighters_social_media_and_stats.up,
    down: migration_20260313_083929_add_fighters_social_media_and_stats.down,
    name: '20260313_083929_add_fighters_social_media_and_stats',
  },
  {
    up: migration_20260313_090045_add_fighter_status_and_leg_reach.up,
    down: migration_20260313_090045_add_fighter_status_and_leg_reach.down,
    name: '20260313_090045_add_fighter_status_and_leg_reach',
  },
  {
    up: migration_20260313_134933.up,
    down: migration_20260313_134933.down,
    name: '20260313_134933',
  },
  {
    up: migration_20260315_110724.up,
    down: migration_20260315_110724.down,
    name: '20260315_110724'
  },
];

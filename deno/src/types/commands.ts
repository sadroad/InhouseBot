import { BotClient } from "../../bot.ts";
import {
  ApplicationCommandOption,
  ApplicationCommandTypes,
  Interaction,
  PermissionStrings,
} from "../../deps.ts";

export interface Command {
  /** The name of this command. */
  name: string;
  /** What does this command do? */
  description: string;
  /** The type of command this is. */
  type: ApplicationCommandTypes;
  /** Whether or not this command is for the dev server only. */
  devOnly?: boolean;
  /** The options for this command */
  options?: ApplicationCommandOption[];
  /** Set of permissions represented as a bit set */
  defaultMemberPermissions?: PermissionStrings[];
  /** Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible. */
  dmPermission?: boolean;
  /** This will be executed when the command is run. */
  execute: (bot: BotClient, interaction: Interaction) => unknown;
}

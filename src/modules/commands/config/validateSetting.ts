/* eslint-disable no-case-declarations */
import { Guild } from "discord.js";
import { BeccaInt } from "../../../interfaces/BeccaInt";
import { SettingsTypes } from "../../../interfaces/settings/SettingsTypes";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Confirms a setting value is correct.
 * @param Becca Becca's client instance
 * @param setting The name of the setting to validate
 * @param value The value to confirm is valid
 * @param guild The guild object where this command originated
 * @returns boolean confirming setting is valid
 */
export const validateSetting = async (
  Becca: BeccaInt,
  setting: SettingsTypes,
  value: string,
  guild: Guild
): Promise<boolean> => {
  try {
    const parsedValue = value.replace(/\D/g, "");
    const validUser = await guild.members.fetch(parsedValue);
    const validRole = await guild.roles.fetch(parsedValue);
    const validChannel = guild.channels.cache.find(
      (el) => el.type === "text" && el.id === parsedValue
    );
    switch (setting) {
      case "thanks":
      case "levels":
        return value === "on" || value === "off";
      case "hearts":
      case "blocked":
        return !!validUser;
      case "moderator_role":
      case "restricted_role":
      case "self_roles":
        return !!validRole;
      case "log_channel":
      case "welcome_channel":
      case "suggestion_channel":
        return !!validChannel;
      case "prefix":
      case "custom_welcome":
        return true;
      default:
        return false;
    }
  } catch (err) {
    beccaErrorHandler(Becca, "validate setting module", err, guild.name);
    return false;
  }
};
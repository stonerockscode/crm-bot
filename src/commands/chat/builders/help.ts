import help from '@execution/help';
import { localization, t } from '@i18n';
import { ChatInputCommand } from '@progressive-victory/client';
import { PermissionFlagsBits } from 'discord.js';

export const ns = 'help';

export default new ChatInputCommand()
	.setBuilder((builder) =>
		builder
			.setName(t({ key: 'command-name', ns }))
			.setDescription(t({ key: 'command-description', ns }))
			.setDMPermission(false)
			.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
			.addStringOption((option) =>
				option
					.setName(t({ key: 'string-option-name', ns }))
					.setDescription(t({ key: 'string-option-description', ns }))
					.setNameLocalizations(localization('string-option-name', ns))
					.setDescriptionLocalizations(localization('string-option-description', ns))
					.setRequired(false)
			)
	)
	.setGlobal(true)
	.setExecute(help);

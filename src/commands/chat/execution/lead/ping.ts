import { ns } from '@builders/lead';
import { t } from '@i18n';
import { logger } from '@progressive-victory/client';
import {
	ChatInputCommandInteraction, MessageCreateOptions, PermissionFlagsBits
} from 'discord.js';
import { states } from 'src/structures/';

/**
 * Executes the ping command to send a message to a channel.
 * @param interaction - The chat input command interaction object.
 */
export default async function ping(interaction: ChatInputCommandInteraction<'cached'>) {
	const { locale } = interaction;

	// Defer the reply to indicate that the bot is processing the command.
	await interaction.deferReply({ ephemeral: true });

	// Get the channel option from the interaction's options, if provided.
	const { channel } = interaction;

	// Check if the bot has permission to send messages in the channel.
	if (channel.guild && !channel.permissionsFor(interaction.client.user).has(PermissionFlagsBits.SendMessages)) {
		// If not, send an error response indicating that the bot does not have permission to send messages.
		return interaction.followUp({
			content: t({
				key: 'ping-not-no-perms',
				locale,
				ns,
				args: { user: interaction.client.user.toString() }
			})
		});
	}

	// Get the state role of the interaction member.
	const stateAbbreviation = states.find(
		(s) => interaction.channel.name.toLowerCase() === s.name.toLowerCase()
			|| interaction.channel.parent?.name.toLowerCase() === s.name.toLowerCase())?.abbreviation;
	const stateRole = stateAbbreviation && interaction.guild.roles.cache.find((r) => stateAbbreviation.toLowerCase() === r.name.toLowerCase());

	if (!stateRole) {
		// If the state role is not found, send an error response.
		return interaction.followUp({
			content: t({
				key: 'ping-no-state-role',
				locale,
				ns
			})
		});
	}
	
	// Create the message content for pinging the role.
	const pingMessage: MessageCreateOptions = { content: stateRole.toString() };

	// Get the additional message content from the 'message' option, if provided.
	const message = interaction.options.getString('message');
	if (message) {
		pingMessage.content += `\n${message}`;
	}

	pingMessage.content += `\n> Sent by ${interaction.user}`;

	try {
		// Send the ping message to the channel.
		const sentMessage = await channel.send(pingMessage);

		// Send a success response with the URL of the sent message.
		return interaction.followUp({
			content: t({
				key: 'ping-success',
				locale,
				ns,
				args: { url: sentMessage.url }
			})
		});
	}
	catch (err) {
		// Log the error.
		logger.error(err);

		// Send an error response if sending the message fails.
		return interaction.followUp({
			content: t({
				key: 'error',
				locale,
				ns
			})
		});
	}
}

import { MessageActionRow, MessageButton } from "discord.js";

export const name = "interactionCreate";
export const once = false;
export async function execute(interaction) {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "login") {
    const x = new MessageActionRow().addComponents(new MessageButton().setCustomId("primary").setLabel("login").setStyle("PRIMARY"));
    await interaction.reply({ content: "!", components: [x] });
  }
}

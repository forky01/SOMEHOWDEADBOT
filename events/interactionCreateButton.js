export const name = "interactionCreate";
export const once = false;
export async function execute(interaction) {
  if (!interaction.isButton()) return;

  const filter = i => i.customId === "login";

  const collector = interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", time: 15000 });

  console.log(collector);

  collector.on("collect", async i => {
    console.log(i);
    if (i.customId === "login") {
      await i.update({ content: "A button was clicked!", components: [] });
    }
  });

  collector.on("end", collected => console.log(`Collected ${collected.size} items`));
}
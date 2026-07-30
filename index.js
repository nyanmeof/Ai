require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
apiKey: process.env.GEMINI_API_KEY
});

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent
]
});

// Bật/tắt bot
let aiEnabled = true;

client.once("ready", () => {
console.log(${client.user.tag} đã online!);
});

client.on("messageCreate", async (message) => {
if (message.author.bot) return;

// Lệnh bật/tắt  
if (message.content === "!aion") {  
    aiEnabled = true;  
    return message.reply("✅ AI đã bật");  
}  

if (message.content === "!aioff") {  
    aiEnabled = false;  
    return message.reply("❌ AI đã tắt");  
}  

if (!aiEnabled) return;  

try {  
    await message.channel.sendTyping();  

    const response = await ai.models.generateContent({  
        model: "gemini-flash-latest",  
        contents: `

Bạn là trợ lý AI Discord.
Luôn trả lời bằng tiếng Việt.
Trả lời ngắn gọn, dễ hiểu.
Người dùng hỏi:

${message.content}
`
});

const text = response.text || "Không có phản hồi.";  

    if (text.length <= 2000) {  
        await message.reply(text);  
    } else {  
        for (let i = 0; i < text.length; i += 1900) {  
            await message.channel.send(text.slice(i, i + 1900));  
        }  
    }  

} catch (err) {  
    console.error(err);  
    message.reply("❌ Lỗi AI: " + err.message);  
}

});

client.login(process.env.DISCORD_TOKEN);

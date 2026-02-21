# Setup Instructions - MCTiers Waitlist Bot

1. Create the bot  
   Go to https://discord.com/developers/applications  
   → New Application → Bot tab → Add Bot  
   → Enable these Privileged Gateway Intents:  
     - Presence Intent  
     - Server Members Intent  
     - Message Content Intent  
   → Copy the token (keep it secret)

2. Invite the bot to your server  
   OAuth2 → URL Generator  
   Scopes: bot + applications.commands  
   Bot Permissions:  
   - View Channels  
   - Send Messages  
   - Embed Links  
   - Manage Messages  
   - Manage Roles  
   → Copy URL, open in browser, select your server

3. Prepare the folder  
   Unzip the files you got  
   Open terminal/command prompt in that folder

4. Install dependencies  
   Make sure Node.js 18+ is installed (download from https://nodejs.org if needed)  
   Run this command in the folder:  npm install

6. Start the bot: node index.js

To keep it running 24/7 (recommended):  
npm install -g pm2 
pm2 start index.js –name mctiers-bot 
pm2 save 
pm2 startup # follow the command it shows

6. Finish setup in Discord  
Go to your #request-test channel (or whatever you set as requestChannelId)  
Type:  /setup

Bot posts the embed + buttons. Done.

That's it — bot should be live. Queue updates every 30s automatically. Testers can now use /pick and /close.

If it crashes or doesn't respond, check console for errors (usually wrong token or missing intents).

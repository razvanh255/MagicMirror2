The only way for autostart on RPiOS Bookworm is with .desktop file in /home/USER/.config/autostart.
<br>Make sure you wright the whole path to script and put in config.js this line <i>electronOptions: {kiosk: false, fullscreen: true},</i>

#!/bin/bash
echo "Press shift in 5 seconds"
showkey -k > /tmp/keylog &
sleep 5
pkill showkey
if grep -q "42" /tmp/keylog || grep -q "54" /tmp/keylog; then
	echo "End script"
	exit 0
else echo "Start script"
cd ..
cd /home/razvanh/MagicMirror
export MM_CONFIG_FILE=config/config3.js
lxterminal -e npm run server &
export MM_CONFIG_FILE=config/config.js
lxterminal -e npm run start:wayland &
fi

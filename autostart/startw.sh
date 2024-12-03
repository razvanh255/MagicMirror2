#!/bin/bash
cd ..
cd /home/razvanh/MagicMirror
export MM_CONFIG_FILE=config/config3.js
lxterminal -e npm run server &
export MM_CONFIG_FILE=config/config.js
lxterminal -e npm run start:wayland &
fi

#!/bin/bash
set -e

source .env

case $1 in
    --help)
        echo "Usage: ./arduino.sh --verify [OPTIONS...] [FILE.ino]"
        echo "       ./arduino.sh --upload [OPTIONS...] [FILE.ino]"
        echo "       ./arduino.sh --get-pref [preference]"
        echo "       ./arduino.sh --install-boards package:arch[:version]"
        echo "       ./arduino.sh --install-library library[:version][,library[:version]]..."
        echo ""
        echo "OPTIONS:"
        echo ""
        echo "  --board package:arch:board[:parameters]"
        echo "  --port portname"
        echo "  --pref name=value"
        echo "  --preserve-temp-files"
        echo "  -v, --verbose"
        exit ;;
    --verify|--upload|--get-pref|--install-boards|--install-library) echo ">>> arduino $@" ;;
    *) echo "Use command-line actions. See more: ./arduino.sh --help"; exit 1 ;;
esac

${ARDUINO} "$@"

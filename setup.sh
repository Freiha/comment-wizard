#!/usr/bin/env bash
set -eu # -e = sobald command scheitert, bricht alles ab; -u Fehler wenn Variable nicht gesetzt


mkdir -p chrome/icons	   
cp -r ./src/icons ./chrome
cp ./src/popup.css ./chrome
cp ./src/popup.html ./chrome
cp ./src/manifest_chrome.json ./chrome/manifest.json

mkdir -p firefox/icons				   
cp -r ./src/icons ./firefox
cp ./src/popup.css ./firefox
cp ./src/popup.html ./firefox
cp ./src/manifest_firefox.json ./firefox/manifest.json

#zip ./chrome/chrome.zip -r ./chrome/*

mkdir -p ./firefox_source/src
cp ./setup_firefox.sh ./firefox_source/setup_firefox.sh

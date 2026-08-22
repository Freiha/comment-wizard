#!/usr/bin/env bash
set -eu # -e = sobald command scheitert, bricht alles ab; -u Fehler wenn Variable nicht gesetzt

mkdir -p temp
#rm -f temp/*

PATH_INCOMINGCOMMENTS="src/incomingComments"
FILE_ARRAY_INCOMING_COMMENTS=("src/inject_helperFunctions.js" "$PATH_INCOMINGCOMMENTS/ic_objects.js" "$PATH_INCOMINGCOMMENTS/ic_banner.js"  "$PATH_INCOMINGCOMMENTS/ic_commentHTML.js" "$PATH_INCOMINGCOMMENTS/ic_progressBar.js" "$PATH_INCOMINGCOMMENTS/ic_tabRows.js" "$PATH_INCOMINGCOMMENTS/ic_loadComments.js")
for i in ${FILE_ARRAY_INCOMING_COMMENTS[@]}
do
  cat $i >> "temp/incomingComments.js"
  echo >> "temp/incomingComments.js"
done
cat "temp/incomingComments.js" "src/inject_firefox_incoming_comments.js" >> "temp/incomingComments_firefox.js"
cat "src/inject_incoming_comments.js" >> "temp/incomingComments.js"


mkdir -p chrome/banner
mkdir -p chrome/icons
cp -r ./src/banner ./chrome				   
cp -r ./src/icons ./chrome
cp ./src/popup.css ./chrome
cp ./src/popup.html ./chrome
cp ./src/manifest_chrome.json ./chrome/manifest.json

mkdir -p firefox/banner
mkdir -p firefox/icons
cp -r ./src/banner ./firefox				   
cp -r ./src/icons ./firefox
cp ./src/popup.css ./firefox
cp ./src/popup.html ./firefox
cp ./src/manifest_firefox.json ./firefox/manifest.json

npx webpack --config webpack.config.js

#zip ./chrome/chrome.zip -r ./chrome/*

mkdir -p ./firefox_source/src
cp ./temp/incomingComments_firefox.js ./firefox_source/src/incomingComments.js
cp ./src/inject_delete_button.js ./firefox_source/src/deleteButton.js
cp ./src/inject_helperFunctions.js ./firefox_source/src/helperFunctions.js
cp ./src/inject_reorder_header.js ./firefox_source/src/reorderHeader.js
cp ./src/inject_remove_rating.js ./firefox_source/src/removeRating.js
cp ./src/inject_round_subs.js ./firefox_source/src/roundSubs.js
cp ./src/content_firefox.js ./firefox_source/src/content.js
cp ./src/inject_update_loginDropdown.js ./firefox_source/src/loginDropDown.js
cp ./src/popup.js ./firefox_source/src/popup.js
cp ./setup_firefox.sh ./firefox_source/setup_firefox.sh
cp ./webpack.config_firefox.js ./firefox_source/webpack.config.js

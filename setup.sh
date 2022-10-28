#!/usr/bin/env bash
set -eu # -e = sobald command scheitert, bricht alles ab; -u Fehler wenn Variable nicht gesetzt

mkdir -p temp
#rm -f temp/*

PATH_INCOMINGCOMMENTS="bin/incomingComments"
FILE_ARRAY_INCOMING_COMMENTS=("bin/inject_helperFunctions.js" "$PATH_INCOMINGCOMMENTS/ic_objects.js" "$PATH_INCOMINGCOMMENTS/ic_likeDislike_Buttons.js" "$PATH_INCOMINGCOMMENTS/ic_replies.js" "$PATH_INCOMINGCOMMENTS/ic_commentHTML.js" "$PATH_INCOMINGCOMMENTS/ic_pagination.js" "$PATH_INCOMINGCOMMENTS/ic_progressBar.js" "$PATH_INCOMINGCOMMENTS/ic_tabRows.js" "$PATH_INCOMINGCOMMENTS/ic_loadComments.js")
for i in ${FILE_ARRAY_INCOMING_COMMENTS[@]}
do
  cat $i >> "temp/incomingComments.js"
  echo >> "temp/incomingComments.js"
done
cat "temp/incomingComments.js" "bin/inject_firefox_incoming_comments.js" >> "temp/incomingComments_firefox.js"
cat "bin/inject_incoming_comments.js" >> "temp/incomingComments.js"


mkdir -p chrome/icons
cp -r ./bin/icons ./chrome
cp ./bin/popup.css ./chrome
cp ./bin/popup.html ./chrome
cp ./bin/manifest_chrome.json ./chrome/manifest.json

mkdir -p firefox/icons
cp -r ./bin/icons ./firefox
cp ./bin/popup.css ./firefox
cp ./bin/popup.html ./firefox
cp ./bin/manifest_firefox.json ./firefox/manifest.json

npx webpack --config webpack.config.js

#zip ./chrome/chrome.zip -r ./chrome/*

mkdir -p ./firefox_source/bin
cp ./temp/incomingComments_firefox.js ./firefox_source/bin/incomingComments.js
cp ./bin/inject_delete_button.js ./firefox_source/bin/deleteButton.js
cp ./bin/inject_helperFunctions.js ./firefox_source/bin/helperFunctions.js
cp ./bin/inject_reorder_header.js ./firefox_source/bin/reorderHeader.js
cp ./bin/inject_remove_rating.js ./firefox_source/bin/removeRating.js
cp ./bin/inject_round_subs.js ./firefox_source/bin/roundSubs.js
cp ./bin/content_firefox.js ./firefox_source/bin/content.js
cp ./bin/inject_update_loginDropdown.js ./firefox_source/bin/loginDropDown.js
cp ./bin/popup.js ./firefox_source/bin/popup.js
cp ./setup_firefox.sh ./firefox_source/setup_firefox.sh
cp ./webpack.config_firefox.js ./firefox_source/webpack.config.js

function reorderButtonsInHeader() {
    const buttonsTopRight = document.getElementsByClassName('sta');
    if (buttonsTopRight && buttonsTopRight.length !== 0) {
        const lk_creators = document.getElementsByClassName('lk_creators on')[0];
        const btnLoginInfo = document.getElementById('btnLoginInfo');
        const btnLogin = document.getElementById('btnLogin');
        btnLoginInfo.style.marginLeft = "4px";
        const btnPublish = document.getElementById('btnPublish');
        btnPublish.style.marginLeft = "4px";
        const btnSearch = document.getElementsByClassName('btn_search _btnSearch')[0];
        const span = document.getElementsByClassName('bar');


        const elements = document.createDocumentFragment();
        elements.appendChild(btnSearch);
        elements.appendChild(span[0]);
        elements.appendChild(btnLoginInfo);
        elements.appendChild(btnLogin);
        elements.appendChild(btnPublish);
        elements.appendChild(span[1]);
        elements.appendChild(lk_creators);

        buttonsTopRight[0].appendChild(elements);

        const searchArea = document.getElementsByClassName('search_area _searchArea')[0];
        searchArea.style.left = "-290px";

        const loginbox = document.getElementById('layerMy');
        //loginbox.style.left = "-250px";
        loginbox.style.right = "250px";
    }
}

reorderButtonsInHeader();

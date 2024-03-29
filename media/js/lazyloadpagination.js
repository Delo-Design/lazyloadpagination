document.addEventListener('DOMContentLoaded', function () {

    let load_flag = false;
    let title = document.querySelector('title');
    let target_content = document.querySelector(LazyLoadPaginationConfig.target_content);
    let target_pagination = document.querySelector(window.LazyLoadPaginationConfig.target_pagination);

    if (
        target_content === null || target_content === undefined ||
        target_pagination === null || target_pagination === undefined
    ) {
        return;
    }

    checkLoad();

    document.addEventListener('scroll', function (ev) {
        checkLoad();
    });

    function checkLoad() {
        let position = target_content.getBoundingClientRect();
        if (
            (window.scrollY + window.innerHeight) >= ((target_content.offsetTop + position.height) - 150)
        ) {
            loadPage();
        }
    }

    function loadPage() {

        if (load_flag) {
            return;
        }
        let target_pagination = document.querySelector(window.LazyLoadPaginationConfig.target_pagination);
        let target_li_list = target_pagination.querySelectorAll(window.LazyLoadPaginationConfig.target_li);
        let target_next = null;

        for (let i = 0; i < target_li_list.length; i++) {
            if (target_li_list[i].classList.contains(window.LazyLoadPaginationConfig.target_active)) {
                target_next = target_li_list[i + 1];
            }
        }

        if (
            target_next === null ||
            target_next === undefined ||
            target_next.querySelector('a') === undefined ||
            target_next.querySelector('a') === null
        ) {
            return;
        }

        let target_link = target_next.querySelector('a').getAttribute('href');

        target_link = target_link.replace('component=tmpl', '');
        target_link = target_link.replace('?&', '?');

        let target_link_send = target_link + (target_link.includes('?') ? '&' : '?') + 'component=tmpl';

        let xhr = new XMLHttpRequest();
        xhr.open('GET', target_link_send);

        xhr.addEventListener('load', function () {

            if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {

                let target_content = document.querySelector(LazyLoadPaginationConfig.target_content);

                let tmp_dom = document.createElement('div');
                tmp_dom.innerHTML = xhr.responseText;

                title.innerHTML = tmp_dom.querySelector('title').innerHTML;
                target_pagination.innerHTML = tmp_dom.querySelector(window.LazyLoadPaginationConfig.target_pagination).innerHTML;
                let content_new = tmp_dom.querySelector(window.LazyLoadPaginationConfig.target_content).innerHTML;

                target_content.innerHTML += content_new;

                history.pushState({state: 1}, "State 1", target_link);

                setTimeout(function () {
                    load_flag = false;
                }, 500);

            } else {
                throw Error(xhr.statusText);
            }

        });

        load_flag = true;
        xhr.send();
    }

});
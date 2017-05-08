(function($) {
    //Pagination
    paging();
    function diffpaging(className){
        $(className).each(function(){
            //how much items per page to show
            var windowWidth = $(window).width();
            var show_per_page = (windowWidth<1208)?6:8;

            //getting the amount of elements inside content div
            var number_of_items = $(this).find('.test-list .list').children().size();
            //calculate the number of pages we are going to have
            var number_of_pages = Math.ceil(number_of_items/show_per_page);

            //set the value of our hidden input fields
            $(this).find('.current_page').val(0);
            $(this).find('.show_per_page').val(show_per_page);

            //now when we got all we need for the navigation let's make it '

            /*
             what are we going to have in the navigation?
             - link to previous page
             - links to specific pages
             - link to next page
             */
            if(number_of_pages>1){
                var navigation_html = '<a class="btn previous_link">Prev</a> ';
                var current_link = 0;
                while(number_of_pages > current_link){
                    navigation_html += '<a class="btn page_link" longdesc="' + current_link +'">'+ (current_link + 1) +'</a> ';
                    current_link++;
                }
                navigation_html += ' <a class="btn next_link">Next</a>';

                $(this).find('.page_navigation').html(navigation_html);

            }


            //add active class to the first page link
            $(this).find('.page_navigation .page_link:first').addClass('active');

            //hide all the elements inside content div
            $(this).find('.test-list .list').children().css('display', 'none');
            //and show the first n (show_per_page) elements
            $(this).find('.test-list .list').children().slice(0, show_per_page).css('display', 'block');

            $(this).find('.previous_link').click(function () {
                previous($(this).closest(className));
            });
            $(this).find('.page_link').click(function () {
                go_to_page($(this).closest(className),$(this).attr('longdesc'));
            });
            $(this).find('.next_link').click(function () {
                next($(this).closest(className));
            });
            check_disable($(this));
            pageShow($(this));

        });
    }
    function paging(){
        diffpaging('.paging');
    }
    $(window).resize(function() {
        paging();
    });
    function pageShow(e) {
        var page_current = parseInt($(e).find('.page_navigation>a.active').attr('longdesc'))+1;
        $(e).find('.page_navigation>a.page_link').css('display','none');
        var page_show = Math.ceil(page_current/5);
        $(e).find('.page_navigation>a.page_link').slice((page_show-1)*5,(page_show-1)*5+5).css('display','inline-block');
    }
    function check_disable(e) {
        $(e).find('.page_navigation>a').removeClass('disabled');
        if($(e).find('.page_navigation>a:eq(1)').hasClass('active')){
            $(e).find('.page_navigation .previous_link').addClass('disabled');
        }
        else if($(e).find('.page_navigation>a:last').prev().hasClass('active')){
            $(e).find('.page_navigation .next_link').addClass('disabled');
        }
        if($(e).find('.page_navigation>a.page_link').length==1){
            $(e).find('.page_navigation .next_link').addClass('disabled');
        }
    }

    function previous(e){
        var new_page = parseInt($(e).find('.current_page').val()) - 1;
        //if there is an item before the current active link run the function
        if($(e).find('.active').prev('.page_link').length==true){
            go_to_page(e,new_page);
        }
        check_disable(e);
        pageShow(e);
    }

    function next(e){
        new_page = parseInt($(e).find('.current_page').val()) + 1;
        //if there is an item after the current active link run the function
        if($(e).find('.active').next('.page_link').length==true){
            go_to_page(e,new_page);
        }
        check_disable(e);
        pageShow(e);
    }

    function go_to_page(e,page_num){
        //get the number of items shown per page
        var show_per_page = parseInt($(e).find('.show_per_page').val());

        //get the element number where to start the slice from
        start_from = page_num * show_per_page;

        //get the element number where to end the slice
        end_on = start_from + show_per_page;

        //hide all children elements of content div, get specific items and show them
        $(e).find('.test-list .list').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');

        /*get the page link that has longdesc attribute of the current page and add active class to it
         and remove that class from previously active page link*/
        $(e).find('.page_link[longdesc=' + page_num +']').addClass('active').siblings('.active').removeClass('active');

        //update the current page input field
        $(e).find('.current_page').val(page_num);

        //prev next button disabled,show 5 pages
        check_disable(e);
        pageShow(e);

        $('html, body').animate({ scrollTop: $(e).offset().top }, 'slow');

    }

})(jQuery);

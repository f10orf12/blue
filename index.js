﻿//Global Variables
g_params = '';
g_ID = '';
g_Feed = 'Home';
mainList = '';
page = '';
shareTitle = '';
shareLink = '';
connState = '';
imgLoader = '<div id="loader"><img src="ajax-loader.png" /></div>';

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    checkConnection();
    navigator.splashscreen.hide();
}

function checkConnection() {
    var networkState = navigator.network.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 0;
    states[Connection.ETHERNET] = 1;
    states[Connection.WIFI] = 1;
    states[Connection.CELL_2G] = 1;
    states[Connection.CELL_3G] = 1;
    states[Connection.CELL_4G] = 1;
    states[Connection.NONE] = 0;
    connState = states[networkState];
}
$('#index').live('pageinit', '[data-role=page]', function () {

});
$('#index').live('pageshow', '[data-role=page]', function () {
    //Main
    var myMain = function () {
        page = "Main";
        x = 1;
        $('#footer').html('<div class="bottom_buttons" id="btn_bottom"><a href="#" id="btn_categories" data-role="button" class="blue_button">Read Insights by Category</a></div><div id="btn_email" class="bottom_buttons"><a href="#" data-role="button" class="blue_button">Sign Up for Email alerts</a></div>');
        $('#top_title').remove();
        $('#btn_bottom').trigger('create');
        $('#btn_email').trigger('create');
        $('#back').hide();
        $('#category_title').hide();
        $('#refresh').show();
        $('.category_link').remove();
        $('.sub_category_link').remove();
        $('.story_title').remove();
        $('.pubDate').remove();
        $('.content').remove();
        $('#error').remove();
        for (x; x < 2; x++) {
            $('.main_link').remove();
            var i = 0;
            $.ajax({
                url: 'http://www.whatsinblue.org/_mobile_app/homepage.xml',
                dataType: 'xml',
                success: function (myxml) {
                    $(myxml).find('item').each(function () {
                        i += 1;
                        $(this).find('title').each(function () {
                            var title = '<div class="main_link" id="feed' + i + '"><a href="#content" class="article_link" data-role="button" data-article =' + i + ' data-feed="Home" data-transition="slidefade" id="main' + i + '">' + $(this).text() + '</a></div>';
                            jQuery('#feedMain > ul').append(title);
                            $('#loader').remove();
                            $('#feedMain').fadeIn(400);
                        });
                    });
                }
            });
        }
    }
    if (connState == 0) {
        alert("You currently do not have an Internet connection.");
        $('#back').hide();
        $('#refresh').hide();
    }
    else {
        jQuery('#red').append(imgLoader);
        myMain();
    }
    //Categories
    var myCategories = function () {
        jQuery('#red').append(imgLoader);
        page = "Categories";
        $('title_link').remove();
        $('#category_title').html("Insights by Category").fadeIn(400);
        $('#back').show();
        $('.bottom_buttons').remove();
        $('#refresh').hide();
        $('.main_link').remove();
        $('#error').remove();
        $('#top_title').html('');
        $('#story_title').html('');
        $('#story_pubDate').html('');
        $('#story_content').html('');
        z = 1;
        var sections = '';
        for (z; z < 2; z++) {
            var c = 0;
            $.ajax({
                url: 'http://whatsinblue.org/_mobile_app/category_list_sub_items.xml',
                dataType: 'xml',
                success: function (myxml) {
                    $(myxml).find('item').each(function () {
                        c += 1;
                        $(this).find('title').each(function () {
                            sections += '<div class="category_link" id="category' + c + '"><a href="#" data-role="button" class="article_link"  id="category' + c + '" data-feed="' + $(this).text() + '">' + $(this).text() + '</a></div>';
                        });
                        $(this).find('sub').each(function () {
                            $(this).find('subtitle').each(function () {
                                sections += '<div class="sub_category_link" id="subcategory' + c + '"><a href="#" data-role="button" class="article_link"  id="category' + c + '" data-feed="' + $(this).text() + '">' + $(this).text() + '</a></div>';
                            });

                        });
                    });
                    jQuery('#sections > ul').append(sections);
                    $('#loader').remove();
                    $('html, body').animate({ scrollTop: 0 }, 100);
                    $('#sections').fadeIn(600);

                }
            });
        }
        $('#sections').trigger('create');
    }

    //buttons
    $('#refresh').live('click', function (event) {
        $('.main_link').remove();
        $('#feedMain').hide();
        myMain();
    });

    $('[id^=main]').click(function (e) {
        e.preventDefault();
        g_ID = $(e.target).jqmData("article");
        g_Feed = $(e.target).jqmData("feed");
        if (g_Feed === undefined) {
            g_ID = $(e.target).children().jqmData("article");
            g_Feed = $(e.target).children().jqmData("feed");
        }
        else {
            g_Feed = $(e.target).jqmData("feed");
            g_ID = $(e.target).jqmData("article");
        }
        myContent(g_ID, g_Feed);
    });

    $('[id^=article]').click(function (e) {
        e.preventDefault();
        g_ID = $(e.target).jqmData("article");
        g_Feed = $(e.target).jqmData("feed");
        if (g_Feed === undefined) {
            g_ID = $(e.target).children().jqmData("article");
            g_Feed = $(e.target).children().jqmData("feed");
        }
        else {
            g_Feed = $(e.target).jqmData("feed");
            g_ID = $(e.target).jqmData("article");
        }
        page = "artContent";
        myContent(g_ID, g_Feed);
    });

    $('#sections').live('click', '[id^=category]', function (e) {
        e.preventDefault();
        g_ID = $(e.target).jqmData("article");
        g_Feed = $(e.target).jqmData("feed");
        if (g_Feed === undefined) {
            g_ID = $(e.target).children().jqmData("article");
            g_Feed = $(e.target).children().jqmData("feed");
        }
        else {
            g_Feed = $(e.target).jqmData("feed");
            g_ID = $(e.target).jqmData("article");
        }
        myArticles(g_Feed);
    });

    $('#back').click(function (e) {
        if (page === "Articles") {
            $('#top_title').remove();
            $('.title_link').remove();
            $('#categories').prepend('<div id="category_title" class="top_title"></div>');
            $('#sections').hide();
            myCategories();
        }
        else if (page === "artContent") {
            $('#top_title').remove();
            $('#feed').hide();
            myArticles(g_Feed);
        }
        else {
            $('#feedMain').hide();
            $('#footer').html('<div class="bottom_buttons"><a href="#" id="btn_categories" data-role="button" class="blue_button">Read Insights by Category</a></div><div class="bottom_buttons"><a href="http://www.whatsinblue.org/email_signup.php" target="_blank" data-role="button" class="blue_button">Sign Up for Email alerts</a></div>');
            myMain();
        }
    });

    $('#logo').click(function (e) {
        $('#error').remove();
        $('.title_link').remove();
        $('#category_title').hide();
        myMain();
    });

    $('#btn_categories').live('click', function (e) {
        e.preventDefault();
        $('.bottom_buttons').remove();
        $('#category_title').hide();
        myCategories();
    });

    $('#btn_email').live('click', function (e) {
        e.preventDefault();
        var response = confirm("You are about to open an external page.");
        if (response == true) {
            var ref = window.open("http://m.securitycouncilreport.org/466706&t=kc3ie949lp8d0phh55jqih1f63", '_blank', 'location=yes');
        }
    });

    //share function
    $('#share').click(function () {
        window.plugins.share.show({
            subject: shareTitle,
            text: shareLink
        },
                    function () { }, // success
                    function () { } //failure function
                    );
    });

    $('#story a').live('click', function (e) {
        e.preventDefault();
        var response = confirm("You are about to open an external page.");
        if (response == true) {
            var link = $(e.target).attr('href');
            var ref = window.open(link, '_blank', 'location=yes');
        }
    });


    //Articles
    var myArticles = function (feed) {
        jQuery('#red').append(imgLoader);
        page = "Articles";
        $('#refresh').hide();
        $('#back').show();
        $('.title_link').remove();
        $('.bottom_buttons').remove();
        $('#category_title').remove();
        $('.category_link').remove();
        $('.sub_category_link').remove();
        $('#story_title').html('');
        $('#story_pubDate').html('');
        $('#story_content').html('');
        $('#error').remove();
        $('#feed > ul').html('');
        $('#articles').prepend('<div id="top_title" class="top_title"></div>');
        var paramFeed = feed;
        if (paramFeed === "Home") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/homepage.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Africa") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_africa.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Burundi") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/burundi.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Central African Republic") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/central_african_republic.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Chad/CAR") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/chad_car.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Côte d'Ivoire") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/cote_divoire.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Democratic Republic of the Congo") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/democratic_republic_of_the_congo.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Eritrea") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/eritrea.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Ethiopia/Eritrea") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/ethiopia_eritrea.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Great Lakes Region") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/great_lakes_region.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Guinea") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/guinea.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Guinea-Bissau") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/guinea_bissau.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Kenya") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/kenya.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Liberia") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/liberia.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Libya") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/libya.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "LRA-affected areas") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/lra_affected_areas.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Mali/Sahel") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/mali_sahel.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Sierra Leone") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/sierra_leone.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Somalia") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/somalia.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Sudan/Darfur") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/sudan_darfur.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Sudan/South Sudan") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/sudan_south_sudan.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "UNOCA (Central Africa)") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/unoca_central_africa.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "UNOWA (West Africa)") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/unowa_west_africa.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Western Sahara") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/western_sahara.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Zimbabwe") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/zimbabwe.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "General Issues relating to Africa") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/general_issues_relating_to_africa.xml';
            $('#top_title').html(paramFeed);
        }

        if (paramFeed === "Americas") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_americas.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Haiti") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/haiti.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Honduras") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/honduras.xml';
            $('#top_title').html(paramFeed);
        }

        if (paramFeed === "Asia") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_asia.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Afghanistan") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/afghanistan.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "DPRK (North Korea)") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/dprk_north_korea.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Fiji") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/fiji.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Myanmar") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/myanmar.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Nepal") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/nepal.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Sri Lanka") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/sri_lanka.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Thailand/Cambodia") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/thailand_cambodia.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Timor-Leste") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/timor_leste.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "UNRCCA (Central Asia)") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/unrcca_central_asia.xml';
            $('#top_title').html(paramFeed);
        }

        if (paramFeed === "Europe") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_europe.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Bosnia & Herzegovina") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/bosnia_herzegovina.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Cyprus") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/cyprus.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Georgia") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/georgia.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Kosovo") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/kosovo.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Middle East") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_middle_east.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Golan Heights (Israel/Syria)") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/golan_heights_israel_syria.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Israel/Palestine") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/israel_palestine.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Iran") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/iran.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Iraq") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/iraq.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Lebanon") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/lebanon.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Syria") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/syria.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Yemen") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/yemen.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Themes") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/themes.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Arms Control and Disarmament") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_arms_control_disarmament.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Children and Armed Conflict") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_children_armed_conflict.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Counter-Terrorism") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_counter_terrorism.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Justice and Criminal Accountability") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_justice_criminal_accountability.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Peacebuilding") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_peacebuilding.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Peacekeeping") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_peacekeeping.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Peacemaking") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_peacemaking.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Protection of Civilians") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_protection_civilians.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "UN Institutional Issues") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_un_institutional_issues.xml';
            $('#top_title').html(paramFeed);
        }
        if (paramFeed === "Women, Peace and Security") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_women_peace_security.xml';
            $('#top_title').html(paramFeed);
        }
        var title = '';
        var i = 0;
        $.ajax({
            url: myUrl,
            dataType: 'xml',
            success: function (myxml) {
                $(myxml).find('item').each(function () {
                    i += 1;
                    $(this).find("title").each(function () {
                        title += '<div class="title_link" id="feed' + i + '"><a href="#content" data-role="button" data-article =' + i + ' data-feed="' + paramFeed + '" class="title_link" id="article' + i + '">' + $(this).text() + '</a></div>';
                    });
                });
                $('#feed > ul').append(title);
            },
            error: function (error) { $('#feed > ul').append('<div id="error">Error Loading Content</div>'); }
        });
        $('#loader').remove();
        $('html, body').animate({ scrollTop: 0 }, 100);
        $('#category_title').fadeIn(600);
        $('#top_title').fadeIn(600);
        $('#feed').fadeIn(600);

    }

    //Content
    var myContent = function (id, feed) {
        jQuery('#red').append(imgLoader);
        $('#story').hide();
        $('.main_link').remove();
        $('.title_link').remove();
        $('#top_title').remove();
        $('#back').show();
        $('#refresh').hide();
        $('.bottom_buttons').remove();
        var paramId = id;
        var paramFeed = feed;
        if (paramFeed === "Home") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/homepage.xml';
        }
        if (paramFeed === "Africa") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_africa.xml';
        }
        if (paramFeed === "Burundi") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/burundi.xml';
        }
        if (paramFeed === "Central African Republic") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/central_african_republic.xml';
        }
        if (paramFeed === "Chad/CAR") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/chad_car.xml';
        }
        if (paramFeed === "Côte d'Ivoire") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/cote_divoire.xml';
        }
        if (paramFeed === "Democratic Republic of the Congo") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/democratic_republic_of_the_congo.xml';
        }
        if (paramFeed === "Eritrea") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/eritrea.xml';
        }
        if (paramFeed === "Ethiopia/Eritrea") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/ethiopia_eritrea.xml';
        }
        if (paramFeed === "Great Lakes Region") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/great_lakes_region.xml';
        }
        if (paramFeed === "Guinea") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/guinea.xml';
        }
        if (paramFeed === "Guinea-Bissau") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/guinea_bissau.xml';
        }
        if (paramFeed === "Kenya") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/kenya.xml';
        }
        if (paramFeed === "Liberia") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/liberia.xml';
        }
        if (paramFeed === "Libya") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/libya.xml';
        }
        if (paramFeed === "LRA-affected areas") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/lra_affected_areas.xml';
        }
        if (paramFeed === "Mali/Sahel") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/mali_sahel.xml';
        }
        if (paramFeed === "Sierra Leone") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/sierra_leone.xml';
        }
        if (paramFeed === "Somalia") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/somalia.xml';
        }
        if (paramFeed === "Sudan/Darfur") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/sudan_darfur.xml';
        }
        if (paramFeed === "Sudan/South Sudan") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/sudan_south_sudan.xml';
        }
        if (paramFeed === "UNOCA (Central Africa)") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/unoca_central_africa.xml';
        }
        if (paramFeed === "UNOWA (West Africa)") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/unowa_west_africa.xml';
        }
        if (paramFeed === "Western Sahara") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/western_sahara.xml';
        }
        if (paramFeed === "Zimbabwe") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/zimbabwe.xml';
        }
        if (paramFeed === "General Issues relating to Africa") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/general_issues_relating_to_africa.xml';
        }

        if (paramFeed === "Americas") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_americas.xml';
        }
        if (paramFeed === "Haiti") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/haiti.xml';
        }
        if (paramFeed === "Honduras") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/honduras.xml';
        }

        if (paramFeed === "Asia") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_asia.xml';
        }
        if (paramFeed === "Afghanistan") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/afghanistan.xml';
        }
        if (paramFeed === "DPRK (North Korea)") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/dprk_north_korea.xml';
        }
        if (paramFeed === "Fiji") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/fiji.xml';
        }
        if (paramFeed === "Myanmar") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/myanmar.xml';
        }
        if (paramFeed === "Nepal") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/nepal.xml';
        }
        if (paramFeed === "Sri Lanka") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/sri_lanka.xml';
        }
        if (paramFeed === "Thailand/Cambodia") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/thailand_cambodia.xml';
        }
        if (paramFeed === "Timor-Leste") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/timor_leste.xml';
        }
        if (paramFeed === "UNRCCA (Central Asia)") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/unrcca_central_asia.xml';
        }

        if (paramFeed === "Europe") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_europe.xml';
        }
        if (paramFeed === "Bosnia & Herzegovina") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/bosnia_herzegovina.xml';
        }
        if (paramFeed === "Cyprus") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/cyprus.xml';
        }
        if (paramFeed === "Georgia") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/georgia.xml';
        }
        if (paramFeed === "Kosovo") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/kosovo.xml';
        }


        if (paramFeed === "Middle East") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_middle_east.xml';
        }
        if (paramFeed === "Golan Heights (Israel/Syria)") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/golan_heights_israel_syria.xml';
        }
        if (paramFeed === "Israel/Palestine") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/israel_palestine.xml';
        }
        if (paramFeed === "Iran") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/iran.xml';
        }
        if (paramFeed === "Iraq") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/iraq.xml';
        }
        if (paramFeed === "Lebanon") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/lebanon.xml';
        }
        if (paramFeed === "Syria") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/syria.xml';
        }
        if (paramFeed === "Yemen") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/yemen.xml';
        }


        if (paramFeed === "Themes") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/themes.xml';
        }
        if (paramFeed === "Arms Control and Disarmament") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_arms_control_disarmament.xml';
        }
        if (paramFeed === "Children and Armed Conflict") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_children_armed_conflict.xml';
        }
        if (paramFeed === "Counter-Terrorism") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_counter_terrorism.xml';
        }
        if (paramFeed === "Justice and Criminal Accountability") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_justice_criminal_accountability.xml';
        }
        if (paramFeed === "Peacebuilding") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_peacebuilding.xml';
        }
        if (paramFeed === "Peacekeeping") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_peacekeeping.xml';
        }
        if (paramFeed === "Peacemaking") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_peacemaking.xml';
        }
        if (paramFeed === "Protection of Civilians") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_protection_civilians.xml';
        }
        if (paramFeed === "UN Institutional Issues") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_un_institutional_issues.xml';
        }
        if (paramFeed === "Women, Peace and Security") {
            var myUrl = 'http://www.whatsinblue.org/_mobile_app/insights_women_peace_security.xml';
        }

        var i = 0;
        $.ajax({
            url: myUrl,
            dataType: 'xml',
            success: function (contentXml) {
                $(contentXml).find('item').each(function () {
                    i += 1;
                    if (i == paramId) {
                        $(this).find("title").each(function () {
                            var title = '<div class="story_title" id="title' + i + '">' + $(this).text() + '</div>';
                            $('#story_title').html("");
                            $('#story_title').append(title);
                            shareTitle = $(this).text();
                        });
                        $(this).find("pubDate").each(function () {
                            var pubDate = '<div class="pubDate" id="date' + i + '">' + $(this).text() + '</div>';
                            $('#story_pubDate').html("");
                            $('#story_pubDate').append(pubDate);
                        });
                        $(this).find("description").each(function () {
                            var content = '<div class="content" id="content' + i + '">' + $(this).text() + '</div>';
                            $('#story_content').html("");
                            $('#story_content').append(content);
                        });
                        $(this).find("link").each(function () {
                            shareLink = $(this).text();
                        });
                        $('#loader').remove();
                        $('html, body').animate({ scrollTop: 0 }, 100);
                        $('#story').fadeIn(600);
                    }
                });
            },
            error: function (error) { $('#feed > ul').append('<div id="error">Error Loading Content</div>'); }
        });
    }
}); 
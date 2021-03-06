/**
 * Created by chinhong on 6/29/15.
 */

var MyBrowser;
var SidebarOpen = false;
var FavbarOpen = false;

var pdf_url = "";
var pdf_page = 0;

var SCW;
var SCH;

Template.cover.rendered = function() {
    console.log('rendered'+' loaded');
    SCW = window.innerWidth;
    SCH = window.innerHeight;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        MyBrowser = "Mobile";
    } else {
        MyBrowser = "Web";
    }

    // Set worker URL to package assets
    if (MyBrowser == "Mobile") {
    }
    $('#AppCover').css({width:(SCW+"px"), height:(SCH+"px")});
    $('#AppHelp').css({width:((SCW+1)+"px"), height:((SCH+1)+"px")});
    $('.contents-board').css({height:((SCH * 0.85 - 50) + 'px')});
    $('.testimonials').find('table').css({'max-height':(SCH * 0.8 + 'px')});

    window.setTimeout(function() {
        $('.table-scroll').each(function(i){
            var _col_w = $(this).find('.firstTd').width();
            var _col_h = $(this).find('.firstTd').height();

            $(this).find('.table_div').css({width:((SCW-_col_w-50)+'px'),height:((SCH-_col_h-50)+'px')});
            $(this).find('.divHeader').css({width:((SCW-_col_w-50)+'px')});
            $(this).find('.firstcol').css({height:((SCH-_col_h-50)+'px')});
        });
    }, 5000);


    //var myScroll = new IScroll('#wrapper', {
    //    mouseWheel: true,
    //    scrollbars: true,
    //    indicators: {
    //        el: document.getElementById('indicator'),
    //        fade: false,
    //        ignoreBoundaries: false,
    //        interactive: false,
    //        listenX: true,
    //        listenY: true,
    //        resize: true,
    //        shrink: false,
    //        speedRatioX: 0,
    //        speedRatioY: 0
    //    }
    //});

    //$('#Testing').html(location.href);

    //// Swiper
    //MySwiper.Initialize();
    //// initial page
    //MySwiper.Swiper.setInitialPage('CoverPage');
    //// page control
    //Tracker.autorun(function() { if (MySwiper.Swiper.pageIs('CoverPage')) {
    //    MySwiper.Swiper.leftRight(null, 'ContentPage');
    //}});
    //Tracker.autorun(function() { if (MySwiper.Swiper.pageIs('ContentPage')) {
    //    MySwiper.Swiper.leftRight('CoverPage', null);
    //}});

    // Plugin
    // Owl Carousel Settings
    //$(".about-carousel").owlCarousel({
    //    items: 3,
    //    navigation: true,
    //    pagination: false,
    //    navigationText: [
    //        "<i class='fa fa-angle-left'></i>",
    //        "<i class='fa fa-angle-right'></i>"
    //    ]
    //});

    //$(".portfolio-carousel").owlCarousel({
    //    singleItem: true,
    //    navigation: true,
    //    pagination: false,
    //    navigationText: [
    //        "<i class='fa fa-angle-left'></i>",
    //        "<i class='fa fa-angle-right'></i>"
    //    ],
    //    autoHeight: true,
    //    mouseDrag: false,
    //    touchDrag: false,
    //    transitionStyle: "fadeUp"
    //});

    window.setTimeout(function() {
        $(".testimonials-carousel").owlCarousel({
            singleItem: true,
            //navigation: true,
            pagination: false,
            autoHeight: true,
            //navigationText: [
            //    "<i class='fa fa-angle-left'></i>",
            //    "<i class='fa fa-angle-right'></i>"
            //],
            transitionStyle: "backSlide"
        });
    }, 5000);

    $(".each-chapter-carousel").owlCarousel({
        singleItem: true,
        //navigation: true,
        pagination: false,
        autoHeight: true,
        //navigationText: [
        //    "<i class='fa fa-angle-left'></i>",
        //    "<i class='fa fa-angle-right'></i>"
        //],
        transitionStyle: "backSlide"
    });
    //
    //$(".portfolio-gallery").owlCarousel({
    //    items: 3,
    //});

    // Magnific Popup jQuery Lightbox Gallery Settings
    $('.gallery-link').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        },
        image: {
            titleSrc: 'title'
        }
    });
};

Template.cover.events({
    // Click Login
    'click .login-btn': function() {
        log.show("Open Login Model.");
        $('#LoginModel').find('.alert').hide();
    },
    // Submit Login
    'click #login': function() {
        log.show("Check Login Column.");
        var _email = $('#LoginModel').find('input').eq(0).val();
        var _password = $('#LoginModel').find('input').eq(1).val();

        var _error = "";
        if(_email == null || _email == "") {
            _error = "Please fill the email column";
        } else if(_password == null || _password == "") {
            _error = "Please fill the password column";
        }

        if(_error == "") {
            log.show("Try Login")
            Meteor.loginWithPassword(_email, _password, function(err, res) {
                if(err) {
                    // Show Error
                    log.show("Login fail. " + err.reason);
                    $('#LoginModel').find('.alert').html(err.reason).show();
                } else {
                    // Go to Dashboard
                    log.show("Login successfully.");
                    location = "/dashboard";
                }
            })
        } else {
            // Show Error
            log.show("Including blank column while login.");
            $('#LoginModel').find('.alert').html(_error).show();
        }
    },

    // Open Narbar
    'click section, click body, click .owl-wrapper': function(e) {
        console.log('!!!');
        console.log(e.pageY);
        if(e.pageY < 50) {
            $('#Navbar').show();
        } else {
            $('#Navbar').hide();
        }
        if(SidebarOpen) {
            log.show("Close Sidebar");
            $('.sidebar').css({left:'-40%', animation: 'SidebarClose 0.5s', '-webkit-animation': 'SidebarClose 0.5s'});
            SidebarOpen = false;
        }
    },

    // Sidebar Events
    'click .glyphicon-menu-hamburger': function() {
        if(SidebarOpen) {
            log.show("Close Sidebar");
            $('.sidebar').css({left:'-40%', animation: 'SidebarClose 0.5s', '-webkit-animation': 'SidebarClose 0.5s'});
            SidebarOpen = false;
        } else {
            log.show("Open Sidebar");
            $('.sidebar').css({left:'0%', animation: 'SidebarOpen 0.5s', '-webkit-animation': 'SidebarOpen 0.5s'});
            SidebarOpen = true;
        }
    },

    // Favbar Events
    'click .glyphicon-star': function() {
        if(FavbarOpen) {
            log.show("Close Favbar");
            $('.favbar').css({left:'100%', animation: 'FavbarClose 0.5s', '-webkit-animation': 'FavbarClose 0.5s'});
            FavbarOpen = false;
        } else {
            log.show("Open Favbar");
            $('.favbar').css({left:'60%', animation: 'FavbarOpen 0.5s', '-webkit-animation': 'FavbarOpen 0.5s'});
            FavbarOpen = true;
        }
    },

    // Scroll to Chapter
    'click .navbar-brand': function(e) {
        var owl = $(".owl-carousel").data('owlCarousel');
        owl.goTo(0);
        $('#Navbar').hide();
        if(SidebarOpen) {
            log.show("Close Sidebar");
            $('.sidebar').css({left:'-40%', animation: 'SidebarClose 0.5s', '-webkit-animation': 'SidebarClose 0.5s'});
            SidebarOpen = false;
        }
    },
    'click .pointer-to-chapter': function(e) {
        var _page = e.currentTarget.id;
        var _sidebar = true;
        if(_page.indexOf("Menu") < 0) {
            _sidebar = false;
        }
        _page = _page.replace("Menu","");
        _page = _page.replace("Content","");
        _page = parseInt(_page);
        var owl = $(".owl-carousel").data('owlCarousel');
        owl.goTo(_page);

        //if(_sidebar) {
        //    log.show("Close Sidebar");
        //    $('.sidebar').css({left:'-40%', animation: 'SidebarClose 0.5s', '-webkit-animation': 'SidebarClose 0.5s'});
        //    SidebarOpen = false;
        //}
        if(SidebarOpen) {
            log.show("Close Sidebar");
            $('.sidebar').css({left:'-40%', animation: 'SidebarClose 0.5s', '-webkit-animation': 'SidebarClose 0.5s'});
            SidebarOpen = false;
        }
        $('#Navbar').hide();
        return null;
    },



    'click .sidebar-home': function() {
        log.show("Select Home");
        //$('#showframe').attr('src', 'indexpage');
        $('#showframe').show();
        $('.sidebar').css({left:'-40%', animation: 'SidebarClose 0.5s', '-webkit-animation': 'SidebarClose 0.5s'});
        SidebarOpen = false;
        $('.sidebar-item').removeClass('active');
        $('.sidebar-item-sub').removeClass('active');
        $('.sidebar-test').removeClass('active');
        $('.sidebar-home').addClass('active');

        $('#pdfcanvas').hide();
        $('#Testing').show();
    },
    'click .sidebar-item': function(e) {
        log.show("Select " + this.directory);
        $('#showframe').hide();
        $('#show_pdf_obj').attr('data', this.info.url);
        $('#show_pdf_emb').attr('src', this.info.url);
        $('.sidebar').css({left:'-40%', animation: 'SidebarClose 0.5s', '-webkit-animation': 'SidebarClose 0.5s'});
        SidebarOpen = false;
        $('.sidebar-home').removeClass('active');
        $('.sidebar-item').removeClass('active');
        $('.sidebar-item-sub').removeClass('active');
        $('.sidebar-test').removeClass('active');
        e.currentTarget.classList.add('active');

        //location = "upload/Test2.pdf";

        var _url = this.info.url;
        if(MyBrowser == "Mobile") {
            //_url = _url.replace(/localhost:\d+/,"meteor.local");
            console.log(_url);
        }
        DrawPDF(_url, 1);
    },
    'click .sidebar-item-sub': function(e) {
        log.show("Select " + this.name);
        $('#showframe').hide();
        $('#show_pdf_obj').attr('data', e.currentTarget.parentElement.id + '#page=' + this.page);
        $('#show_pdf_emb').attr('src', e.currentTarget.parentElement.id + '#page=' + this.page);
        $('.sidebar').css({left:'-40%', animation: 'SidebarClose 0.5s', '-webkit-animation': 'SidebarClose 0.5s'});
        SidebarOpen = false;
        $('.sidebar-home').removeClass('active');
        $('.sidebar-item').removeClass('active');
        $('.sidebar-item-sub').removeClass('active');
        $('.sidebar-test').removeClass('active');
        e.currentTarget.classList.add('active');

        //location = ".upload/Catalogue%2002.07.2015.pdf";

        var _url = e.currentTarget.parentElement.id;
        if(MyBrowser == "Mobile") {
            //_url = _url.replace(/http:/,"android:http:");
            //_url = _url.replace(/localhost:\d+/,"meteor.local");
            console.log(_url);
        }
        DrawPDF(_url, this.page);
    },
    'click .sidebar-test': function(e) {
        log.show("Select " + this.name);
        $('#showframe').hide();
        $('#show_pdf_obj').attr('data', "/Test2.pdf");
        $('#show_pdf_emb').attr('src', "/Test2.pdf");
        $('.sidebar').css({left:'-40%', animation: 'SidebarClose 0.5s', '-webkit-animation': 'SidebarClose 0.5s'});
        SidebarOpen = false;
        $('.sidebar-home').removeClass('active');
        $('.sidebar-item').removeClass('active');
        $('.sidebar-item-sub').removeClass('active');
        e.currentTarget.classList.add('active');
        DrawPDF("/Test2.pdf", 1);

        $('#Navbar').hide();
    },

    // Controls of the pdf
    'click #pdf-left': function() {
        DrawPDF(pdf_url, pdf_page-1);
    },
    'click #pdf-right': function() {
        DrawPDF(pdf_url, pdf_page+1);
    }
});

Template.cover.helpers({
    // Check is Web or Mobile
    IsWeb: function() {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            return false;
        } else {
            return true;
        }
    },
    IsMoblie: function() {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            return true;
        } else {
            return false;
        }
    },

    //pdf_data: function() {
    //    return PDFFiles.find({}, {sort: {pageindex: 1}});
    //}
    chapter_data: function() {
        return ChapterInfo.find({}, {sort: {index: 1}});
    },

    page_data: function() {
        return PagesInfo.find({}, {sort: {page: 1}});
    },

    page_data_in_chapter: function(chapter) {
        return PagesInfo.find({chapter: chapter}, {sort: {page: 1}});
    },

    generate_code: function(_id, code) {
        window.setTimeout(function() {
            $('#'+_id).html(code);
        }, 1000);
        $('#'+_id).html(code);
        return null;
    }

    // Swiper
    //Swiper: function() {
    //    return MySwiper.Swiper;
    //}
});


//MySwiper = {
//    Swiper: new Swipe(),
//    Initialize: function() {
//        MySwiper.Swiper = new Swipe(['CoverPage', 'ContentPage']);
//    }
//}

function DrawPDF(url, page) {
    $('#Testing').hide();
    var _page = page;
    if(isNaN(_page)) {
        _page = 1;
    }
    // Set worker URL to package assets
    PDFJS.workerSrc = '/packages/pascoual_pdfjs/build/pdf.worker.js';
    // Create PDF
    PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
        // Fetch the first page
        pdf.getPage(_page).then(function getPageHelloWorld(page) {
            var scale = 1;
            var viewport = page.getViewport(scale);

            // Prepare canvas using PDF page dimensions
            var canvas = document.getElementById('pdfcanvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            page.render({canvasContext: context, viewport: viewport}).promise.then(function () {});

            pdf_url = url;
            pdf_page = _page;

            $('#pdfcanvas').show();
            $('#pdf_buttons').show();
            $('#pdf-page').html(_page);
            if(_page == 1) {
                $('#pdf-left').hide();
            } else {
                $('#pdf-left').show();
            }
            if(_page < pdf.numPages) {
                $('#pdf-right').show();
            } else {
                $('#pdf-right').hide();
            }
        });
    });
}

// Show log
log = {
    active: false,
    show: function(message) {
        if(this.active) {
            console.log(message);
        }
    },
    alert: function(message) {
        if(this.active) {
            alert(message);
        }
    }
};
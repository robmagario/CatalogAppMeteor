/**
 * Created by chinhong on 6/29/15.
 */

var MyBrowser;
var SidebarOpen = false;

var pdf_url = "";
var pdf_page = 0;

Template.cover.rendered = function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        MyBrowser = "Mobile";
    } else {
        MyBrowser = "Web";
    }

    // Set worker URL to package assets
    if (MyBrowser == "Mobile") {
    }

    //$('#Testing').html(location.href);
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
            _url = _url.replace(/localhost:\d+/,"meteor.local");
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

    pdf_data: function() {
        return PDFFiles.find({}, {sort: {pageindex: 1}});
    }
});

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
            page.render({canvasContext: context, viewport: viewport}).promise.then(function () {

            });

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
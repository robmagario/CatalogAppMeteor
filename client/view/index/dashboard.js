/**
 * Created by chinhong on 6/29/15.
 */

Template.dashboard.rendered = function() {
    $('.content').show();
};

Template.dashboard.events({
    // Logout
    'click .logout-btn': function() {
        Meteor.logout(function() {
            location = "/";
        });
    },

    // Navbar Events
    'click .nav-tab': function(e) {
        var _value = e.currentTarget.innerText;
        _value = _value.replace(/ /m, "");
        $('.nav-tab').parent().removeClass('active');
        e.currentTarget.parentElement.classList.add('active');
        $('.page-item').hide();
        $('#'+_value).find('alert').html("").hide();
        $('#'+_value).show();
    },

    // Add Pile Events
    'click .btn-add-pile': function() {
        var _pile_name = $('#AddPile').find('input').eq(0).val();
        var _pile_page = $('#AddPile').find('input').eq(1).val();
        var _pile_text = $('#AddPile').find('textarea').eq(0).val();

        var _error = "";
        if(_pile_name == null || _pile_name == "") {
            _error = "Please fill the pile name";
        } else if(sNan(_pile_page)) {
            _error = "Please fill the page of this pile";
        } else if(_pile_text == null || _pile_text == "") {
            _error = "Please fill the information of this pile";
        }

        if(_error == "") {
            var _date = new Date();
            var _creater = Meteor.userId();

            var _PileAfterThisPile = Piles.find({page:{$gt:_pile_page}}, {sort:{page:1}});
            if(_PileAfterThisPile != null) {
                var _PileArray = _PileAfterThisPile.fetch();
                var i;
                for(i in _PileArray) {
                    if(!isNaN(i)) {
                        Piles.update({_id:_PileArray[i]._id}, {
                            page: (parseInt(_pile_page) + _PileArray[i].page)
                        });
                    }
                }
            }

            Piles.insert({
                name: _pile_name,
                page: parseInt(_pile_page),
                info: _pile_text,
                date: _date,
                creater: _creater
            })
        } else {
            $('#LoginModel').find('.alert').html(_error).show();
        }
    },

    'click .table-add-col': function() {
        var _headHTML = $('#AddPile').find('thead').html();
        console.log(_headHTML);
        var _BodyHTML = $('#AddPile').find('tbody').html();
        console.log(_BodyHTML);
    }
});

Template.dashboard.helpers({
    IsLogin: function() {
        if(Meteor.userId() != null) {
            return true;
        } else {
            return false;
        }
    }
});
(function(){

//    var facetTemplate = _.template(
//        "<% for (var i = 0; i < data.length; i++) { %>" +
//            "<ul><% for (var j = 0; j < data[i].values.length; j += 2) { %>" +
//                '<li><a href="#"><%- data[i].values[j] %></a> <%- data[i].values[j+1]%></li>' +
//            "<% } %></ul>" +
//        "<% } %>"
//    );

//    var facetTemplate = _.template(
//        "<table><% for (var row = 0; row < maxFacetResults; row++) { %>" +
//            "<tr><% for (var ftype = 0; ftype < data.length; ftype++) {%>" +
//                "<td><% if (data[ftype].values[row*2]) { %>" +
//                    '<div class="barbg" style="width: <%= Math.round((data[ftype].values[(row*2)+1]/data[ftype].max) * 90) %>%"></div>' +
//                    '<div class="label"><a href="#"><%- data[ftype].values[row*2] %></a> <em><%- data[ftype].values[(row*2)+1] %></em></div>' +
//                '</td><% } %>' +
//            "<% } %></tr>" +
//        "<% } %></table>"
//    );

    var facetTemplate = _.template(
        "<% for (var ftype = 0; ftype < data.length; ftype++) { if (data[ftype].values.length > 1) { %>" +
            '<div class="facetgroup"><% for (var row = 0; row < data[ftype].values.length; row++) { %>' +
                '<div class="item<% if (row >= collapseAfter) { print(" collapsed"); } %>">' +
                    '<div class="barbg <%- OP.utils.slugify(data[ftype].values[row]) %>" style="width: <%= Math.round((data[ftype].counts[row]/data[ftype].max) * 100) %>%"></div>' +
                    '<div class="label"><a href="#" data-add-facet="<%- data[ftype].filterName %>" data-facet-value="<%- data[ftype].values[row] %>"><%- data[ftype].labels[row] %></a> <em><%- data[ftype].counts[row] %></em></div>' +
                '</div><% } %>' +
            '<% if (data[ftype].values.length > collapseAfter) { %>' +
                '<div class="item show-more"><div class="label"><a href="#" class="quiet">more <%- data[ftype].pluralName.toLowerCase() %> &rarr;</a></div></div>' +
            '<% } %>' +
            '</div>' +
         '<% } } %>'
    );

    OP.FacetWidget = function(opts) {
        opts = opts || {};
        _.defaults(opts, {
            collapseAfter: 3
        });
        _.extend(this, opts);
        this.$el = $('<div class="facetwidget"></div>');

        this.$el.delegate('.show-more a', 'click', function(e) {
            e.preventDefault();
            $(this).closest('.facetgroup').addClass('nocollapse');
        });
    };

    OP.FacetWidget.prototype.setValues = function(data) {
        this.data = data;
        var self = this;
        _.each(data, function(f) {
            f.counts = _.filter(f.rawValues, _.isNumber);
            f.values = _.filter(f.rawValues, _.isString);
            if (f.labelFunc) {
                f.labels = _.map(f.values, f.labelFunc);
            }
            else {
                f.labels = f.values;
            }
            f.max = _.max(f.counts);
        });
        this.render();
    };

    OP.FacetWidget.prototype.render = function() {
        this.$el.html(facetTemplate(this));
    };

})();
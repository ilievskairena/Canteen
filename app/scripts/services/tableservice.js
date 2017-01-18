(function(){

    'use strict';

/**
 * @ngdoc service
 * @name canteenApp.tableService
 * @description
 * # tableService
 * Service in the canteenApp.
 */
 
    angular.module('canteenApp')
    .service('tableService', tableService);



    function tableService() {
        // AngularJS will instantiate a singleton by calling "new" on this function

        this.getTable = getTable;

        // This function is exposed for usage

        function getTable(data, lang){
            return buildTable(data, lang);
        }

        // Local functions

        function isArray(a) {
            return "[object Array]" === Object.prototype.toString.call(a);
        }

        function encodeText(a) {
            return $("<div />").text(a).html();
        }

        function isEven(a) {
            return 0 === a % 2;
        }

        function getHeader(string, language){
            return string;
        }

        function buildArray(a, lang) {
            var e = document.createElement("table"), child, 
                d, b, c = !1,
                p = !1,
                m = {},
                h = -1,
                n = 0,
                td_class = null,
                l;
                $(e).addClass("table table-bordered table-striped table-condensed table-hover");
            l = "";
            if (0 === a.length){
                return "<div></div>";
            }
            d = e.insertRow(-1);
            for (var f = 0; f < a.length; f++)
                if ("object" !== typeof a[f] || isArray(a[f])){
                    "object" === typeof a[f] && isArray(a[f]) ? (b = d.insertCell(h),
                        b.colSpan = 2,
                        b.innerHTML = '<div class="td_head"></div><table class="table table-bordered table-striped table-condensed table-hover" style="width:100%">' + $(buildArray(a[f], lang), !1).html() + "</table>",
                        c = !0) : p || (h += 1,
                        p = !0,
                        b = d.insertCell(h),
                        m.empty = h,
                        b.innerHTML = "<div class='td_head'>&nbsp;</div>");
                }
                else{
                    for (var k in a[f]){
                        l =
                        "-" + k,
                        l in m || (c = !0,
                            h += 1,
                            b = d.insertCell(h),
                            m[l] = h,
                            b.innerHTML = "<div class='td_head'>" + getHeader(encodeText(k), lang) + "</div>");
                    }
                }

            c || e.deleteRow(0);
            n = h + 1;
            for (f = 0; f < a.length; f++)
                if (d = e.insertRow(-1),
                    td_class = isEven(f) ? "td_row_even" : "td_row_odd",
                    "object" !== typeof a[f] || isArray(a[f]))
                    if ("object" === typeof a[f] && isArray(a[f]))
                        for (h = m.empty,
                            c = 0; c < n; c++)
                            b = d.insertCell(c),
                            b.className = td_class,
                            l = c == h ? '<table class="table table-bordered table-striped table-condensed table-hover" style="width:100%">' + $(buildArray(a[f], lang), !1).html() + "</table>" : " ",
                            b.innerHTML = "<div class='" + td_class + "'>" + encodeText(l) +
                            "</div>";
                    else
                        for (h = m.empty,
                            c = 0; c < n; c++)
                            b = d.insertCell(c),
                            l = c == h ? a[f] : " ",
                            b.className = td_class,
                            b.innerHTML = "<div class='" + td_class + "'> " + encodeText(l) + "</div>";
            else {
                for (c = 0; c < n; c++)
                    b = d.insertCell(c),
                    b.className = td_class,
                    b.innerHTML = "<div class='" + td_class + "'>&nbsp;</div>";
                for (k in a[f])
                    c = a[f],
                    l = "-" + k,
                    h = m[l],
                    b = d.cells[h],
                    b.className = td_class,
                    "object" != typeof c[k] || isArray(c[k]) ? "object" == typeof c[k] && isArray(c[k]) ? b.innerHTML = '<table class="table table-bordered table-striped table-condensed table-hover" style="width:100%">' + $(buildArray(c[k], lang), !1).html() + "</table>" : b.innerHTML =
                    "<div class='" + td_class + "'>" + encodeText(c[k]) + "</div>" : b.innerHTML = '<table class="table table-bordered table-striped table-condensed table-hover" style="width:100%">' + $(buildTable(c[k], lang), !1).html() + "</table>";
            }


            //create temp div element and put the table in it!
            var tmp = document.createElement("div");
            tmp.appendChild(e);
            //get the innerHTML from that div as string
            return tmp.innerHTML;
        }

        function buildTable(a, lang) {
            var e = document.createElement("table"),
                d, b;
            if (isArray(a))
                return buildArray(a,lang);
            for (var c in a)
                "object" !== typeof a[c] || isArray(a[c]) ? "object" === typeof a[c] && isArray(a[c]) ? (d = e.insertRow(-1),
                    b = d.insertCell(-1),
                    b.colSpan = 2,
                    b.innerHTML = '<div class="td_head">' + encodeText(c) + '</div><table class="table table-bordered table-striped table-condensed table-hover" style="width:100%">' + $(buildArray(a[c],lang), !1).html() + "</table>") : (d = e.insertRow(-1),
                    b = d.insertCell(-1),
                    b.innerHTML = "<div class='td_head'>" + getHeader(encodeText(c), lang) + "</div>",
                    d = d.insertCell(-1),
                    d.innerHTML = "<div class='td_row_even'>" +
                    encodeText(a[c]) + "</div>") : (d = e.insertRow(-1),
                    b = d.insertCell(-1),
                    b.colSpan = 2,
                    b.innerHTML = '<div class="td_head">' + encodeText(c) + '</div><table class="table table-bordered table-striped table-condensed table-hover" style="width:100%">' + $(buildTable(a[c], lang), !1).html() + "</table>");
            return e
        }
    }
})();
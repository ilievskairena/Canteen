(function(){

    'use strict';

/**
 * @ngdoc service
 * @name canteenApp.Excel
 * @description
 * # Excel
 * Factory in the canteenApp.
 */
 
    angular.module('canteenApp')
    .factory('Excel', Excel);

    Excel.$inject = ['$window', 'tableService'];

    function Excel($window, tableService){
        
        var uri='data:application/vnd.ms-excel;base64,',
            template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
            format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};

        var excelObject = {
            tableToExcel: tableToExcel
        }

        return excelObject;

        // Define functions here

        function tableToExcel(tableId,worksheetName){
            var table=$(tableId),
                ctx={worksheet:worksheetName,table:table.html()},
                href=uri+base64(format(template,ctx));
            return href;
        };
    }
})();

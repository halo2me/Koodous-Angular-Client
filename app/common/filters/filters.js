angular.module('filters', []).filter('truncate', function () {
    return function (text, length, end) {
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length-end.length) + end;
        }
    };
});

angular.module('filters').filter('slice', function() {
    return function(arr, start, end) {
        return (arr || []).slice(start, end);
    };
});

angular.module('filters').filter('bytes', function() {
    return function(bytes, precision){

        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)){
            return '-';
        }
        if (bytes === 0){ 
            return '0 bytes';
        }

        if (typeof precision === 'undefined'){
            precision = 1;
        }
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    };
});

angular.module('filters').filter('mentions', function(){
    return function(text){
        var matches = [];
        var aux = text.split(" ");
        for(var i = 0; i < aux.length; i++){
            if (aux[i].startsWith('@')){
                matches.push(aux[i]);
            }
        }

        for(var i = 0; i < matches.length; i++)
        {
            var aux = matches[i].replace("@","");
            aux = "<a href='/analysts/"+ aux +"'>@"+ aux +"</a>";
            text = text.replace(matches[i], aux);
        }

        return text
    };
});

angular.module('filters').filter('hashtags', function(){
    return function(text){
        var matches = [];
        var aux = text.split(" ");
        for(var i = 0; i < aux.length; i++){
            if (aux[i].startsWith('#')){
                matches.push(aux[i]);
            }
        }

        for(var i = 0; i < matches.length; i++)
        {
            var aux = matches[i].replace("#","");
            aux = "<a href='/apks?search=tag:"+ aux +"' class='label label-info mr-sm'>#"+ aux +"</a>";
            text = text.replace(matches[i], aux);
        }
        
        return text;
    }
});
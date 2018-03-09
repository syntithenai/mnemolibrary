
export default class Utils {
    
    
}

Utils.snakeToCamel = function(s){
    var c = s.replace(/(_\w)/g, function(m){return ' ' + m[1].toUpperCase() ;});
    c = c.charAt(0).toUpperCase() + c.slice(1)
    return c
}

Utils.isObject = function (value) {
      return value && typeof value === 'object' && value.constructor === Object;
    };

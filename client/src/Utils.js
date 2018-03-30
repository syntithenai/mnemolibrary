
export default class Utils {
    
    
}

Utils.snakeToCamel = function(s){
    if (s) {
     var c = s.replace(/(_\w)/g, function(m){return ' ' + m[1].toUpperCase() ;});
    c = c.charAt(0).toUpperCase() + c.slice(1)
    return c   
    }
    return '';
}

Utils.isObject = function (value) {
      return value && typeof value === 'object' && value.constructor === Object;
    };

Utils.getQuestionTitle = function(question) {
    if (question) {
        var parts=[];
        if (question.interrogative) parts.push(question.interrogative);
        if (question.prefix) parts.push(question.prefix);
        if (question.question) parts.push(question.question);
        if (question.postfix) parts.push(question.postfix);
        return parts.join(' ');
    }
}

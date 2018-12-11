import 'whatwg-fetch'

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
        if (question.interrogative && question.interrogative.length > 0) parts.push(question.interrogative.trim());
        if (question.prefix && question.prefix.length > 0) parts.push(question.prefix.trim());
        if (question.question && question.question.length > 0) parts.push(question.question.trim());
        let postfix = question.postfix ? question.postfix : '';
        if (postfix && postfix.length > 0) postfix = postfix.trim();
        return parts.join(' ')+postfix;
    }
}

Utils.loadWikipediaIntro = function(question) {
    if (question && question.length > 0) {
        let url = 'https://en.wikipedia.org/w/api.php?format=json&redirects=true&action=query&origin=*&prop=extracts&exintro=&explaintext=&titles='+question;
        return fetch(url)
          .then(function(response) {
            ////console.log(['got response', response])
            return response.json()
          }).then(function(json) {
              //console.log(['wiki load got response', json,Object.values(json.query.pages)])
              if (json && json.query && json.query.pages) {
                  let found = null;
                  Object.values(json.query.pages).map(function(page) {
                //      console.log(['got page', page])
                      if (!found) {
                          found = page;
                      }
                      return null;
                  });
                //  console.log(['got page found ', found,found.extract])
                if (found) return found.extract;
              }
              return null;
          }).catch(function(ex) {
            console.log(['failed wiki lookup intro', ex])
          });        
    } else {
        return '';
    }
}


Utils.loadWikipediaImage = function(question) {
   // console.log(['wiki load image', question])
    if (question && question.length > 0) {
        // LOOKUP IMAGE
        let url = 'https://en.wikipedia.org/w/api.php?origin=*&redirects=true&action=query&prop=pageimages&format=json&piprop=original&titles='+question
        //let url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=images&titles='+question;
        return fetch(url)
          .then(function(response) {
            ////console.log(['got response', response])
            return response.json()
          }).then(function(json) {
             // console.log(['wiki load image got response', json,Object.values(json.query.pages)])
              let found = null;
              if (json && json.query && json.query.pages) {
                  Object.values(json.query.pages).map(function(page) {
                  //    console.log(['got page', page])
                      if (found === null && page.original && page.original.source && page.original.source.length > 0) {
                          found = page.original.source;
                      }
                      return null;
                  });
              }
              return found;
          }).catch(function(ex) {
            console.log(['failed wiki lookup image', ex])
          });        
    } else {
        return '';
    }
}


//https://en.wikipedia.org/w/api.php?action=query&prop=images&titles=apple
//https://en.wikipedia.org/w/api.php?action=query&titles=File:God%20Defend%20New%20Zealand%20instrumental.ogg&prop=imageinfo&iilimit=50&iiend=2007-12-31T23:59:59Z&iiprop=timestamp|user|url

//https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=java
//{"batchcomplete":"","query":{"normalized":[{"from":"java","to":"Java"}],"pages":{"69336":{"pageid":69336,"ns":0,"title":"Java","extract":"Java (Indonesian: Jawa; Javanese: \ua997\ua9ae; Sundanese: \u1b8f\u1b9d) is an island of Indonesia. With a population of over 141 million (Java only) or 145 million (including the inhabitants of its surrounding islands), Java is the home to 56.7 percent of the Indonesian population and is the world's most populous island. The Indonesian capital city, Jakarta, is located on its northwestern coast. Much of Indonesian history took place on Java. It was the center of powerful Hindu-Buddhist empires, the Islamic sultanates, and the core of the colonial Dutch East Indies. Java was also the center of the Indonesian struggle for independence during the 1930s and 1940s. Java dominates Indonesia politically, economically and culturally. Four of Indonesia's eight UNESCO world heritage sites are located in Java: Ujung Kulon National Park, Borobudur Temple, Prambanan Temple, and Sangiran Early Man Site.\nFormed mostly as the result of volcanic eruptions from geologic subduction between Sunda Plate and Australian Plate, Java is the 13th largest island in the world and the fifth largest in Indonesia by landmass at about 138,800 square kilometres (53,600 sq mi). A chain of volcanic mountains forms an east\u2013west spine along the island. Three main languages are spoken on the island: Javanese, Sundanese, and Madurese, where Javanese is the most spoken; it is the native language of about 60 million Javanese people in Indonesia, most of whom live on Java. Furthermore, most residents are bilingual, speaking Indonesian (the official language of Indonesia) as their first or second language. While the majority of the people of Java are Muslim, Java's population is a diverse mixture of religious beliefs, ethnicities, and cultures.\nJava is divided into four administrative provinces, West Java, Central Java, East Java, and Banten, and two special regions, Jakarta and Yogyakarta."}}}}

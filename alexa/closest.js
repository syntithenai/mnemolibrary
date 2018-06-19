let customSlots = require('./vocabdump.js');
var levenshtein = require('fast-levenshtein');

// SOUNDEX (EUDEX) TEXT COMPARISON

function closestI(type,thing) {
    let distances=[];
    customSlots[type].map(function(val,key) {
        let value={text:val,seek:thing}
        //value.distance = distance(thing, val);
        value.distance = levenshtein.get(thing, val);
        distances.push(value);
    });
    distances.sort(function(a,b) {
        if (a.distance < b.distance) {
            return -1;
        } else {
            return 1
        }
    });
    //console.log('DIST',distances);
    let returnval = {};
    if (distances && distances.length > 0) {
        returnval = {'text':distances[0].text,'seek':distances[0].seek};
        if (thing && distances[0] && distances[0].text && distances[0].text.trim().toLowerCase()===thing.trim().toLowerCase()) {
            returnval.match=true;
        } else {
            returnval.match=false;
        }
    }
    
    let alternatives=[];
    if (distances.length>1) alternatives.push(distances[1].text);
    if (distances.length>2) alternatives.push(distances[2].text);
    returnval.alternatives=alternatives;
    return returnval;
}

let closest= {
    tag: function(tag) {
       return closestI('tags',tag);
    },

    topic: function(topic) {
       return closestI('topics',topic);
    }
}
module.exports=closest;

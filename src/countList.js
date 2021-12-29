function CountList() {
    var self = this;
    var set = new Set();
    var counts = [];

    self.push = function(obj) {
        if(!set.has(obj)){
            set.add(obj);
        }

        if(!counts.includes(obj)){
            counts[obj] = 0;
        }

        counts[obj]++;
    };

    self.getCount = function(obj) {
        if(!set.has(obj))
            return 0;

        return counts[obj];
    };
}

module.exports = CountList;
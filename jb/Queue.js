var Queue = function() {

	this.q = [];
	this.count = 0;

	this.add = function (tracks) {
		var result = [];
		for (var i=0; i<tracks.length; i++) {
			this.count++;
			var item = {
				id: this.count,
				track: tracks[i],
				votes: {
					total: 0,
					details: []
				}
			};
			this.q.push(item);
			result.push(item);
		}
		return result;
	};

	this.pop = function () {
		if (this.q.length > 0) {
			var head = this.q.shift();
			return head;
		} else {
			return null;
		}
	};

	this.length = function () {
		return this.q.length;
	};

	this.order = function () {
		this.q.sort(function(a,b) {
			if (a.votes.total == b.votes.total)
				return a.id - b.id;
			return b.votes.total - a.votes.total;
		});
	};

	this.vote = function (q_id, user_id) {
		// add vote to item with q_id, user_id
		// reorder!
		for (var i=0; i<this.q.length; i++) {
			if (this.q[i].id == q_id) {
				var votes = this.q[i].votes;
				var found = false;
				for (var j=0; j<votes.details.length; j++) {
					if (votes.details[j].user_id == user_id) {
						votes.details[j].votes++;
						votes.total++;
						found = true;
						break;
					}
				}
				if (found == false) {
					votes.details.push({
						user_id: user_id,
						pref: {},
						votes: 1
					});
					votes.total++;
				}
				break;
			}
		}
		this.order();
	};

};

module.exports = Queue;
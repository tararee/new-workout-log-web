$(function() {
	$.extend(WorkoutLog, {
		feed: [],
		addFeedItem: function(feedData){
			var li = $("<li>").append(feedData.username + feedData.message);
			li.addClass("list-group-item");
			$("#feed-list").append(li);
			WorkoutLog.feed.push(feedData);
		},
			sendChat: function(){
				WorkoutLog.socket.emit("chat-message", {
					username: WorkoutLog.username,
					message: " says " + $("#msg").val()
				});
				$("#msg").val("");
			},
		setFeed: function() {
			var feed = WorkoutLog.feed;
			var len = feed.length;
			var lis = "";
			for (var i = 0; i < len; i++) {
				lis += "<li class='list-group-item'>";
				lis += feed[i].username + feed[i].message;
				lis += "</li>";
			}
			$("#feed-list").children().remove();
			$("#feed-list").append(lis);
		},

		fetchAllFeeds: function() {

			var fetchFeeds = $.ajax({
				type: "GET",
				url: WorkoutLog.API_BASE + "feed",
				headers: {
					"Authorization": window.localStorage.getItem("sessionToken")
				}
			});

			fetchFeeds.done(function(data) {
				console.log(data);
				WorkoutLog.feed = data;
			});
		}
	});
	$("#msg-send").on("click", WorkoutLog.sendChat);

	if (window.localStorage.getItem("sessionToken")) {
		WorkoutLog.fetchAllFeeds();
	}
});
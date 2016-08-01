$(function() { // same as $(document).ready(function() {
	$.extend(WorkoutLog, {
		log: {
			workouts: [],
			
			setDefinitions: function() {
				var defs = WorkoutLog.definition.userDefinitions;
				var len = defs.length;
				var opts = "";
				for (var i = 0; i < len; i++) {
					opts += "<option value='" + defs[i].id + "'>" + defs[i].description + "</option>";
				}
				$("#log-definition").children().remove();
				$("#log-definition").append(opts);
			},

			setHistory: function() {
				var history = WorkoutLog.log.workouts;
				var len = history.length;
				var lis = "";
				for (var i = 0; i < len; i++) {
					var result = history[i].result === "" ? "No result found" : history[i].result;
					lis += "<li class='list-group-item'>" + history[i].def + " - " + result + "</li>";
				}
				$("#history-list").children().remove();
				$("#history-list").append(lis);
			},

			create: function() {
				var itsLog = {
					desc: $("#log-description").val(),
					result: $("#log-result").val(),
					def: $("#log-definition option:selected").text()
				};

				var postData = { log: itsLog };
				var logger = $.ajax({
					type: "POST",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(postData),
					contentType: "application/json"
				});

				logger.done(function(data) {
					WorkoutLog.log.workouts.push(data);
				});

				logger.fail(function() {
					console.log("something broke");
				});

			},

			fetchAll: function() {
				var fetchDefs = $.ajax({
					type: "GET",
					url: WorkoutLog.API_BASE + "log",
					headers: {
						"Authorization": window.localStorage.getItem("sessionToken")
					}
				});

				fetchDefs.done(function(data) {
					WorkoutLog.log.workouts = data;
				});

				fetchDefs.fail(function(err) {
					console.log("an error occured" + err.message);
				});
			}
		}
	});

	$("#log-save").on("click", WorkoutLog.log.create);

	if (window.localStorage.getItem("sessionToken")) {
		WorkoutLog.log.fetchAll();
	}
});
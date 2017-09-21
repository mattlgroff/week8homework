// Initialize Firebase
var config = {
  apiKey: "AIzaSyBOpovTrsLr-yiDeB328fjU1-f9BabaXnQ",
  authDomain: "ravenclaw-6b60a.firebaseapp.com",
  databaseURL: "https://ravenclaw-6b60a.firebaseio.com",
  projectId: "ravenclaw-6b60a",
  storageBucket: "ravenclaw-6b60a.appspot.com",
  messagingSenderId: "47418893226"
};

firebase.initializeApp(config);

var database = firebase.database();

var trainsRef = database.ref("/trains");

$(document).ready( function(){

  //capital H gives you 24 hour
  //console.log("The time is now: " + moment().format('H:mm') );
	//console.log(beginningTime.isBefore(endTime));

	trainsRef.orderByChild("dateAdded").on("value", function(snapshot) {

    var sv = snapshot.val();

    $.each(sv, function(index, value) {

            var startTime = parseInt(value.StartTime);

            var frequency = parseInt(value.Frequency);

            var firstTimeConverted = moment().format('H:mm');

            if (moment().isBefore(startTime) ){
              console.log("Current time is before: " + startTime);

              var nextArrival = startTime;
            }
            else {
              console.log("Current time is after: " + startTime);

              var nextArrival = moment()
               .add(minutesAway,'minutes')
               .format('HH:mm');
            }

            // Difference between the times
            var diffTime = moment( (moment().diff(moment(startTime), "minutes") ) ).format("mm");

             // Time apart (remainder)
            var tRemainder = diffTime % frequency;

            // Minute Until Train
            var minutesAway = frequency - tRemainder;

            //Next Arrival
            

            tr = $('<tr/>');
            tr.append("<td>" + value.TrainName + "</td>");
            tr.append("<td>" + value.Destination + "</td>");
            tr.append("<td>" + frequency + "</td>");
            tr.append("<td>" + nextArrival + "</td>");
            tr.append("<td>" + minutesAway + "</td>");
            $("#train-data").prepend(tr);
      }); 



      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
	});


	$("#submit").on("click", function(){
		event.preventDefault();

		$("#submit").prop('disabled', true);

		setTimeout(function(){
			$("#submit").prop('disabled', false);
		}, 1000);

		var trainName = $('#train-name').val(),
				destination = $("#destination").val(),
				startTime = $("#start-time").val(),
				frequency = $("#frequency").val();

		trainsRef.push({
			TrainName: trainName,
			Destination: destination, 
			StartTime: startTime,
			Frequency: frequency,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});		

	});

});


// function findMonths(oldDate, newDate){

// 	var splitStartDate = oldDate.split("-");
//   var splitCurrentDate= newDate.split("-");

//   //Multiply the years difference between them by 12.
//   var monthsWorked = (parseInt(splitCurrentDate[0]) - parseInt(splitStartDate[0])) * 12;
 
//  	//Subtract the months in "old date"
//   monthsWorked -= parseInt(splitStartDate[1]);

//   //Add the months from the "new date"
//   monthsWorked += parseInt(splitCurrentDate[1]);

//   return monthsWorked;

// }
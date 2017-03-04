$(document).ready(function(){

	$(".error").addClass("alert alert-danger");
	$(".success").addClass("alert alert-success");




   //  $.ajax({
   //         url: "https://api.mlab.com/api/1/databases/fccpoll/collections/polls?apiKey=uMhmOgA4EeCUmpRBM_DyLdWS0DNTvm6N",
   //         type: 'get',
   //         contentType: 'application/json',                                                                               
   //     })
   //     .done(function(data) {
			// let polltitle = $(".polltitle").html();
			// let dataArr = [];
			// var colorArr = [];
			// let voteArr = [];
			// for(let val in data){
			// 	if(data[val].title == polltitle){
			// 		for(let i = 0; i < data[val].polls.length; i++){
			// 			let optionLog = "<option>" + data[val].polls[i].options + "</option>";
			// 			$(".optionlog").append(optionLog);
			// 			dataArr.push(data[val].polls[i].options);
			// 			voteArr.push(data[val].polls[i].count);
			// 			colorArr.push(randomColor({luminosity: 'random', hue: 'random'}));
			// 		}
			// 		$(".optionlog").append('<option>I would like to add an option</option>');
			// 	}
			// }

			// let ctx = document.getElementById("myChart");
			// Chart.defaults.global.legend.position = "bottom";
			// let myPieChart = new Chart(ctx,{
			//     type: 'pie',
			//     data: {
			// 		    labels: dataArr,
			// 		    datasets: [
			// 		        {
			// 		            data: voteArr,
			// 		            backgroundColor: colorArr,
			// 		            hoverBackgroundColor: colorArr
			// 		        }]
			// 		  }
			// });


	  //      })
	  //      .fail(function(request,status,error) {
	  //      })
	  //      .always(function() {
   //     })

// MarioChar.update({name: 'Mario'}, {$inc: {weight: 1}})
// 	$( "form" ).submit(function(e) {

// 	    $.ajax({
// 	           url: "https://api.mlab.com/api/1/databases/fccpoll/collections/polls?apiKey=uMhmOgA4EeCUmpRBM_DyLdWS0DNTvm6N",
// 	           type: 'PUT',
// 	           data: JSON.stringify({}),
// 	           contentType: 'application/json',
// 	           success: function(data){
// 	           	console.log(data);
// 	           },
// 	           error: function(xhr, status, err){
// 	           	console.log(err);
// 	           }
// 	    });


// //		alert($("form option:selected").val());
// 		return false;
// 	})

//	$('form').change(function(){
//		console.log($("form option:selected").val());
//	})






});
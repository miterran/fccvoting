$(document).ready(function(){

function updateChart(){
    $.ajax({
           url: "https://api.mlab.com/api/1/databases/fccpoll/collections/polls?apiKey=uMhmOgA4EeCUmpRBM_DyLdWS0DNTvm6N",
           type: 'get',
           contentType: 'application/json'                                                                               
       })
       .done(function(data) {
			let polltitle = $(".polltitle").html();
			let dataArr = [];
			let colorArr = [];
			let voteArr = [];
			for(let val in data){
				if(data[val].title == polltitle){
					for(let i = 0; i < data[val].polls.length; i++){
						let optionLog = '<option value="'+ i +'">' + data[val].polls[i].options + '</option>';
						$(".optionlog").append(optionLog);
						dataArr.push(data[val].polls[i].options);
						voteArr.push(data[val].polls[i].count);
						colorArr.push(randomColor({luminosity: 'random', hue: 'random'}));
					}
					$(".optionlog").append('<option value="x">I would like to add an option</option>');
				}
			}

			let ctx = document.getElementById("myChart");
			Chart.defaults.global.legend.position = "bottom";
			let myPieChart = new Chart(ctx,{
			    type: 'pie',
			    data: {
					    labels: dataArr,
					    datasets: [
					        {
					            data: voteArr,
					            backgroundColor: colorArr,
					            hoverBackgroundColor: colorArr
					        }]
					  }
			});


	       })
	       .fail(function(request,status,error) {
	       })
	       .always(function() {
       })
}

updateChart();

	$('form').change(function(){
		if($('form option:selected').val() == "x" && !($('.addnewoption').hasClass('oktoadd'))){
			var addNewOption = '<div class="newOptionClass form-group"><label>add my own option</label><input type="text" class="form-control adding" placeholder="new option" name="newoption"></div>';
			$('.addnewoption').addClass('oktoadd');
			$(".addnewoption").append(addNewOption);
		}else if($('form option:selected').val() !== "x"){
			$('.addnewoption').removeClass('oktoadd');
			$(".newOptionClass").remove();
		}
	})
});
	  
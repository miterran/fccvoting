$(document).ready(function(){

	$(".error").addClass("alert alert-danger");
	$(".success").addClass("alert alert-success");

	var optionCount = 1;
	$(".addOption").click(function(){
		optionCount++;
		var newOption = '<div class="form-group"><input type="text" class="form-control" placeholder="Option ' + optionCount + '" name="option' + optionCount + '"></div>';
		$(".addOptionBelow").append(newOption);
	});
});
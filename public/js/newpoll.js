$(document).ready(function(){
	var optionCount = 2;
	$(".addOption").click(function(){
		optionCount++;
		var newOption = '<div class="form-group"><input type="text" class="form-control" placeholder="Option ' + optionCount + '" name="option' + optionCount + '"></div>';
		$(".addOptionBelow").append(newOption);
	});
});
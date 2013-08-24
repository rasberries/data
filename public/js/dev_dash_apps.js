
$(function() {
	
	
	
	$("#add_button_req").click(function(){
		window.open('/dev_dash_create');
	});
	
	$.fn.serializeObject = function()
	{
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};
	
	
	/*$('#submit_button_add').click(function(){
		console.log('Inside function!');
		$form = $('#add_app_form');
		console.log(JSON.stringify($('#add_app_form').serializeObject()));
		var json = JSON.stringify($('#add_app_form').serializeObject());
		
		$.ajax({
		  type: 'POST',
		  async: false,
		  url: "http://localhost:3000/test",
		  data: json,
		  contentType: "application/json",
		  dataType:"json",
		  success: function(data, status, xhr){
			console.log("Yeah it worked allright!");
			console.log(data);
		  },
		  error: function(xhr, status, err) {
			alert(status + ": " + err);
		  }
		});
	});*/
});
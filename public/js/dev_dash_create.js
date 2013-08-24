
$(function() {
	
	var d_field =1 ;
	var dependency_fields = '<div><br><input name="d_'+d_field+'_url" type ="text" class="i_styled" placeholder ="URL to dependency"/><input name="d_'+d_field+'_instr" type ="text" class="i_styled d_instr" placeholder ="dependency instructions"/></div>';
	var d_fields_wrap_height = 50;				
	
	
	
	$(".add_dependency").click(function(){
		$("#d_fields_wrap").append(dependency_fields);
		d_field++;
		d_fields_wrap_height += 50;
		console.log('fields wrap height: '+d_fields_wrap_height);
		console.log('window height '+document.height);
	});
	$('.remove_dependency').click(function(){
		$("#d_fields_wrap div:last-child").remove();
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
	
	$('#submit_button_add').click(function(){
		console.log('Inside function!');
		$form = $('#add_app_form');
		console.log(JSON.stringify($('#add_app_form').serializeObject()));
		var json = JSON.stringify($('#add_app_form').serializeObject());
		//var serializedData = $form.serialize();
		$.ajax({
		  type: 'POST',
		  async: false,
		  url: "http://localhost:3000/api/add_app",
		  data: json,
		  contentType: "application/json",
		  dataType:"json",
		  success: function(data, status, xhr){
			console.log("Yeah it worked allright!");
			console.log(data);
		  },
		  error: function(xhr, status, err) {
			console.log(err);
		  }
		});
		
	});
	
	
	
	/*
	//other way of doin'things (ajax requests)
	
	$.ajax({
      type: 'POST',
      async: false,
      url: "your_url_1",
      data: $(this).serialize(),
      success: function(data, status, xhr){
        alert('ok');
      },
      error: function(xhr, status, err) {
        alert(status + ": " + err);
      }
    });
	
	
	
	
	*/
	
	
	// variable to hold request
	var request;
	// bind to the submit event of our form
	$("#add_app_form").submit(function(event){
		console.log('form submitting!');
		// abort any pending request
		if (request) {
			request.abort();
		}
		// setup some local variables
		var $form = $(this);
		// let's select and cache all the fields
		var $inputs = $form.find("input, select, button, textarea");
		// serialize the data in the form
		var serializedData = $form.serializeObject();
		var json = JSON.stringify(serializedData)

		// let's disable the inputs for the duration of the ajax request
		$inputs.prop("disabled", true);

		// fire off the request to /form.php
		request = $.ajax({
			url: "http://localhost:3000/test",
			type: "post",
			data: json,
			contentType:'json',
			dataType: 'json'
		});

		// callback handler that will be called on success
		request.done(function (response, textStatus, jqXHR){
			// log a message to the console
			console.log("Hooray, it worked!");
		});

		// callback handler that will be called on failure
		request.fail(function (jqXHR, textStatus, errorThrown){
			// log the error to the console
			console.error(
				"The following error occured: "+
				textStatus, errorThrown
			);
		});

		// callback handler that will be called regardless
		// if the request failed or succeeded
		request.always(function () {
			// reenable the inputs
			$inputs.prop("disabled", false);
		});
		
		// prevent default posting of form
		event.preventDefault();
	});
});
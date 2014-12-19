   var lineData = '{"Data":[{"Loading":9}]}'
   var keys_obj = JSON.parse(lineData);
   var keys = Object.keys(keys_obj.Data[0]);



  function NewDropdown(name, defaultVariable) {
    var self = this;
    self.name = name;
    self.col_name = ko.observable(defaultVariable);
  }
   // Class to represent predictor and response variables
   function NewVariable(name, defaultVariable) {
       var self = this;
       self.name = name;
       self.col_name = ko.observable(defaultVariable);
       self.column = {headerText: self.col_name, rowText: function(item) {return item[self.col_name()]}}
   }

   // Overall viewmodel, along with initial state
   function DNViewModel(data) {
      var self = this;

      var setData=["Loading Datasets"];
      self.optionValues=ko.observableArray(setData);
      self.datasets = [new NewDropdown("Data Set", "Select One")];

       // List of column names within data
       self.variableList = ko.observableArray(keys);

       //Code for dropdown menus to pick variables to use
       var1 = new NewVariable("Predictor Variable", "Select One")
       var2 = new NewVariable("Response Variable", "Select One")
       self.variables = [var1, var2];

       self.data = ko.observableArray(data);
       // grid view model binds to this array of columns
       self.currentColumns = ko.observableArray([{headerText:var1.col_name(),rowText:function(item) {return item[var1.col_name()]}},{headerText:var2.col_name(),rowText:function(item) {return item[var2.col_name()]}}])

       self.gridViewModel = new ko.simpleGrid.viewModel({
        data: self.data,
           columns: self.currentColumns,
        pageSize: 4
    });
   };

   var myData = keys_obj.Data

   var myViewModel = new DNViewModel(keys_obj.Data);
   ko.applyBindings(myViewModel);

  $.getJSON("http://beacon-center.org/datanuggets/nuggets/datasets.json", function(data) {
               myViewModel.optionValues(data)
               });

  var x_value;
  x_data = ['x'];

  y_data = ['y'];
  var y_value

      
//~~~~~~~~~~~Update functions~~~~~~~~~~~~

 //Update column name choices when data set is chosen
 myViewModel.datasets[0].col_name.subscribe(
                                               function(newValue) {
                                               var tempstring = "http://beacon-center.org/datanuggets/nuggets/"+newValue+"/columns.json";
                                               $.getJSON(tempstring, function(data) {
                                                  var columns = data
                                                  myViewModel.variableList(data)
                                               })
                                               });



  myViewModel.variables[0].col_name.subscribe(
      function(newValue) {
	  if(newValue != "Select One"){
      //TODO: check if data is already in dictionary
        //Else add it to the data items
        var tempstring = "http://beacon-center.org/datanuggets/nuggets/"+myViewModel.datasets[0].col_name()+"/"+newValue+".json";
        $.getJSON(tempstring, function(data){
           x_value = newValue;
           x_data = ['x'];
  
        for (i=0; i<data.length; i++){
            x_data.push(parseInt(data[i]));
            if (myViewModel.data()[i]){
              myViewModel.data()[i][newValue]=parseInt(data[i]);
            } else {
              myViewModel.data().push({newValue:parseInt(data[i])})
            }
        }myViewModel.data.valueHasMutated()
	     myViewModel.currentColumns = [{headerText:newValue,rowText:function(item) {return item[newValue]}},{headerText:myViewModel.variables[1].col_name(),rowText:function(item) {return item[myViewModel.variables[1].col_name()]}}]
        
	if (y_value){
                                  var chart = c3.generate({
                                  bindto: '#chart',
                                    data: {x: 'x',
                                    columns: [x_data,y_data],
                                    type: 'scatter'},
                                  legend: {show: false},
                                  axis: {x: {
                                      label: {
                                      text: x_value,
                                      position: 'outer-center'}
                                    },y: {
                                      label: {
                                      text: y_value,
                                      position: 'outer-middle'}
                                    }
                                  }})}


	    })
	    }});

  myViewModel.variables[1].col_name.subscribe(
                 function(newValue) {
		     if (newValue != "Select One"){
		     //TODO: check if data is already in dictionary
			//Else add it to the data items
			var tempstring = "http://beacon-center.org/datanuggets/nuggets/"+myViewModel.datasets[0].col_name()+"/"+newValue+".json";
			$.getJSON(tempstring, function(data){
			  y_value = newValue;
			  y_data = ['y'];
		
			  for (i=0; i<data.length; i++){
				y_data.push(parseInt(data[i]));
				if (myViewModel.data()[i]){
                                     myViewModel.data()[i][newValue]=parseInt(data[i]);
                                  } else {
                                    myViewModel.data().push({newValue:parseInt(data[i])})
                                  }
			  }myViewModel.data.valueHasMutated()
			       myViewModel.currentColumns = [{headerText:myViewModel.variables[0].col_name(),rowText:function(item) {return item[myViewModel.variables[0].col_name()]}},{headerText:newValue,rowText:function(item) {return item[newValue]}}]
				       if(x_value){
                          var chart = c3.generate({bindto: '#chart',
                                    data: {x: 'x',
                                    columns: [x_data,y_data],
                                    type: 'scatter'},
                                  legend: {show: false},
                                  axis: {x: {
                                      label: {
                                      text: x_value,
                                      position: 'outer-center'}
                                    },y: {
                                      label: {
                                      text: y_value,
                                      position: 'outer-middle'}
                                    }
                                  }})}
			    })
			    }});




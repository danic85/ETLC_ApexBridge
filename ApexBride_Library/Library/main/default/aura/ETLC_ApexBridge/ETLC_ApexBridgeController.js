/*
	This is how you would call this method...
    <c:ETLC_ApexBridge aura:id="ApexBridge" />
    var apexBridge = component.find("ApexBridge");
	apexBridge.callApex({
        component: component, // Do not change this.
        request: {
            controller: "KCMLC_Instructor",  	// This is the name of the Apex class
            method: "FindInstructor",           // This is the name of the operation(related to a method in that class)
            input: {
                data1: value1,				    // You can pass data if needed
                data2: value2,			    	// 		including several parameters
                data3: value3,			    	// 		just put one at a time ;-)
            },
            createSavePoint: false,			    	// Optionally prevents a transaction (Save Point)
            records: [aRecord],			    	// Optionally if you want to perform a DML operation on records you can pass them as list of records.
            setStorable: false			    	// Do you want to force a data refresh?
            setBackground: false			    // Do you want the call to be made as a background process?
        }
        callBackMethod: function (data) {
        								    	// This is the call back function that will handle the response.
        },
        callBackError: function (serverResponse, errorMsg) {
        								    	// This is the call back function that will handle the errors.
        }
    });
*/
({
    callApex : function(component, event, helper) {
        var params = event.getParam('arguments');
        if (params && params[0]) {
            helper.callServer(component, helper, params[0]);
        } else {
            throw new Error("No arguments passed!");
        }
    }
})
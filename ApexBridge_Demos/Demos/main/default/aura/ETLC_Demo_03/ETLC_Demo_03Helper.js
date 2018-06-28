({
    findAccounts: function (component, helper) {
        var apexBridge = component.find("ApexBridge");
        apexBridge.callApex({
            component: component,
            request: {
                controller: "ETLC_DEMO_03",
                method: "findAccounts",
                input: {
                    howMany: 5,
                    offset: 0,
                    orderBy: 'Name'
                }
            },
            callBackMethod: function (response) {
                component.set("v.accounts", response.output);
            }
        });
    },
    saveAccounts: function (component, helper) {
        var apexBridge = component.find("ApexBridge");
        apexBridge.callApex({
            component: component,
            request: {
                controller: "ETLC_DEMO_03",
                method: "saveAccounts",
                records: component.get("v.accounts")
            },
            callBackMethod: function (response) {
                helper.findAccounts(component, helper);
            }
        });
    }
})
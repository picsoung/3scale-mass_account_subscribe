'use strict';

var Q = require("q")
var request = Q.denodeify(require("request"));
var _ = require("underscore")

var ACCESS_TOKEN = "YOUR_ACCESS_TOKEN";
var API_URL = "https://YOUR_THREESCALE_TENANT-admin.3scale.net/admin/api";
var SERVICE_PLAN_ID = "YOUR_SERVICE_PLAN_ID"

getAccounts().then(function(results){
  return _.pluck(_.pluck(results,'account'),'id')
}).then(function(ids_array){
  var promises = [];
  for (var i =0; i<ids_array.length;i++) {
    promises.push(subscribeAccountToPlan(ids_array[i])); // push the Promises to our array
  }
  return Q.all(promises);
}).then(function(arr){
  console.log("AAA",arr)
  console.log("DONE :)")
})

function getAccounts() {
  var url = API_URL+"/accounts.json";
  url += "?access_token="+ACCESS_TOKEN
  url += "&page=1&per_page=500";

  var options = {
    method: 'GET',
    url: url,
  }

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on creating Method: " + JSON.stringify(body.errors)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors));
    } else {
      return body.accounts;
    }
  });
}

function subscribeAccountToPlan(account_id){
  var url = API_URL+"/accounts/"+account_id+"/service_plans/"+SERVICE_PLAN_ID+"/buy.json";
  url += "?access_token="+ACCESS_TOKEN

  var options = {
    method: 'POST',
    url: url,
  }

  var response = request(options);
  return response.then(function (r) {
    var res  = r[0].req.res;
    var body = JSON.parse(r[0].body);
    if (res.statusCode >= 300) {
      cli.error({message:"ERROR encountered on creating Method: " + JSON.stringify(body.errors)});
      throw new Error("Server responded with status code " + r[0].statusCode + " "+JSON.stringify(body.errors));
    } else {
      return body.service_plan;
    }
  });
}

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

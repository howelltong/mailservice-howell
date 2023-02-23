// //jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"));

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.post("/", function (req, res) {

  const listId = process.env.LIST_ID;
  const subscribingUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  };

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });

      console.log(
        `Successfully added contact as an audience member. The contact's id is ${response.id}.`
      );

      res.sendFile(__dirname + "/success.html");
    } catch (e) {
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();
})

app.post("/failure", function (req, res) {
  res.redirect("/");
})

app.listen(3000, function () {
  console.log("Server is running on port 3000")
});
// //Audience ID: a6f55a5b29

const express = require("express");
const app = express();

app.set("views", '.');
app.set("view engine", "pug");

app.get('/', function(req, res)
{
	var fillins =
	{
		name: "Rockwell Baptist Church",
		streetName: "1203 New Hope Dr.",
		city: "Nashville",
		zipCode: "37215",
		denomination: "Southern Baptist",
		pastors: ["Philip Strymon", "Joe Bobrick"],
		serviceTimes: ["Sunday - 11:00 AM", "Wednesday - 7:00 PM"],
		description: ["TODO"],
		imgSrc: "nowhere.jpg"
	};
	res.render("test.pug", fillins);
});

app.listen(3000, function(){console.log("Listening...");});
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const app = express();

//to use local css and img files if added
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

// to send the html page on the server
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/signup.html');
});

// to retrieve the data entered by user
app.post('/', function (req, res) {
  // changed every var to const because never going to change the variables
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = 'https://us13.api.mailchimp.com/3.0/lists/1b692471b8';
  const options = {
    method: 'POST',
    auth: 'nafis1:e29bba52d7c3c47ea7eaf1b3734e5573-us13',
  };
  console.log(firstName, lastName, email);

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
      // res.send('There was an Error, Please try again.');
    }
    response.on('data', function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

// For Error route
app.post('/failure', function (req, res) {
  res.redirect('/');
});

// To establish the server at port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('The server is running at port 3000');
});

// APiKey
// e29bba52d7c3c47ea7eaf1b3734e5573-us13

// List/ audience id
// 1b692471b8

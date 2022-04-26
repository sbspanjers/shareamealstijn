const express = require('express');
const app = express();
const port = process.env.port || 3000;
const bodyParser = require('body-parser');
const req = require('express/lib/request');

app.use(bodyParser.json());

let mealDatabase = [];
let mealId = 0;

let userDatabase = [];
let userId = 0;

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    result: 'Hellooo World!',
  });
});

app.all('*', (req, res, next) => {
  const method = req.method;
  console.log(`Methode ${method} aangeroepen`);
  next();
});

// meal
app.post('/api/meal', (req, res) => {
  let meal = req.body;
  console.log(meal);
  mealId++;
  meal = {
    id: mealId,
    ...meal,
  };

  mealDatabase.push(meal);
  console.log(mealDatabase);
  res.status(201).json({
    status: 201,
    result: meal,
  });
});

app.get('/api/meal', (req, res) => {
  res.status(200).json({
    status: 200,
    result: mealDatabase,
  });
});

app.get('/api/meal/:mealId', (req, res) => {
  const mealId = req.params.mealId;
  let meal = mealDatabase.filter((item) => item.id == mealId);

  if (meal.length > 0) {
    console.log(meal);
    res.status(200).json({
      status: 200,
      result: meal,
    });
  } else {
    res.status(404).json({
      status: 404,
      result: `Meal with ID ${mealId} not found`,
    });
  }
});

// user
app.post('/api/user', (req, res) => {
  let user = req.body;
  if (userDatabase.filter((item) => item.email == user.email)) {
    userId++;
    user = {
      id: userId,
      firstname: user.firstname,
      lastname: user.lastname,
      street: user.street,
      city: user.city,
      emailAdress: user.emailAdress,
      phoneNumber: user.phoneNumber,
      password: user.password,
    }
    userDatabase.push(user);
    console.log(userDatabase);
    res.status(200).json({
      status: 200,
      result: user,
    });
  } else {
    res.status(404).json({
      status: 404,
      result: 'Email already in use',
    });
  }
});

app.get('/api/user', (req, res) => {
  res.status(200).json({
    status: 200,
    result: userDatabase,
  });
});

 app.get('/api/user/profile/:userId', (req, res) => {
   res.status(400).json({
     status: 404,
     result: 'Not implemented yet',
   });
 });

app.get('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;
  let user = userDatabase.filter((item) => item.id == userId);

  if (user.length > 0) {
    console.log(user);
    res.status(200).json({
      status: 201,
      result: user,
    });
  } else {
    res.status(404).json({
      status: 404,
      result: `Meal with ID ${userId} not found`,
    });
  }
});

app.put('/api/user/:userId', (req, res) => { 
  let user = req.body;
  let userIndex = userDatabase.findIndex((obj => obj.id == userId));
  userDatabase[userIndex] = {
    user: {
      id: userId,
      firstname: user.firstname,
      lastname: user.lastname,
      street: user.street,
      city: user.city,
      emailAdress: user.emailAdress,
      phoneNumber: user.phoneNumber,
      password: user.password,
    },
  };

  console.log(userDatabase);
  res.status(200).json({
    status: 200,
    result: user,
  });
});

app.delete('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  let userIndex = userDatabase.findIndex((obj => obj.id == userId));

  if (userIndex > -1) {
    userDatabase.splice(userIndex, 1);

    res.status(200).json({
      status: 200,
      result: 'User has been deleted',
    });
  } else {
    res.status(400).json({
      status: 405,
      result: 'User has not been deleted',
    });
  }
});

app.all('*', (req, res) => {
  res.status(400).json({
    status: 404,
    result: 'End-point not found',
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
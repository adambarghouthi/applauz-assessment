# applauz-assessment

## Setup
1) Clone repo on your local machine
2) ```cd``` into the project directory
3) run ```npm install``` to install dependencies
4) run ```node app.js```

The app should now be live at ```http://localhost:3000```

## Stack
- React
- Node
- Express
- JSON for DB

This is similar to MERN stack with a JSON file substituted in for MongoDB.

## Met requirements
- Node api ✔
- JSON db ✔
- Get list of users with optional query parameters ✔
- Create single or multiple users ✔
- Validation of user data done on the client ✔
- Success & error handling ✔
- API key authentication (in request headers verified by authMiddleware) ✔
- Bonus: unit tests ☓

## API documentation

| Header Parameters   |            |
|:----------|-------------:
| Authentication | ```API TOKEN```
| Content-Type | ```application/json``` |

### GET

| Query Parameters   |            |
|:----------|-------------:
| name | ```string```
| email | ```string``` |

Delimit strings with comma(s) to add more than one search term.

### POST

| Body Parameters   |            |
|:----------|-------------:
| users | ```array of user objects``` |

User object:

```bash
{
  name: 'John Doe',
  email: 'johndoe@gmail.com'
}
```

### Responses

Success:

```bash
{
  status: 'success',
  body: []
}
```

Error:

```bash
{
  status: 'error',
  message: 'Error message here'
}
```

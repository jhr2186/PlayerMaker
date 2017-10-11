const fs = require('fs');
const crypto = require('crypto');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const usersNFL = {};
const usersNBA = {};
const usersNHL = {};
const usersMLB = {};
const usersMLS = {};
const users = {
  usersNFL, usersNBA, usersNHL, usersMLB, usersMLS,
};

let etag = crypto.createHash('sha1').update(JSON.stringify(users));
let digest = etag.digest('hex');

const respond = (request, response, content, type) => {
  response.writeHead(200, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json', etag: digest });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json', etag: digest });
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  if (request.headers['if-none-match'] === digest) {
    return respondJSONMeta(request, response, 304);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => {
  if (request.headers['if-none-match'] === digest) {
    return respondJSONMeta(request, response, 304);
  }

  return respondJSONMeta(request, response, 200);
};

const addNFLPlayer = (body) => {
  usersNFL[body.name].name = body.name;
  usersNFL[body.name].age = body.age;
  usersNFL[body.name].height = body.height;
  usersNFL[body.name].weight = body.weight;
  usersNFL[body.name].speed = body.speed;
  usersNFL[body.name].strength = body.strength;
  usersNFL[body.name].iq = body.iq;
};

const addNHLPlayer = (body) => {
  usersNHL[body.name].name = body.name;
  usersNHL[body.name].age = body.age;
  usersNHL[body.name].height = body.height;
  usersNHL[body.name].weight = body.weight;
  usersNHL[body.name].speed = body.speed;
  usersNHL[body.name].strength = body.strength;
  usersNHL[body.name].iq = body.iq;
};

const addNBAPlayer = (body) => {
  usersNBA[body.name].name = body.name;
  usersNBA[body.name].age = body.age;
  usersNBA[body.name].height = body.height;
  usersNBA[body.name].weight = body.weight;
  usersNBA[body.name].speed = body.speed;
  usersNBA[body.name].strength = body.strength;
  usersNBA[body.name].iq = body.iq;
};

const addMLBPlayer = (body) => {
  usersMLB[body.name].name = body.name;
  usersMLB[body.name].age = body.age;
  usersMLB[body.name].height = body.height;
  usersMLB[body.name].weight = body.weight;
  usersMLB[body.name].speed = body.speed;
  usersMLB[body.name].strength = body.strength;
  usersMLB[body.name].iq = body.iq;
};

const addMLSPlayer = (body) => {
  usersMLS[body.name].name = body.name;
  usersMLS[body.name].age = body.age;
  usersMLS[body.name].height = body.height;
  usersMLS[body.name].weight = body.weight;
  usersMLS[body.name].speed = body.speed;
  usersMLS[body.name].strength = body.strength;
  usersMLS[body.name].iq = body.iq;
};

const addPlayer = (request, response, body) => {
  const responseJSON = {
    message: 'All options must be filled with valid input',
  };

  // check to make sure all parameters have a value
  // don't need to check for sport because it always will have some kind of value
  if (!body.name || !body.age || !body.height ||
      !body.weight || !body.speed || !body.strength || !body.iq) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  switch (body.sport) {
    case 'NFL':
      if (usersNFL[body.name]) {
        responseCode = 204;
      } else {
        usersNFL[body.name] = {};
      }
      addNFLPlayer(body);
      break;
    case 'NHL':
      if (usersNHL[body.name]) {
        responseCode = 204;
      } else {
        usersNHL[body.name] = {};
      }
      addNHLPlayer(body);
      break;
    case 'NBA':
      if (usersNBA[body.name]) {
        responseCode = 204;
      } else {
        usersNBA[body.name] = {};
      }
      addNBAPlayer(body);
      break;
    case 'MLB':
      if (usersMLB[body.name]) {
        responseCode = 204;
      } else {
        usersMLB[body.name] = {};
      }
      addMLBPlayer(body);
      break;
    case 'MLS':
      if (usersMLS[body.name]) {
        responseCode = 204;
      } else {
        usersMLS[body.name] = {};
      }
      addMLSPlayer(body);
      break;
    default:
      break;
  }

  etag = crypto.createHash('sha1').update(JSON.stringify(users));
  digest = etag.digest('hex');

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

const getIndex = (request, response) => {
  respond(request, response, index, 'text/html');
};

const getCSS = (request, response) => {
  respond(request, response, css, 'text/css');
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  getIndex,
  getCSS,
  getUsers,
  addPlayer,
  getUsersMeta,
  notFound,
  notFoundMeta,
};

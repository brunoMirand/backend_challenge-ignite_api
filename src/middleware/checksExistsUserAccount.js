const users = require('../service/usersService');

const checksExistsUserAccount = (request, response, next) => {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);
  if (!user) {
    return response.status(400).json({
      message: "Username not found"
    });
  }

  request.user = user;
  next();
}

module.exports = checksExistsUserAccount;

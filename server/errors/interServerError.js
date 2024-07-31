const CustomError = require("./customError");

class InterServerError extends CustomError {
  statusCode = 500;
  constructor(message = "Internal server error") {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, InterServerError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

module.exports = InterServerError;

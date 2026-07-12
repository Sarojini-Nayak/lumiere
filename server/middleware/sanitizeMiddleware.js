// Strips MongoDB operator keys ($gt, $ne, etc.) and dotted keys from
// incoming request data, to prevent NoSQL injection via query objects
// (e.g. { "email": { "$gt": "" } } instead of a real email string).
//
// Mutates objects in place rather than reassigning req.body/req.query/req.params,
// since Express 5 makes req.query a getter-only property (reassigning it throws).
const sanitizeValue = (obj) => {
  if (obj && typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else {
        sanitizeValue(obj[key]);
      }
    }
  }
  return obj;
};

const sanitizeMiddleware = (req, res, next) => {
  if (req.body) sanitizeValue(req.body);
  if (req.params) sanitizeValue(req.params);
  if (req.query) sanitizeValue(req.query);
  next();
};

export default sanitizeMiddleware;

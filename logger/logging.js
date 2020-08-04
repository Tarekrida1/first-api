// middlewres
function log1(req, res, next) {
  console.log("ok go to next func");
  next();
}

function log2(req, res, next) {
  console.log(req.headers.host);
  next();
}

module.exports = {
    log1,
    log2
};
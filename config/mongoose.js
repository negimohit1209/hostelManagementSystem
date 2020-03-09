var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost:27017/HostelManagementSystem", { useNewUrlParser: true });

mongoose.connect(
  "mongodb://negimohit1209:negimohit1209@ds131989.mlab.com:31989/hostel",
  { useNewUrlParser: true }
);

module.exports = {
  mongoose
};

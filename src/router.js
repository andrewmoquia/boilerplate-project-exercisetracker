const Router = require("express");
const {
  createUser,
  createExercise,
  getUsers,
  getAllLogs,
} = require("./controller.js");

const router = Router();

router.post("/api/users", createUser);

router.post("/api/users/:_id/exercises", createExercise);

router.get("/api/users", getUsers);

router.get("/api/users/:id/logs", getAllLogs);

module.exports = router;

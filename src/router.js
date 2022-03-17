const Router = require("express");
const { createUser, createExercise, getUsers } = require("./controller.js");

const router = Router();

router.post("/api/users", createUser);

router.post("/api/users/:_id/exercises", createExercise);

router.get("/api/users", getUsers);

module.exports = router;

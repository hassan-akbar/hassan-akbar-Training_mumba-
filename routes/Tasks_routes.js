const express = require("express");

const upload = require("../middleware/multer.middleware");

const task_controller = require("../controllers/tasks_controller");
const AuthenticationMiddleware =
  require("../middleware/authentication.middleware").VerifyToken;
const { authenticate } = require("passport");

const router = express.Router();

//for parsing sent data
router.use(express.json());

router.get("/", (req, res) => {
  res.status(200).send("hello this is the route page");
});

//route to create a task
router.post("/create_task", task_controller.CreateTask);

//route to upload an attachment after creating a task
router.patch(
  "/upload_attachment/:task_id",
  upload.upload,
  task_controller.UploadAttachment
);

//route to retrive all the task
router.get("/get_tasks", task_controller.GetAllTasks);

//route to update task info , attachment can be uploaded via the upload attachment route
router.patch(
  "/update_task_status",
  AuthenticationMiddleware,
  task_controller.UpdateTaskStatus
);

//to download an attachment
router.get(
  "/attachments/download_attachment/:task_id",
  AuthenticationMiddleware,
  task_controller.DownloadAttachment
);
// route to delete a task based on the task id
router.delete("/delete_task/:id", task_controller.DeleteTask);

module.exports = router;

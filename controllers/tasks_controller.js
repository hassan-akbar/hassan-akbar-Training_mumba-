const Task_services = require("../services/task_crud.services");

const err_handler = (err) => {
  console.log(`Error : ${err}`);
};

module.exports.CreateTask = async (req, res, next) => {
  /**
   *
   *Creates a task with an empty string for the attachment portion
   *Attachment must be uploaded on a seperate route
   *response sends back the task id , the front end may call upon the response to call the upload route next
   */
  const Task_info = await req.body;

  await Task_services.Create_Task(Task_info).then((result_confirmation) => {
    if (result_confirmation) {
      res
        .status(200)
        .send(
          `Task succesfully created with task id ${result_confirmation.id}`
        );
      next();
    } else if (result_confirmation === "TaskOverflowError") {
      res
        .status(400)
        .send(
          "TaskOverflow:Cannot create more than 50 tasks please delete tasks to make room"
        );
    } else {
      res.status(400).send("Unsucesfull task insertion");
    }
  });
};

module.exports.UploadAttachment = async (req, res, next) => {
  const attachment_info = await req.file;
  const task_id = await req.params.task_id;

  await Task_services.Upload_Attachment(task_id, attachment_info)
    .then((result_confirmation) => {
      if (result_confirmation) {
        res.send("Succesfully Uploaded Image");
      } else {
        res.status(400).send("Unsuccesful image insertion");
      }
    })
    .catch(err_handler);
};

module.exports.GetAllTasks = async (req, res) => {
  const all_tasks = await Task_services.Show_All_Tasks()
    .then((data) => {
      return data;
    })
    .catch(err_handler);

  res.status(200).send(all_tasks);
};

module.exports.UpdateTaskStatus = async (req, res, next) => {
  /**
   *  Updates the user task status
   * Requires jwt authetnitcation and gets the decoded information to verify updations
   */
  const task_info = req.body;
  const user_info = req.user;
  console.log(task_info);

  await Task_services.Update_Task_Status(task_info, user_info)
    .then((update_response) => {
      if (update_response == 1) {
        res.status(200).send("successful status update");
        return;
      } else if (update_response == "Permission Error") {
        res.status(401).send("Invalid permissions to Alter this users data");
      } else {
        res.status(400).send("unsucessful update");
        return;
      }
    })
    .catch(err_handler);

  // next();
};

module.exports.DownloadAttachment = async (req, res) => {
  task_id = req.params.task_id;

  await Task_services.Download_Task_Attachment(task_id).then(
    (file_response) => {
      if (file_response) {
        res.download(file_response);
      } else {
        res.status(403);
      }
    }
  );
};

module.exports.GetSimilarTasks = async (req, res) => {
  task_id = req.params.id;
  await Task_services.Show_Similar_Tasks(task_id).then((similar_tasks) => {
    if (similar_tasks) {
      res.status(200).send(similar_tasks);
    } else {
      res.status(400).send("no similar tasks");
    }
  });
};

module.exports.DeleteTask = async (req, res) => {
  task_id = req.params.id;

  await Task_services.Delete_Task(task_id).then((delete_response) => {
    if (delete_response) {
      res.status(200).send("Succesfully deleted");
    } else {
      res.status(400).send("Unsuccesful deletion");
    }
  });
};

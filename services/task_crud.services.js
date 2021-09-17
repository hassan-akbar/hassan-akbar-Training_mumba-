const Tasks = require("../models/index_models").Tasks;
const Users = require("../models/index_models").Users;
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { captureRejectionSymbol } = require("events");
const err_handler = (err) => {
  console.log(`Error : ${err}`);
};

module.exports.Create_Task = async (task_info) => {
  /**
   * creates a new task
   * checks if the user id has over 50 tasks within the database
   * if yes returns a task overflow error
   *
   *
   */

  const valid_insertion = await Tasks.count({
    where: { user_id: task_info.user_id },
  })
    .then((count) => {
      if (count < 50) {
        return true;
      }
      return "TaskOverflowError";
    })
    .catch(err_handler);

  if (valid_insertion) {
    const task_creation = await Tasks.create({
      title: task_info.title,
      description: task_info.description,
      attachment: "",
      creation_date_time: task_info.creation_date_time,
      due_date_time: task_info.due_date_time,
      completed_task: 0,
      task_status: "pending",
      user_id: task_info.user_id,
    })
      .then((valid_response) => {
        return valid_response.toJSON();
      })
      .catch(err_handler);

    return task_creation;
  }
};

module.exports.Upload_Attachment = async (task_id, image_info) => {
  /**
   *
   * Updates uploaded image info in the table
   * Deletes the old attachment on the server before updating table info
   *
   */
  const attachment_info = await Tasks.findOne({
    attributes: ["attachment"],
    where: { id: task_id },
  });

  try {
    if (attachment_info != "") {
      fs.unlinkSync("./database/images/" + attachment_info.attachment);
    }
  } catch (err) {
    err_handler(err);
  }
  const task_attachment = await Tasks.update(
    {
      attachment: image_info.filename,
    },
    { where: { id: task_id } }
  )
    .then((query_response) => {
      return query_response;
    })
    .catch(err_handler);

  return task_attachment;
};

module.exports.Show_All_Tasks = async () => {
  all_task_info = await Tasks.findAll()
    .then((data) => {
      return data;
    })
    .catch(err_handler);
  return all_task_info;
};

module.exports.Update_Task_Status = async (task_info, user_info) => {
  /**
   *Updates tasks status
   *Does not cater for images as the route for uploading images is entirely different
   *Hence if user passes an attachment on this route it is not catered for
   */
  task_id = task_info.id;

  //deleting since using task_info for update query
  delete task_info.id;
  delete task_info.attachment;

  console.log(task_info);

  /**
   * This is a left outer join
   * Returns all the enteries coresponding to tasks where the task id is equal to the id provided in the request
   * and the user email which is unique also corresponds to the jwt authenticated email to allow users to only alter
   * their tasks
   */
  const query_task = await Tasks.findOne({
    where: { id: task_id },
    include: [
      {
        model: Users,
        as: "Users",
        attributes: [],
        where: { email: user_info.email },
      },
    ],
  })
    .then((query_response) => {
      return query_response;
    })
    .catch(err_handler);

  //-------------------------------------------------------------------------------------------------------------------------

  if (query_task) {
    // if the join result is true i.e(Data exists in the DB) then update the user based on the request
    requested_task_status = await Tasks.update(task_info, {
      where: { id: task_id },
    })
      .then((query_response) => {
        return query_response;
      })
      .catch(err_handler);
    if (requested_task_status) {
      return requested_task_status;
    } else {
      return false;
    }
  } else {
    //else the user doesnt have permissions to update another users info as the id is matched with the curernt user id
    return "Permission Error";
  }
};

module.exports.Download_Task_Attachment = async (task_id) => {
  const task_query = await Tasks.findOne({
    where: { id: task_id },
  })
    .then((query_response) => {
      return query_response;
    })
    .catch(err_handler);

  attachment_info = task_query.attachment;

  if (attachment_info) {
    return "./database/images/" + attachment_info;
  } else {
    return false;
  }
};

module.exports.Delete_Task = async (task_id) => {
  deleted_task_status = await Tasks.destroy({ where: { id: task_id } })
    .then((query_response) => {
      return query_response;
    })
    .catch(err_handler);

  return deleted_task_status;
};

#!/usr/bin/env node
//aws/Scheduler.js

/*
 * README!
 *
 * About:
 * 1. This script reads objects from Schedules.json file
 * 2. and Creates/Updates/Deletes EventBridge Schedules
 *
 * Set Up:
 * 0. Copy-Paste 'aws-scheduler' folder in your project (contains package.json and scripts)
 * 1. Run the following in terminal:
 * a. cd ./aws-scheduler # Move terminal context to folder
 * b. aws login
 * c. npm install # installs the "@aws-sdk/client-scheduler" package
 *
 * Usage (Node):
 * 1. node Scheduler.js schedules.json #Create Schedule
 * 2. node Scheduler.js schedules.json delete #Delete schedule
 *
 * Usage (npm)
 * 1. npm run schedule
 * 2. npm run delete-schedule
 *
 */

import fs from "fs";
import path from "path";
import {
  SchedulerClient,
  CreateScheduleCommand,
  UpdateScheduleCommand,
  DeleteScheduleCommand,
  CreateScheduleGroupCommand,
} from "@aws-sdk/client-scheduler";

const region = "us-east-1";

const client = new SchedulerClient({ region });

// Error handler
function usageAndExit() {
  console.error("Usage: node Scheduler.js <Schedules.json> <?delete>");
  process.exit(1);
}

// Newlines for Formatting; Used in console logs
const lineBreak = "\n____\n\n";

// Delete Schedule function
async function deleteSchedule(schedule) {
  // 'Name' and 'GroupName' are required to delete schedule
  try {
    const deleteResp = await client.send(new DeleteScheduleCommand(schedule));
    return deleteResp;
  } catch (e) {
    throw new Error("Error in deleteSchedule: ", e);
  }
}

async function createOrUpdateSchedule(schedule) {
  const { TargetArn, RoleArn, Input, ...rest } = schedule;
  const { Name, ScheduleExpression, GroupName } = rest;

  // RoleArn is the role the Scheduler assumes: should have Policy action 'Lambda.InvokeFunction';

  if (!Name || !ScheduleExpression || !TargetArn || !RoleArn)
    throw new Error(
      `Schedule entry missing required fields (name, scheduleExpression, targetArn, RoleArn): ${schedule}`,
    );

  const Target = { Arn: TargetArn, RoleArn };

  // Add stringified Input object; Accessible in Lambda as '{InputKey : InputValue}'
  if (Input)
    Target.Input = typeof Input == "string" ? Input : JSON.stringify(Input);

  //Set Schedule group Otherwise 'default' is used;
  if (GroupName) Target.GroupName = GroupName;

  // Create schedule group if not exists
  try {
    const groupCmd = new CreateScheduleGroupCommand({
      Name: "MyScheduleGroup",
    });
    await client.send(groupCmd);
  } catch (e) {
    console.error(
      `Create scheduleGroup failed, It probably exists: \n Error: \n ${e} ${lineBreak}`,
    );
  }

  // 1) ScheduleParams: An object which has a Target object property.
  const scheduleParams = {
    Name,
    ScheduleExpression,
    State: "ENABLED",
    FlexibleTimeWindow: { Mode: "OFF" },
    Target,
    GroupName,
  };

  console.log(
    `Creating/Updating rule "${Name}" with expression "${ScheduleExpression}" ${lineBreak}`,
  );

  // Create or update the schedule; CreateScheduleCommand initialises the schedule for creation?
  const createScheduleCmd = new CreateScheduleCommand(scheduleParams);

  let createScheduleResp;
  let updateScheduleResp;

  try {
    createScheduleResp = await client.send(createScheduleCmd);
  } catch (e) {
    console.error(
      `Error Creating schedule, will try Updating: \n ${e} ${lineBreak}`,
    );

    const updateScheduleCommand = new UpdateScheduleCommand(scheduleParams);
    try {
      updateScheduleResp = await client.send(updateScheduleCommand);
    } catch (e) {
      throw new Error(`Error Updating Schedule: \n ${e} ${lineBreak}`);
    }
  }

  if (createScheduleResp)
    console.log(
      `Created Schedule for "${Name}" :\n`,
      createScheduleResp,
      `${lineBreak}`,
    );
  else
    console.log(
      `Updated Schedule for "${Name}" :\n`,
      updateScheduleResp,
      `${lineBreak}`,
    );

  console.log(
    `Successfully created/updated schedule "${Name}" and attached target. ${lineBreak}`,
  );

  return {
    createScheduleResp,
    updateScheduleResp,
  };
}

async function main() {
  // Search command params for potential "delete" option;

  const [schedules_script, delete_option] = process.argv.slice(2);
  if (!schedules_script) usageAndExit();

  console.log(
    `Scheduler script : \n ${{ schedules_script, delete_option }} ${lineBreak}`,
  );
  const isDelete = delete_option == "delete";
  const filePath = path.resolve(process.cwd(), schedules_script);

  console.log(`Reading schedules from file: ${filePath}`, lineBreak);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `'Schedules' json file not found: ${filePath} ${lineBreak}`,
    );
  }

  let schedules;
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    console.log(`Schedules file content: \n ${fileContent} ${lineBreak}`);

    schedules = JSON.parse(fileContent);
    if (!Array.isArray(schedules))
      throw new Error(
        `'Schedules' json file must be an array of schedule objects`,
      );
  } catch (e) {
    throw new Error(`Error parsing schedules file: \n ${e}`);
  }

  if (isDelete) {
    // Deletes only first schedule in array
    const deleteResp = await deleteSchedule(schedules[0]);
    console.log("Schedule deleted: \n", deleteResp);
    return;
  }

  for (const schedule of schedules) {
    try {
      const res = await createOrUpdateSchedule(schedule);
      console.log("Schedule Created/Updated: \n", res);
    } catch (e) {
      console.error(
        `Error Creating/Updating schedule "${schedule.Name}" ${e} ${lineBreak}`,
      );
    }
  }

  console.log("All schedules processed.");
}

main().catch((e) => {
  console.error("Fatal error: \n", e);
  usageAndExit();
});

// aws/Create-Role-Policy.js

/*
 * About:
 * This script lets you create a scheduler role invoking a lambda function
 *
 * To Set up:
 * 1. npm init -y
 * 2. In package.json:
 * a. change type to module
 * 3. in terminal run `npm i @aws-sdk/client-iam`
 *
 * Usage (node):
 * 1. node Create-Role-Policy.js
 * 2. node Create-Role-Policy.js delete #to delete the role and policy
 *
 * Usage (npm):
 * 0. Place in package.json "scripts": "Create-Role-Policy": "node Create-Role-Policy.js"
 * 0. Place in package.json "scripts": "Delete-Role-Policy": "node Create-Role-Policy.js delete"
 * 1. npm run Create-Role-Policy
 * 2. npm run Delete-Role-Policy
 */

import {
  IAMClient,
  CreateRoleCommand,
  CreatePolicyCommand,
  AttachRolePolicyCommand,
  DetachRolePolicyCommand,
  DeletePolicyCommand,
  DeleteRoleCommand,
} from "@aws-sdk/client-iam";

const REGION = process.env.REGION || "us-east-1";

const iamClient = new IAMClient({ region: REGION });

async function createRoleAndPolicy() {
  // Define a role for the Scheduler resource
  const role = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          Service: "scheduler.amazonaws.com",
        },
        Action: "sts:AssumeRole",
      },
    ],
  };

  // Send the Create-Role request
  const roleResp = await iamClient.send(
    new CreateRoleCommand({
      RoleName: "Scheduler-Exec-Role",
      AssumeRolePolicyDocument: JSON.stringify(role),
    }),
  );

  console.log("Role Created \n", {
    roleArn: roleResp.Role.Arn,
    roleName: roleResp.Role.RoleName,
  });

  // Policies define the access permissions (to other resources) you'd assign to the role;
  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: "lambda:InvokeFunction",
        Resource: "arn:aws:lambda:us-east-1:1234567890:function:Lambda-Shooter",
      },
    ],
  };

  const policyResp = await iamClient.send(
    new CreatePolicyCommand({
      PolicyName: "Scheduler-Shooter-Policy",
      PolicyDocument: JSON.stringify(policy),
    }),
  );

  console.log("Policy Created \n", {
    policyArn: policyResp.Policy.Arn,
    policyName: policyResp.Policy.PolicyName,
  });

  // Attach policy to role
  const attachResp = await iamClient.send(
    new AttachRolePolicyCommand({
      RoleName: "Scheduler-Exec-Role",
      PolicyArn: policyResp.Policy.Arn,
    }),
  );

  console.log("Policy attached to role: \n", attachResp);
}

// Delete Role and Policy: Try this if an error occurs during creation.
async function deleteRoleAndPolicy() {
  const client = new IAMClient({ region: "us-east-1" });

  try {
    const detachRoleResp = await client.send(
      new DetachRolePolicyCommand({
        RoleName: "Scheduler-Exec-Role",
        PolicyArn: "arn:aws:iam::1234567890:policy/Scheduler-Shooter-Policy",
      }),
    );
    console.log(
      "Detach-Role Success! Running Delete Policy next; Response: \n\n",
      detachRoleResp,
      "\n\n",
    );
  } catch (e) {
    console.error(
      `Detach-Role failed. It may not exist. will run Delete Policy next; Error: \n ${e} \n\n...`,
    );
  }

  try {
    const deletePolicyResp = await client.send(
      new DeletePolicyCommand({
        PolicyArn: "arn:aws:iam::1234567890:policy/Scheduler-Shooter-Policy",
      }),
    );
    console.log(
      "Delete Policy Success; Response: \n\n",
      deletePolicyResp,
      "\n\n",
    );
  } catch (e) {
    console.error(
      `Delete Policy failed. Policy may not exist. will run Delete Role next; Error: \n ${e} \n\n...`,
    );
  }

  try {
    const deleteRoleResp = await client.send(
      new DeleteRoleCommand({
        RoleName: "Scheduler-Exec-Role",
      }),
    );
    console.log("Delete-Role Success; Response: \n\n", deleteRoleResp, "\n\n");
  } catch (e) {
    console.error(
      `Delete-Role failed. Role may not exist. Error: \n ${e} \n\n...`,
    );
  }
}

async function main() {
  //get command args and cut out the node and script-name part;
  const args = process.argv.slice(2);

  if (args[0] == "delete") deleteRoleAndPolicy();
  else createRoleAndPolicy();
}

main().catch((e) =>
  console.error("Failed to create Role and Policy; Error: \n", e),
);

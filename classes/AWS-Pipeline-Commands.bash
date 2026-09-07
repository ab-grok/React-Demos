#*. Originally for a Scheduled lambda workflow, But contains useful CLI commands for Lambda, Rules (schedules), Roles, Bucket, and AWS account. 

#1. Scheduled Lambda Workflow (Manual):
#a. Execution role is created (returns RoleARN) > then policy is created (create-policy) (returns PolicyARN) > then policy is attached to the role (attach-role-policy)
#b. Then EventBridge rule is created (put-rule) > then target is added to the rule (put-targets) with the lambda and roleArn.
#b. Then EventBridge Scheduler is created (create-schedule) fitted with LambdaARN and RoleArn.

# -----> AWS Managed Policies and Service Principals
# What are AWS Managed Policies? AWS Managed Policies are files which contain access permissions to resources; 
# What is a Service Principal? A Service Principal is the aws resource that is allowed to assume a role. For example, a Lambda function can assume a role with a Service Principal "lambda.amazonaws.com". (roles then have policies attached to them);

# -----> AWS Managed Policies and Service Principals Lists
#*. Managed Policies list (aws policies): https://docs.aws.amazon.com/aws-managed-policy/latest/reference/policy-list.html
#*. Service Principals list (aws resources): https://docs.aws.amazon.com/service-authorization/latest/reference/reference_policies_actions-resources-contextkeys.html

# -----> Set up AWS Credentials / Allowing editor access to AWS account
aws login --region eu-north-1
aws configure set region eu-north-1
aws configure list #lists the current configuration settings for AWS CLI, including the access key, secret key, default region.

# ----> s3 bucket commands
aws s3 mb s3://<bucket-name> --region us-east-1 #create bucket
aws s3 rb s3://<bucket-name> --force #Delete bucket
aws s3 lb #List buckets;

# -----> EventBridge Create Command  
aws events put-rule \
  --name Every10Minutes \
  --schedule-expression "cron(0/10 * * * ? *)" \
  --state ENABLED;

#EventBridge Rule add Target resource (Can be resources other than Lambdas);
aws events put-targets \
  --rule Every10Minutes \
  --targets "Id"="MyLambdaTarget","Arn"="<Lambda ARN>";

#EventBridge rule Delete pipeline
aws events list-targets-by-rule --rule "<rule-name>" #list targets for the rule; They must be removed before the rule can be deleted. 
aws events remove-targets --rule "<rule-name>" --ids "<MyLambdaTarget>" #remove target from the rule;
aws events remove-targets --rule "Every-Ten-Minutes" --ids "Target0" 
aws events delete-rule --name "<rule-name>" # delete the rule; 
aws events delete-rule --name "Every-Ten-Minutes" # delete the rule; 

#-----> EventBridge Scheduler Create Command: (Alternative to EventBridge Rule) [Option B]
aws scheduler create-schedule \
  --name <cron> \ 
  --schedule-expression "cron(0/10 * * * ? *)" \
  --schedule-expression-timezone "UTC" \
  --flexible-time-window Mode=OFF \
  --target '{
    "Arn":"<Lambda_ARN>",   
    "RoleArn":"arn:aws:iam::123456789012:role/SchedulerExecutionRole", 
  }'

#EventBridge Scheduler Delete Command
aws scheduler delete-schedule --name <cron>

#Custom Scheduler Script (Aws Scheduler API) [Option C]
node EventBridge-Scheduler.js schedules.json #create schedules from schedules.json file
node EventBridge-Scheduler.js schedules.json delete  #delte schedules from schedules.json file

# ------> Lambda function create command
zip lambda.zip Lambda-Shooter.js node_modules/* # create zip of function and node_modules
aws lambda create-function \
  --function-name <name> \
  --runtime nodejs20.x \
  --role arn:aws:iam::123456789012:role/LambdaExecutionRole \
  --handler <lambda_file_name>.handler \
  --zip-file fileb://<lambda_folder>.zip

# Setting Lambda env vars
aws lambda update-function-configuration \
  --function-name <name> \
  --environment "Variables={MY_SECRET=abc123,API_KEY=xyz789}"

#tail lambda logs
aws logs tail /aws/lambda/<name> --follow --since 30m # --region eu-north-1 #required if different from login region

# -------> AWS CDK Deployment Pipeline (Alternative to cli lambda + rule create workflow);
cdk init app --language javascript #creates necessary CDK files and folders;
npx aws-cdk bootstrap # To be run once per AWS account/region; Sets up cdk resources
npx aws-cdk deploy # Deploys the CDK stack;
npx aws-cdk destroy # deletes the deployed stack + upload cache 

# ----------> List and Delete log groups (Useful on deploy fail from existing log group)
aws logs describe-log-groups #List all log groups (relevant group will have same name as specified in logGroupName )
aws logs delete-log-group --log-group-name /aws/lambda/<log-group-name> #Delete log group (if exists) to allow for new log group creation on next deploy


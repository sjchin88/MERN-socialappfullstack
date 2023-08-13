#!/bin/bash

# Step 1 Get the name of ASG
ASG=$(aws autoscaling describe-auto-scaling-groups --no-paginate --output text --query "AutoScalingGroups[? Tags[? (Key=='Type') && Value=='$ENV_TYPE']]".AutoScalingGroupName)
# Then delete it
aws autoscaling delete-auto-scaling-group --auto-scaling-group-name $ASG --force-delete

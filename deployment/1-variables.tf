variable "aws_region" {
  description = "Region in which AWS resources are created"
  type        = string
  default     = "us-west-2"
}

variable "vpc_cidr_block" {
  description = "VPC CIDR Block"
  type        = string
  default     = "10.0.0.0/16"
}

#Get availability zones by typing
#aws ec2 describe-availability-zones --region <aws region> on aws cli
#example  aws ec2 describe-availability-zones --region us-west-2
variable "vpc_availability_zones" {
  description = "VPC Availability Zones"
  type        = list(string)
  default     = ["us-west-2a", "us-west-2b"]
}

variable "vpc_public_subnets" {
  description = "VPC Public Subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "vpc_private_subnets" {
  description = "VPC Private Subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "global_destination_cidr_block" {
  description = "CIDR Block for all IPs"
  type        = string
  default     = "0.0.0.0/0"
}

# Add your own ip to access the bastion host
variable "bastion_host_cidr" {
  description = "CIDR Block for Bastion Host Ingress"
  type        = string
  default     = "75.213.33.230/32" #your ip address, hide it.
}

variable "https_ssl_policy" {
  description = "HTTPS SSL Policy"
  type        = string
  default     = "ELBSecurityPolicy-2016-08"
}

#change this to something else
variable "main_api_server_domain" {
  description = "Main API Server Domain"
  type        = string
  default     = "sjchinserver.com"
}

variable "dev_api_server_domain" {
  description = "Dev API Server Domain"
  type        = string
  default     = "api.dev.sjchinserver.com"
}

variable "ec2_iam_role_name" {
  description = "EC2 IAM Role Name"
  type        = string
  default     = "sociusapp-server-ec2-role"
}

variable "ec2_iam_role_policy_name" {
  description = "EC2 IAM Role Policy Name"
  type        = string
  default     = "sociusapp-server-ec2-role-policy"
}

variable "ec2_instance_profile_name" {
  description = "EC2 Instance Profile Name"
  type        = string
  default     = "sociusapp-server-ec2-instance-profile"
}

variable "elasticache_node_type" {
  description = "Elasticache Node Type"
  type        = string
  default     = "cache.t3.micro"
}

variable "elasticache_parameter_group_name" {
  description = "Elasticache Parameter Group Name"
  type        = string
  default     = "default.redis6.x"
}

variable "ec2_instance_type" {
  description = "EC2 Instance Type"
  type        = string
  default     = "t2.micro"
}

variable "bastion_host_type" {
  description = "Bastion Instance Type"
  type        = string
  default     = "t2.micro"
}

variable "code_deploy_role_name" {
  description = "CodeDeploy IAM Role"
  type        = string
  default     = "sociusapp-server-codedeploy-role"
}

variable "prefix" {
  description = "Prefix to be added to AWS resources tags"
  type        = string
  default     = "sociusapp-server"
}

variable "project" {
  description = "Prefix to be added to AWS resources local tags"
  type        = string
  default     = "sociusapp-server"
}

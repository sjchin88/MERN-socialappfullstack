terraform {
  backend "s3" {
    bucket = "socius-app-terraform-state"
    key    = "develop/sociusapp.tfstate"
    #terraform doesnt accept variable in backend?
    region  = "us-west-2"
    encrypt = true
  }
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"
  common_tags = {
    Environment = terraform.workspace
    Project     = var.project
    ManagedBy   = "Terraform"
    Owner       = "CSJ"
  }
}


# use data to get value of already created resource
# create domain name later and come back to fill it
data "aws_route53_zone" "main" {
  name         = var.main_api_server_domain
  private_zone = false
}

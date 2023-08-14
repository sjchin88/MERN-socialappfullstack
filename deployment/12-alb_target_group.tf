resource "aws_alb_target_group" "server_backend_tg" {
  name     = "${local.prefix}-tg"
  vpc_id   = aws_vpc.main.id
  port     = 5000 # API server port
  protocol = "HTTP"
  # time required to deregister the resources when not in use
  deregistration_delay = 60
  health_check {
    path     = "/health"
    port     = "traffic-port"
    protocol = "HTTP"
    # number of consecutive health checks successes required before considering
    # an unhealthy target healthy
    healthy_threshold = 2
    # number of consecutive health check failures to consider the target unhealthy
    # permitted number between 2 and 10. we want to give allowance for the unit to start up
    # so set it to the maximum
    unhealthy_threshold = 10
    # The approximate amount of time between health checks of an individual target
    # unit in seconds
    interval = 120
    # The amount of time in seconds during which no response means a failed health check
    timeout = 100
    # Success codes - HTTP codes to use when checking for a successful response from a target
    matcher = "200"
  }

  # session to be available in AWS
  stickiness {
    type = "app_cookie"
    # need to match the cookie name of the application
    cookie_name = "session"
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-tg" })
  )
}

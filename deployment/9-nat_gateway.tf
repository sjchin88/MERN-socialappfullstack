#normally we will create one for each public subnet
#bcoz its not free, we are creating one only at this moment
resource "aws_nat_gateway" "nat_gateway" {
  allocation_id = aws_eip.elastic_ip.id
  subnet_id     = aws_subnet.public_subnet_a.id
  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-nat-gw" })
  )
}

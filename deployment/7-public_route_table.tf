resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.main.id
  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-public-RT" })
  )
}

resource "aws_route" "public_igw_route" {
  route_table_id = aws_route_table.public_route_table.id
  # we want to allow internet to and from global
  destination_cidr_block = var.global_destination_cidr_block
  gateway_id             = aws_internet_gateway.main_igw.id
  # Specify this resource to be created after
  depends_on = [aws_route_table.public_route_table]
}

resource "aws_route_table_association" "public_subnet_1_association" {
  subnet_id      = aws_subnet.public_subnet_a.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "public_subnet_2_association" {
  subnet_id      = aws_subnet.public_subnet_b.id
  route_table_id = aws_route_table.public_route_table.id
}

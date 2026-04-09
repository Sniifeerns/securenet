resource "aws_ecr_repository" "api" {
  name                 = "securenet-api"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

resource "aws_ecr_repository" "frontend" {
  name                 = "securenet-frontend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

resource "aws_ecr_repository" "gateway" {
  name                 = "securenet-gateway"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}


output "ecr_api_url" {
  value = aws_ecr_repository.api.repository_url
}
output "ecr_frontend_url" {
  value = aws_ecr_repository.frontend.repository_url
}
output "ecr_gateway_url" {
  value = aws_ecr_repository.gateway.repository_url
}
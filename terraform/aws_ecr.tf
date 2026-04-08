resource "aws_ecr_repository" "frontend-securenet" {
  name = "frontend-securenet"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "api-securenet" {
  name = "api-securenet"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
  
}
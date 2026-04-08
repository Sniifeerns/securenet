resource "aws_iam_role" "jenkins_ecr" {
  name = "jenkins-ecr-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "jenkins_ecr_policy" {
  role       = aws_iam_role.jenkins_ecr.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser"
}

resource "aws_iam_role_policy_attachment" "jenkins_ec2_readonly" {
    role       = aws_iam_role.jenkins_role.name
    policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess"
}

resource "aws_iam_instance_profile" "jenkins_ecr" {
  name = "jenkins-ecr-profile"
  role = aws_iam_role.jenkins_ecr.name
}
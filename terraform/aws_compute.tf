resource "aws_instance" "jenkins_aws" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = "t2.medium"
  associate_public_ip_address = true
  tags = {
    Name = "jenkins-aws"
  }
  user_data                   = file("${path.module}/scripts/jenkins_app.sh")
  user_data_replace_on_change = true
  vpc_security_group_ids      = [aws_security_group.jenkins.id]
  key_name                    = aws_key_pair.ssh_key.key_name
  iam_instance_profile        = aws_iam_instance_profile.jenkins_instance_profile.name



}
resource "aws_security_group" "jenkins" {
  name        = "jenkins"
  description = "Security group for Jenkins instance"
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_allowed_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "ssh_key" {
  key_name   = "ssh_key_jenkins"
  public_key = var.ssh_public_key

}

resource "aws_instance" "docker_aws" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = "t2.small"
  associate_public_ip_address = true
  tags = {
    Name = "docker-aws"
  }
  user_data = templatefile("${path.module}/scripts/docker_app.sh", {
    aws_region          = var.aws_region
    new_relic_secret_id = aws_secretsmanager_secret.securenet_newrelic.name
  })
  user_data_replace_on_change = true
  vpc_security_group_ids      = [aws_security_group.docker.id]
  key_name                    = aws_key_pair.ssh_key.key_name
  iam_instance_profile        = aws_iam_instance_profile.jenkins_instance_profile.name


}

resource "aws_security_group" "docker" {
  name        = "docker"
  description = "Security group for Docker/App instance"


  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_allowed_cidr]
  }


  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }


  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
resource "aws_iam_role" "jenkins_role" {
  name = "jenkins_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

}
resource "aws_iam_role_policy_attachment" "jenkins_policy_attachment" {
  role       = aws_iam_role.jenkins_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser"

}
resource "aws_iam_instance_profile" "jenkins_instance_profile" {
  name = "jenkins_instance_profile"
  role = aws_iam_role.jenkins_role.name
}

resource "aws_iam_role_policy_attachment" "jenkins_secretsmanager_read" {
  role       = aws_iam_role.jenkins_role.name
  policy_arn = aws_iam_policy.securenet_newrelic_secrets_read.arn
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}
data "aws_caller_identity" "current" {}

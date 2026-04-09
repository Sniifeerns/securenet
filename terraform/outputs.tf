output "ip_public_jenkins_aws" {
  value = aws_instance.jenkins_aws.public_ip
}

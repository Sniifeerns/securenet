output "ip_public_jenkins_aws" {
  value = aws_instance.jenkins_aws.public_ip
}

output "ip_public_docker_aws" {
  value = aws_instance.docker_aws.public_ip
}

output "new_relic_secret_name" {
  value = aws_secretsmanager_secret.securenet_newrelic.name
}

output "new_relic_secret_arn" {
  value = aws_secretsmanager_secret.securenet_newrelic.arn
}


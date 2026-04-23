resource "aws_secretsmanager_secret" "securenet_newrelic" {
  name        = var.new_relic_secret_name
  description = "Secret JSON para credenciales de New Relic de SecureNet"

  tags = {
    Project     = "securenet"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

resource "aws_iam_policy" "securenet_newrelic_secrets_read" {
  name        = "securenet-newrelic-secrets-read"
  description = "Permite leer credenciales de New Relic desde AWS Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "AllowGetNewRelicSecret",
        Effect = "Allow",
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ],
        Resource = aws_secretsmanager_secret.securenet_newrelic.arn
      }
    ]
  })
}
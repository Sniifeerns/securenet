pipeline {
    agent any
    
    environment {
        // ⚠️ CAMBIA ESTO por tu ID de cuenta de AWS y Región
        AWS_REGION = 'eu-west-3'
        AWS_ACCOUNT_ID = '812752207341' // <-- ¡Pon tu ID de 12 dígitos aquí!
        
        // Estas son las URLs de los repositorios que creaste con Terraform
        ECR_API = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/securenet-api"
        ECR_FRONTEND = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/securenet-frontend"
        ECR_GATEWAY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/securenet-gateway"
        
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Login en AWS ECR') {
            steps {
                // Jenkins usa su Rol IAM para conseguir la contraseña temporal de ECR
                sh '''
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${ECR_API%/*}
                '''
            }
        }
        
        stage('Build y Push a ECR') {
            parallel {
                stage('API') {
                    steps {
                        sh '''
                            docker build -t ${ECR_API}:${IMAGE_TAG} -f docker/api/Dockerfile .
                            docker tag ${ECR_API}:${IMAGE_TAG} ${ECR_API}:latest
                            docker push ${ECR_API}:${IMAGE_TAG}
                            docker push ${ECR_API}:latest
                        '''
                    }
                }
                stage('Frontend') {
                    steps {
                        sh '''
                            docker build -t ${ECR_FRONTEND}:${IMAGE_TAG} -f docker/frontend/Dockerfile .
                            docker tag ${ECR_FRONTEND}:${IMAGE_TAG} ${ECR_FRONTEND}:latest
                            docker push ${ECR_FRONTEND}:${IMAGE_TAG}
                            docker push ${ECR_FRONTEND}:latest
                            docker build --build-arg VITE_METRICS_API=/api -t ${ECR_FRONTEND}:${IMAGE_TAG} -f docker/frontend/Dockerfile .
                        '''
                    }
                }
                stage('Gateway') {
                    steps {
                        sh '''
                            docker pull nginx:alpine
                            docker tag nginx:alpine ${ECR_GATEWAY}:${IMAGE_TAG}
                            docker tag nginx:alpine ${ECR_GATEWAY}:latest
                            docker push ${ECR_GATEWAY}:${IMAGE_TAG}
                            docker push ${ECR_GATEWAY}:latest
                        '''
                    }
                }
            }
        }
        
        stage('Despliegue e Inyección del .env') {
            steps {
                // 1. Invocamos LAS TRES credenciales secretas a la vez
                withCredentials([
                    string(credentialsId: 'NR_LICENSE_KEY', variable: 'NR_LICENSE'),
                    string(credentialsId: 'NR_ACCOUNT_ID', variable: 'NR_ACCOUNT'),
                    string(credentialsId: 'NR_API_KEY', variable: 'NR_API')
                ]) {
                    sh '''
                        # Buscamos la IP privada dinámica de tu máquina
                        APP_IP=$(aws ec2 describe-instances \
                            --region ${AWS_REGION} \
                            --filters "Name=tag:Name,Values=docker-aws" "Name=instance-state-name,Values=running" \
                            --query "Reservations[0].Instances[0].PrivateIpAddress" \
                            --output text)
                        
                        echo "Desplegando en la máquina App con IP interna: $APP_IP"
                        
                        # Nos conectamos por SSH
                        ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_jenkins ec2-user@${APP_IP} "
                            cd /opt/app
                            
                            # 2. CREAMOS EL .ENV
                            # Primero las variables públicas (usamos > para crear el archivo nuevo)
                            echo 'NODE_ENV=production' > .env
                            echo 'VITE_METRICS_API=/api' >> .env
                            
                            # Luego añadimos las variables secretas (usamos >> para añadir al final)
                            echo 'NEW_RELIC_LICENSE_KEY=${NR_LICENSE}' >> .env
                            echo 'NEW_RELIC_ACCOUNT_ID=${NR_ACCOUNT}' >> .env
                            echo 'NEW_RELIC_API_KEY=${NR_API}' >> .env
                            
                            # Login en AWS ECR
                            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_API%/*}
                            
                            # Descargar y levantar
                            docker compose pull
                            docker compose up -d
                        "
                    '''
                }
            }
        }
     }
}
    
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'local'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                // Asegúrate de que las credenciales 'git-ssh' están creadas en Jenkins
                git credentialsId: 'git-ssh',
                    url: 'git@github.com:Sniifeerns/securenet.git',
                    branch: 'feature/terraform'
            }
        }
        
        stage('Build Docker Images') {
            // Construimos las 3 imágenes a la vez para ir más rápido
            parallel {
                stage('Build API') {
                    steps {
                        sh '''
                            docker build -t securenet-api:${IMAGE_TAG} -f docker/api/Dockerfile .
                            docker tag securenet-api:${IMAGE_TAG} securenet-api:latest
                        '''
                    }
                }
                stage('Build Frontend') {
                    steps {
                        sh '''
                            docker build -t securenet-frontend:${IMAGE_TAG} -f docker/frontend/Dockerfile .
                            docker tag securenet-frontend:${IMAGE_TAG} securenet-frontend:latest
                        '''
                    }
                }
                stage('Build Gateway') {
                    steps {
                        sh '''
                            # Si no tienes Dockerfile para el gateway, usa la imagen original
                            docker pull nginx:alpine
                            docker tag nginx:alpine securenet-gateway:latest
                        '''
                    }
                }
            }
        }
        
        stage('Test Images') {
            steps {
                sh '''
                    docker images | grep securenet
                    echo "Imágenes construidas correctamente"
                '''
            }
        }
        
        stage('Save Images Locally') {
            steps {
                sh '''
                    mkdir -p /opt/jenkins/images
                    docker save securenet-api:latest -o /opt/jenkins/images/api.tar
                    docker save securenet-frontend:latest -o /opt/jenkins/images/frontend.tar
                    docker save securenet-gateway:latest -o /opt/jenkins/images/gateway.tar
                '''
            }
        }
    }
}

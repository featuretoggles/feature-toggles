pipeline {
    agent any

    stages {
        stage('Build and Test') {
            parallel {
                stage('Build') {
                    steps {
                        sh 'node -v'
                        sh 'npm run build'
                    }
                }
                stage('Test') {
                    steps {
                        sh "npm run test"
                    }
                }
                stage('Deploy') {
                    steps {
                        sh "npm run test"
                    }
                }

            }
        }
    }
}
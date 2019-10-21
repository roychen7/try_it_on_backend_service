pipeline {
    agent { label 'master' }
    stages {
        stage('build') {
            steps {
                echo "Hello World24322fsd43242!"
            }
        }
    }
}
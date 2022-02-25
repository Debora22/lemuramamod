#!/usr/bin/env groovy

// Properties Section: Define here the Job properties, such as how long to keep build history, or job parameters.
properties ([
    // Job Configuration
    //  -> Days to keep build history
    [$class: 'BuildDiscarderProperty', strategy:
        [$class: 'LogRotator', artifactDaysToKeepStr: '', artifactNumToKeepStr: '',
        daysToKeepStr: '10', numToKeepStr: '']],
    // Parameters: Values assigned to this parameters may change from build to build.
    [$class: 'ParametersDefinitionProperty', parameterDefinitions: [
        //  -> GitHub credential to use
        [$class: 'CredentialsParameterDefinition',
        credentialType: 'com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl',
        defaultValue: 'jenkins-github-credentials', description: '', name: 'GITHUB_CREDENTIAL',
        required: true],
        //  -> AWS credential to use
        [$class: 'CredentialsParameterDefinition',
        credentialType: 'com.cloudbees.plugins.credentials.common.StandardCredentials',
        defaultValue: 'ecr:us-east-1:jenkins-aws-credentials',
        description: 'Select the credential to be used to access the Docker Registry.',
        name: 'REGISTRY_CREDENTIALS', required: false],
    //  -> Force Push images even on local VM environments
    [$class: 'BooleanParameterDefinition', defaultValue: false,
    description: 'If selected, generated images will be uploaded to AWS Registry even on local VM environment.',
    name: 'FORCE_PUSH'],
    //  -> Push built image as Latest
    [$class: 'BooleanParameterDefinition', defaultValue: true,
    description: 'If selected, generated image will be also pushed to the registry with tag "latest"',
    name: 'TAG_LATEST'],
    //  -> Run job in Verbose mode.
    [$class: 'BooleanParameterDefinition', defaultValue: false,
    description: 'If selected, "verbose" option will be passed to every executed step.',
    name: 'VERBOSE']]]])

// Job Variables: Variables defined here should only change through a commit. They shouldn't depend from a Environment Variable nor a Parameter.
//  In a certain way, they define the job identity
def service_image = 'service/lemurama-modsquad' // Docker image name to build. Must be always in lowercase.
def service_language_name = 'nodejs' // Project language, must match one of the following: php, nodejs.
def service_language_ver = 'agnostic-2' // Project language version. Check the different versions available for each language at Puzzlebox Documentation page.
def service_use_builder = true // Defines if S2I "non-builder image" feature should be used or not. Set true for compiled languages or PHP, and false, for interpreted languages.

// REMEMBER: No "stage" should be declared outside a "node" tag.
node {
    stage 'Checkout'
    // Clone the project repository branch
    checkout scm
    sh "git rev-parse --short HEAD > .git/commit-id"
    commit_hash = readFile('.git/commit-id')

    stage 'Build'
    // Build the Docker Image to be used by Openshift
    runBuild(service_image, service_language_name, service_language_ver, service_use_builder, commit_hash);

    stage 'Publish'
    // Push generated image to docker registry
    runPublish(service_image);

    stage 'Deploy'
    // Depending on the origin branch, it will execute different steps
    if ( "$env.BRANCH_NAME" == 'master' ) {
        // TODO: Deploy automatically or after user input

        echo "***************************************************************************************\n" + \
        "The image built has been pushed. You can run 'oc import-image {imagestream_name}' for a PROD deployment to occur.\n" + \
        "***************************************************************************************"
    } else {
        // Create a customized set of steps for non-master branches
        print "No deployment procedure defined for branch: ${env.BRANCH_NAME}"
    }
}

// Build the Docker Image to be used by Openshift
def runBuild(service_image, service_language_name, service_language_ver, use_builder, commit_hash) {
  // Set the verbosity of the job steps
  def verboseOption = ( params.VERBOSE.toBoolean()) ? " --loglevel=4" : ""
  // Set the URL and credential to connect with Docker Registry
  docker.withRegistry("https://${env.REGISTRY_URL}", "${params.REGISTRY_CREDENTIALS}") {
        // Start pulling latest version of needed S2I docker images
        parallel 'builder-image': {
            if (use_builder) {
                // If use_builder value was set to true, it will also download the builder image
                docker.image("s2i/" + service_language_name + ":builder_" + service_language_ver).pull()
            }
        }, 'runtime-image': {
            // pulls the base image (runtime image)
            docker.image("s2i/" + service_language_name + ":run_" + service_language_ver).pull()
        }, failFast: true

        // Set the GitHub credentials stored in Jenkins
        withCredentials([[$class: 'UsernamePasswordMultiBinding',
                        credentialsId: "${params.GITHUB_CREDENTIAL}", passwordVariable: 'GITHUB_TOKEN',
                        usernameVariable: 'GITHUB_USERNAME']]) {
            sh '''
            set +x;
            rm -rf source/.git source/.gitignore
            '''
            writeFile file: "${env.WORKSPACE}/tokens/github", text: "GITHUB_TOKEN=${env.GITHUB_TOKEN}"
            hostWorkspace = sh (
                    // This command returns the absolute physical path (on host) of jenkins slave workspace so it can be properly mounted on S2I containers
                    script: 'docker inspect -f "{{range .Mounts}}{{if eq .Destination \\\"/home/jenkins\\\" }}{{.Source}}{{end}}{{end}}" $(docker ps --filter "label=io.kubernetes.pod.name=' + "${env.HOSTNAME}" + '" --filter "label=io.kubernetes.container.name=jnlp" --format "{{.ID}}")',
                    returnStdout: true
                ).trim()
            if (use_builder) {
                // If use_builder value was set to true it runs S2I using "non-builder" image feature
                sh "s2i build ./ ${env.REGISTRY_URL}/s2i/"+ service_language_name + ":builder_" + service_language_ver + " " + service_image + ":${env.BRANCH_NAME}_b${env.BUILD_ID} --runtime-image ${env.REGISTRY_URL}/s2i/"+ service_language_name + ":run_" + service_language_ver + ' --runtime-artifact /src/dist:./tmp -v ' + hostWorkspace + '${WORKSPACE#$HOME}/tokens:/etc/tokens ' + verboseOption + ' -e VERSION=' + commit_hash
            } else {
                // If use_builder value was set to false it runs S2I using the base image only
                sh "s2i build ./ ${env.REGISTRY_URL}/s2i/"+ service_language_name + ":run_" + service_language_ver + " " + service_image + ":${env.BRANCH_NAME}_b${env.BUILD_ID} -v " + hostWorkspace + '${WORKSPACE#$HOME}/tokens:/etc/tokens ' + verboseOption + ' -e VERSION=' + commit_hash
            }
        }
    }
}


// Push generated image to docker registry
def runPublish(service_image){
    if ( ! env.IS_LOCAL.toBoolean() || params.FORCE_PUSH.toBoolean() ) {
        // Set the URL and credential to connect with Docker Registry
        docker.withRegistry("https://${env.REGISTRY_URL}", "${params.REGISTRY_CREDENTIALS}") {
            // Push the built image into the remote docker registry
            docker.image(service_image + ":${env.BRANCH_NAME}_b${env.BUILD_ID}").push()
            if ( params.TAG_LATEST.toBoolean() && "$env.BRANCH_NAME" == 'master' ) {
                // If true it will also tag the generated image as "latest" and push it (this is
                // the default for the 'master' branch).
                docker.image(service_image + ":${env.BRANCH_NAME}_b${env.BUILD_ID}").push("latest")
            }
        }
    } else {
        echo "Omitting push images to ECS because this Jenkins is running on a local VM."
    }
}

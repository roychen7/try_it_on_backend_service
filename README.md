# Try It On Backend service

# NOTE:
    - There may be some configs that you need to add to your GIT in order for it to function properly

# Before you start:
    - Make sure to always branch off develop before attempting any tasks/stories 
        (checkout develop -> then type in the command: git checkout -b make_of_your_new_branch develop)
    - Keep the story moving through the Trello Board
    - Be specific on what you did in your commit (this is so that we can keep track of what is happening)
    - COMMIT OFTEN!! I usually get told to commit often when I am at work, and this is because we always need to keep track   of when and if the code breaks

# For Jenkins Pipeline setup:
    - Please go to Jenkins.io and install Jenkins for your machine
    - Go through all of the steps to install it on your machine 
        -> (Create your user; change your localhost link to http://<username>:8080/)
    - Go to **Manage Jenkins** -> **Manage PLugins** -> Click on the **Available** Tab -> On the top right corner, filter for "GitHub pull request builder" -> Select it -> Click on **Install without restart**
    - Create a pipeline by going to the **Main Page** -> **New Item** -> **Pipeline** (enter item name:     backend-service-test) 
        - Once that is done, do the following:
            1) set description as "Test pipeline for backend service - Try It On"
            2) check **GitHub project** and enter the URL: https://github.com/kendricchung/try_it_on_backend_service.git
            3) check **This project is parameterized** and enter the following value as:
                - Name: BRANCH_NAME
                - Default Value: develop
                - Description: Branch to build
            4) 

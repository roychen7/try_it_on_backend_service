# Try It On Backend service

# NOTE:
    - There may be some configs that you need to add to your GIT in order for it to function properly

# Before you start:
    - Make sure to always branch off develop before attempting any tasks/stories 
        (checkout develop -> then type in the command: git checkout -b make_of_your_new_branch develop)
    - Keep the story moving through the Trello Board
    - Be specific on what you did in your commit (this is so that we can keep track of what is happening)
    - COMMIT OFTEN!! I usually get told to commit often when I am at work, and this is because we always need to keep track   of when and if the code breaks

# Starting on the Project:
    - Make sure you run: npm install --no-optional
    - Make sure you run: npm install -g newman
    - To start the express server, run: npm run dev
    - Export your environment varaibles:
        1) Open terminal or command line
        2) for windows please type in this:
            setx POSTGRES_DB_NAME "postgres"
            setx POSTGRES_DB_USER "postgres"
            setx POSTGRES_DB_PASSWORD "password"
            setx POSTGRES_DB_HOST "$(whatever the ip address your docker container is running on)"

           for mac please type in this:
            export POSTGRES_DB_NAME="postgres"
            export POSTGRES_DB_USER="postgres"
            export POSTGRES_DB_PASSWORD="password"
            export POSTGRES_DB_HOST="localhost"
    - You may now make Postman calls to the express server to test your endpoints as you code along

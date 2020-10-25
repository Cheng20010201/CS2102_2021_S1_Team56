# CS2102 2021 S1 Team56

Web project with a backend for CS2102 20/21 Sem 1

## Project Report

The project report, along with the preliminary constraints can be found [here](https://docs.google.com/document/d/1bPF4ZJQTEm7NJvsOS0Q6sHlAe5rM7mlJFJt5Sf1nTTg/edit?usp=sharing).

## Project Deployment
The project is deployed on *Heroku*, click [here]( https://cs2102-2021-s1-team56.herokuapp.com/). (append `/people` to the url, you can find a data display demo from our live DB)

- The deployment is configured to be done automatically when there is new change to the master (our default) branch. So just changing the git repo suffices to redeploy the app on the heroku host.
- Free postgreSQL DB offered by amazon is used, with data storage up to 10,000 entries, DB credentials can be found [here](https://docs.google.com/document/d/1XFaQMwaQB6guT945Vx7K2zpCyFAt2hxqnrqVEQGIHwE/edit?usp=sharing).
- `git clone` this project to your local machine and enter the directory, and run `node index.js` to have your local server running on port 5000. See the `index.js` file to do some configuration on choosing local db or remote db to connect.


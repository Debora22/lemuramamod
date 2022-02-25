# Creating Staging Environments
> You know nothing Jon Snow

The following is a step by step guideline to create a staging environment from a determined branch with a PR open.

## Steps
* **1:** Log in to [Jenkins](https://tests.photorank.me/).
* **2:** Choose the job: `LemuramaModSquad_Staging`.
* **3:** Click on Play.

![](https://s3.amazonaws.com/uploads.hipchat.com/306491/2815860/JqUrJLL3yyJldxf/01-Click%20on%20Play.png) 

* **4:** Go to Pull Requests section of Lemurama Modsquad Repo on [github](https://github.com/Olapic/LemuramaModsquad/pulls).
* **5:** Click on an open pull request.
* **6:** Stand on Commits tab.
* **7:** Copy the name of the branch in question and paste it on the filed `GIT_BRANCH`.

![](https://s3.amazonaws.com/uploads.hipchat.com/306491/2815860/jPgGiW6yR3Bneof/02-Completing%20the%20Fields.png)

* **8:** Click on the commit id to open a new tab.
* **9:** From the url take the long id and paste it on the field `GIT_COMMIT`.

![](https://s3.amazonaws.com/uploads.hipchat.com/306491/2815860/iWuaVsAf4Omi1ON/03-Commit%20ID.png)

* **10:** Once the fields are complete, click on the button BUILD.
* **11:** After the job is complete, click on the console icon to see the log. This is the URL of your STG env:

![](https://s3.amazonaws.com/uploads.hipchat.com/306491/2815860/0pUvBfYbqQKH4yk/04-Console%20log.png)

# Local environment setup
> For the night is dark and full of terrors. [*](quotes.md#local)

This tools requires external projects to authenticate users agains our oAuth server, use the Olapic's API to edit mediums, translate captions, ask for mediums rights, etc.

So you'll need those projects running on your local environment before start working with Lemurama Modsquad. Visit the projects' repositories and follow the instructions on their documentation to setup them locally; in case you can't access to any of the repositories please contact Devops.

Remember, you'll need to keep them updated in order to have the latest version of the services available for the Lemurama Modsquad app. Devops provides and [easy way to check](https://github.com/Olapic/Puppet/blob/local/docs/Daily_tasks.md) the latest version of the projects.

### Local Virtual Machine
The [Local Virtual Machine](https://github.com/Olapic/Puppet/tree/local) is used by the LemuramaMiddleware to request the following services. Instructions on how to setup it may be found on [this link](https://github.com/Olapic/Puppet/blob/local/docs/Installation.md).

#### Configuring Redis server in Local VM - ⚠️ Warning - this is a _hack_

**The following is a hack and it should be used at your own risk: it can broke the legacy VM or stop working without previous notice. Please note also this is it's just an alternative, you have others ways to do this; like install Redis in your local box using `brew install redis` for example**

LemuramaMiddleware reads from Redis server some action and time tracking counters. In order to have the Tracking feature running in LemuramaModsquad, it is required to configure Redis server to listen for connections from the local interface. In order to do that, apply the following  patch on `~/Olapic/Environment64` and then run `vagrant reload`.

```batch
diff --git a/puppet/modules/redis/files/redis-server.conf b/puppet/modules/redis/files/redis-server.conf
index 64a164b..6d4464f 100644
--- a/puppet/modules/redis/files/redis-server.conf
+++ b/puppet/modules/redis/files/redis-server.conf
@@ -1,7 +1,7 @@
 daemonize yes
 pidfile /var/run/redis/redis-server.pid
 port 6379
-bind 127.0.0.1
+bind 0.0.0.0
 timeout 0
 loglevel notice
 logfile /var/log/redis/redis-server.log
```

### Olapic OAuth 2.0 Server
The [OAuth server](https://github.com/Olapic/OauthServer) project allow us to authenticate active users on the application. The `README.md` of the project includes instructions to [setup the server locally](https://github.com/Olapic/OauthServer#local-development-setup)

### Olapic Search Server
The [Search server](https://github.com/Olapic/SearchServer) index documents (mediums, categories, streams, etc) which will lately required by `AdminAPI`; instructions for local setup on the [documentation of the project](https://github.com/Olapic/SearchServer/blob/master/docs/LocalSetup.md)

### Eridani - Tracking Server
The [Eridani server](https://github.com/Olapic/Eridani) allow us to track user activity while they are using in the  Lemurama Modsquad app; the local environment setup document is [located here](https://github.com/Olapic/Eridani/blob/master/docs/Local-Setup.md#local-development-setup)

### Admin REST API - AdminAPI
The [Admin REST API](https://github.com/Olapic/AdminAPI) is an interface with several Olapic's project; take a look at the [local setup section](https://github.com/Olapic/AdminAPI#setup-in-your-local-env) and pay special attention to the [Service dependencies](https://github.com/Olapic/AdminAPI#service-dependencies) section.

## Lemurama Modsquad setup
Once you have all those projects running on your local environment, the next step is to clone a install the Lemurama Modsquad's dependencies. Execute the following commands;
Note, install the dependencies may take several minutes.

Edit your `/etc/hosts` and make sure `lemurama.local.photorank.me` resolves to `127.0.0.1`.

_Note:_ This is recently required due the integration with SSO client. If Lemurama and the SSO aren't in the same wildcard domain, they won't be able to read the cookie they set for each other.

```bash
# Clone the repo
git clone git@github.com:Olapic/LemuramaModsquad.git  ~/OLAPIC/LemuramaModsquad;

# Change to the project folder
cd LemuramaModsquad;

# Activate the pre-commit hooks
./scripts/install_hooks.sh

# switch to the right node version
nvm install

# Install dependencies
npm install

# Start the server with local environment
PORT=443 npm run start:local
```

If everything goes well, Lemurama Modsquad should be up and running;

```bash
# Open your browser on the lemurama's local url.
open https://lemurama.local.photorank.me/
```
Login with you Olapic's account; remember that your Olapic's user will need need special privileges to use Lemurama Modsquad's sections. More information about Users Scope can be found on [this section](user_scopes.md).

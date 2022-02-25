# User Scopes by sections
> You're no son of mine. [*](quotes.md#scopes)

The [OAuth server](https://github.com/Olapic/OauthServer) provides the LemuramaMiddleware a security layer not only to validate user's credentials but to deny them to certain sections and actions on the app.

The following is a list of required scopes by section; an active users should have them associate with a customer account.

* Pre Moderation section: `lemurama.premod`
* Tagging section: `lemurama.tagging`
* Moderation section: `lemurama.moderation`
* Ask for mediums rights - Moderation section: `lemurama.rm`

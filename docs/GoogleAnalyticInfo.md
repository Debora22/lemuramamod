# Google Analytics usage in Lemurama Modsquad
Currently in Lemurama Modsquad we are using Google Analytics (GA) for some instrumentations.
This document is intended to explain what those instrumentations are and which GA tools are being used to manage them.

There are three kind of GA hits used in LemuramaModsquad:
 - **Event**: We use them to measure some events while the user is interacting with the application.
 - **Page view**: We use it to measure how our users navigate through the application, which views are load and how much time users spend on them.
 - **Search Term**: We use it to measure the searches our users perform while using the application. The users perform searches when they are looking for a media or a product.

## Event
### All current events
|Category|Action|Label|Value|   |
|---|---|---|---|---|
|filters_hit|filtersHit_for_nsfwFilter|Current Brand|1|The user Moves NSFW filter slider|
|tracking_time|timer_pause_button_pressed|*Current Brand*|1|*The user clicks on pause in the time tracker*|
|tracking_time|timer_resume_button_pressed|*Current Brand*|1|*The user clicks in resume in the time tracker*|
|sync_issue|sync_issue_approved|*Current Brand*|the difference|*There was a difference between automatically tracked approvals during the session and the value displayed in the activity submission form*|
|sync_issue|sync_issue_rejected|*Current Brand*|the difference|*There was a difference between automatically tracked rejections during the session and the value displayed in the activity submission form*|
|sync_issue|sync_issue_tagged|*Current Brand*|the difference|*There was a difference between automatically tracked tagging action during the session and the value displayed in the activity submission form*|
|flagged_as_spam|media_flagged_as_spam_from_expressmoderation|*Current Brand*|Number of media flagged as spam|*There were media flagged as spam in Premod section*|
|flagged_as_spam|media_flagged_as_spam_from_tagging|*Current Brand*|Number of media flagged as spam|*There were media flagged as spam in Tagging section*|
|blacklisting_user|userblacklisted_from_expressmoderation|*Current Brand*|1|*A user was blacklisted in Premod section*|
|blacklisting_user|userblacklisted_from_moderation|*Current Brand*|1|*A user was blacklisted in Moderation section*|
|blacklisting_user|userblacklisted_from_tagging|*Current Brand*|1|*A user was blacklisted in Tagging section*|
|_tagging_productivity_suggestions-used-or-not|_tagging_modal_add-product-tag_from-search-result(2)|*Current Brand*|1|*The user chose a product from the search result*|
|_tagging_productivity_suggestions-used-or-not|_tagging_modal_add-product-tag_from-suggestion(2)|*Current Brand*|1|*The user chose a product from the suggestions*|
|_tagging_productivity_suggestions-available-or-not|_tagging_modal_tagging_available-suggestions|*Current Brand*|1|*There was at least one suggestion for the media*|
|_tagging_productivity_suggestions-available-or-not	|_tagging_modal_tagging_unavailable-suggestions|*Current Brand*|1|*There was no suggestions for the media*|
|_tagging_productivity|_tagging_modal_add_product_tag (1)(3)(4)(5)(6)|*Current Brand*|1|*A media was tagged with a stream*|

### Timing events
|Category|Action|Label|Value|When is this event sent?|
|---|---|---|---|---|
|tagging_productivity_tagging-speed|_tagging_modal_add-first-product-tag_from-search-result|*Current Brand*|The elapsed time (In seconds) from the moment the user opens a media and the moment the user adds the first tag from a searched stream|When the first tag is added for a media (It is only sent if the first used tag was suggested)|
|tagging_productivity_tagging-speed|_tagging_modal_add-first-product-tag_from-suggestion|*Current Brand*|The elapsed time (In seconds) from the moment the user opens a media and the moment the user adds the first tag from a suggested stream|When the first tag is added for a media (It is only sent if the first used tag was suggested)|

### Event fields
- Category: We use the category to group some events
- Action: The action or event we are actually tracking
- Label: The customer or branch
- Value: An number to indicate some value for the event
- (1) dimension1: the stream id
- (2) dimension2: a string indicating if the stream has been suggested or not
- (3) dimension3: a string indicating if the stream has an associated hotspot (With hotspot, Without hotspot)
- (4) dimension4: a string indicating from where the tag was made: possible values are:
 - `search`: tagging from search
 - `suggestion_regular`: tagging from general suggestion
 - `suggestion_by_crop`: tagging from crop list
- (5) dimension5: a string indicating the customer has the suggestions activated or not. Possible values are:
 - `no`: when all suggestion are disabled
 - `both`: when both suggestion are enabled
 - `suggestion by crop`: only suggestion by crop is enabled
 - `general suggestion`: only general suggestion is enable
- (6) dimension6: the media id

## Page Views
### Available fields for Page View tracking
- Title: We set the title for each application section in order to identity them
- Page: The path portion of a URL (i.e. */tagging/media*)
- Category: The selected Customer (Brand)

## Search Term
### Available fields for Page View tracking
- Search Term: The string using for the search
- Destination Page: The path portion of a URL (i.e. */tagging/media*)
- Category: The selected Customer (Brand)

### Current searches under tracking
|Destination Page|Tracked Search term|
|---|---|
|/expressmoderation/search|The string entered by the user in order to filter media list using the search input in Premod section|
|/expressmoderation/filter/metadata|The item selected by the user in order to filter media list using "metadata" in Premod section|
|/tagging/search|The string entered by the user in order to filter media list using the search input in Tagging section|
|/tagging/filter/metadata|The item selected by the user in order to filter media list using "metadata" in Tagging section|
|/tagging/media/search|The string entered by the user while looking for products after opening a media in Tagging section|
|/tagging/bulk/search|The string entered by the user while looking for products after opening several medias in bulk mode in Tagging section|
|/moderation/search|The string entered by the user in order to filter media list using the search input in Premod section|
|/moderation/filter/metadata|The item selected by the user in order to filter media list using "metadata" in Premod section|
|/moderation/media/search|The string entered by the user while looking for products after opening a media in Moderation section|
|/moderation/bulk/search|The string entered by the user while looking for products after opening several medias in bulk mode in Moderation section|

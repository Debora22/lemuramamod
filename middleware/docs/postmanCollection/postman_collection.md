# Postman Collection

This collection allow us to test all the endpoints without the UI, after a change in the API you can check that everything is working properly. Be aware of change the request body of the endpoints after make a new change in the middleware.

Based on LemuramaMiddleware v5.0.0
### Bootstrapping the collection

We should follow some steps to bootstrap the collection in postman.

  * First of all you need to install [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en).
  * Import the collection to Postman (Import > Import File > PostmanCollection).
  * Add a new environment by clicking in `No environment` dropdown at the top right of the page, Manage Environment > Add > Put a name like `middlewareEnvironment` and add to it a new key called `middlewareId`.
  * Install [Postman Interceptor](https://chrome.google.com/webstore/detail/postman-interceptor/aicmkgpgakddgnaphhhpliifpcfhicfo?hl=en)
  in order to read and write cookies.
  * You should enable the interceptor at the top of the page in postman by clicking in the interceptor icon.

### Running endpoints

  * Use `modsquadqa` Customer. If you need to download it **modsquadqa id:** 217950
  * The endpoints name are tagged with a number of precedence.
  * Running Special Endpoints
   * `Mark as Blacklist User`endpoint. You should change the user id after use it since next time it will be already in the black list.
   * `Get Suggestion for Media` endpoint. Use `Curio Hotels` customer. **Curio Hotels id:** 217102
   * `Tracking actions - Get Counters` endpoint. You should previously change the status of a media. i.e. go to endpoint `10 - Change The Status of a Media` and approve the media from status 21 to status 25.
  * **After logout** go to `chrome://settings/cookies` search for `localhost` and delete the cookies called `lemurama-middleware.sid` in order to delete the cookie from the session.

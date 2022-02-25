'use strict';

const passport = require('passport');
const CustomStrategy = require('passport-custom').Strategy;
const AuthenticationError = require(`../../common/providers/authenticationErrorHandler.js`);

module.exports = {
  register: (c) => {
    const http = c.get('http').http;
    const settings = c.get('settings');

    /**
     * Formats the credentials returned from the authentication service so they'll be compatible
     * with what the rest of the app expects.
     * @param {Object} response The authentication service data response.
     * @property {Object} user_account      The user account information (id, name, email, etc.).
     * @property {Array}  customer_accounts The list of assigned customers.
     * @property {Object} tokeninfo         The user token information.
     * @return {Object}
     * @property {Object} account     The user account information (id, name, email, etc.).
     * @property {Array}  credentials The list of credentials sets for the assgined customers.
     */
    const getTokenInfo = ({
      customer,
      user,
      tokeninfo,
      token
    }) => {
      const { url } = settings.services.authServer;
      return http(`${url}/auth/tokeninfo?access_token=${token}`)
      .then(response => response.json())
      .then(response => {
        return {
          customer: customer,
          user: user,
          token: token,
          tokeninfo: {
            scope: tokeninfo.scope
          }
        }
      });
    };

    const accountLogin = function(body) {
      let result;
      if (body.token) {
        result = getTokenInfo(body)
      } else {
        result = Promise.reject(new AuthenticationError('Customer not selected', 404));
      }

      return result;
    };

    // Session (de)serialization
    passport.serializeUser((user, done) => {
      done(null, user); // ** store the entire user in session (not just the ID)
    });

    passport.deserializeUser((id, done) => {
      done(null, id); // ** don't need to lookup for the user by ID, the ID _is_ the entire user
    });

    // Creating a custom strategy to authenticate agains OAuthServer
    passport.use('accounts-server', new CustomStrategy(
      (req, done) => {
        if (!req.user || !req.user.token) {
          accountLogin(req.body)
          .then((res) => {
            if (res.message) {
              return done(new AuthenticationError(res.message, 401), false);
            } else {
              return done(null, res);
            }
          }, (err) => {
            return done(err, false);
          });
        } else {
          done(null, req.user);
        }
      }
    ));

    const ensureUserAuthenticated = () => {
      return passport.authenticate('accounts-server', {failWithError: true});
    };

    const ensureCustomerAuthenticated = () => {
      return (req, res, next) => {
        if (!req.user || !req.user.token) {
          // there is no account data in the session
          throw new AuthenticationError('Authentication Error', 401);
        }
        if (!req.user.customer) {
          // there is no customer selected in the session
          throw new AuthenticationError('Customer not selected', 403);
        } else {
          next();
        }
      };
    };

    c.set('auth', {
      express: [
        passport.initialize(),
        passport.session()
      ],
      ensureUserAuthenticated: ensureUserAuthenticated,
      ensureCustomerAuthenticated: ensureCustomerAuthenticated,
    });
  }
};

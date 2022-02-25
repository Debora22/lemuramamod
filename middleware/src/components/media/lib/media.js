'use strict';
const extend = require('extend');

/**
 * Media Class
 */
class Media {
  /**
   * constructor,
   * @param {Object} httpHdlr http provider
   * @param {String} baseUrl domain
   */
  constructor(httpHdlr, baseUrl) {
    this.httpHdlr = httpHdlr;
    this.baseUrl = baseUrl;
    this.req = null;
    this.annotations = [];

    /**
     * saveStreams
     * Perform a request to AdminAPI to update a media->streams relationship
     * @return {Promise}
     */
    this.saveStreams = () => {
      let requestOptions;
      let link = [];
      let unLink = [];

      this.req.body.link.forEach(item => link.push(item.id));
      this.req.body.unlink.forEach(item => unLink.push(item.id));

      requestOptions = extend(this.req.httpOptions, {
        method: 'POST',
        body: JSON.stringify({
          link: link,
          unlink: unLink,
          positions: this.req.body.positions
        }),
        json: true
      });

      return this.httpHdlr.doRequest(
        `${this.baseUrl}/media/${this.req.params.id}/streams/positions`,
        requestOptions
      );
    };

    /**
     * saveAnnotation
     * If annotation object is present on the reques; perform a request to AdminAPI
     * to create new annotation on the media.
     * @return {Promise}
     */
    this.saveAnnotation = () => {
      let requestOptions;

      this.req.body.link.forEach(item => {
        // annotation object is optional
        if (item.annotation) {
          this.annotations.push({
            target: {
              type: 'olapic.product',
              id: item.id+'' //ID should be a String
            },
            geometry: item.annotation.geometry
          });
        }
      });

      if (this.annotations[0]) {
        requestOptions = extend(this.req.httpOptions, {
          method: 'POST',
          body: JSON.stringify(this.annotations[0]),
          json: true
        });
        // if this request faild, we're goint to catch this on
        // save method.
        return this.httpHdlr.doRequest(
          `${this.baseUrl}/media/${this.req.params.id}/annotations`,
          requestOptions
        );
      } else {
        // when there's no annotation to add;
        // the save function will not update the response from the saveStream action.
        return Promise.resolve();
      }
    };
    /**
     * removeAnnotations
     * If annotation object is present on the reques; perform a request to AdminAPI
     * to create remove an annotation from the media.
     * @return {Promise}
     */
    this.removeAnnotations = () => {
      let requestOptions;
      let annotationsIDs = [];

      // currently the application send only one annotation
      // to be removed. We should iterate over this list
      // if in the future the usecase allows remove in batch.
      this.req.body.unlink.forEach(item => {
        // annotation object is optional
        if (item.annotationId) {
          annotationsIDs.push(item.annotationId);
        }
      });

      if (annotationsIDs[0]) {
        requestOptions = extend(this.req.httpOptions, {
          method: 'DELETE',
          json: true,
          body: ''
        });
        return this.httpHdlr.doRequest(
          `${this.baseUrl}/media/${this.req.params.id}/annotations/${annotationsIDs[0]}`,
          requestOptions
        );
      } else {
        // when there's no annotation to remove;
        return Promise.resolve();
      }
    };

  }

  /**
   * Set the request object from the routes
   * @param {Object} request object from middleware
   */
  setReq(req) {
    this.req = req;
  }

  /**
   * Save a media stream relationship and create annotations if they present
   */
  save() {
    let response;
    let annotationResponse;

    return this.saveStreams().then((body) => {
      response = body;
      return this.saveAnnotation();
    }).then((body) => {
      annotationResponse = body;
      return this.removeAnnotations();
    }).then((body) => {
      // we should validate the body.metadata response
      // if one of the method fails body.metada.code will be != 200
      if (response && this.annotations.length) {
        Object.keys(response.data.streams).forEach((key) => {
          const item = response.data.streams[key];
          item.annotation_id = (item.id === parseInt(this.annotations[0].target.id)) ? annotationResponse.data.id : null;
        }, this);
      }
      return response;
    }).then(() => {
      return response;
    }).catch((err) => {
      // If response is undefined means saveSteams first call fail, otherwise means the annotation call fail
      return err;
    });
  }
}

module.exports = Media;

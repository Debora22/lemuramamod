'use strict';

/**
 * submission Class
 */
class Submission {
  /**
   * constructor,
   */
  constructor() {
    /**
     * Validate if any of the submitted values were modified by the user
     * a reason should be written.
     * @param {Object} payload: The submission data
     * @return {Boolean}
     */
    this.validateSubmission = (payload) => {
      let result = null;

      if ((payload.actions.approved_submitted ||
        payload.actions.rejected_submitted ||
        payload.actions.tagged_submitted ||
        payload.time_submitted) &&
        !payload.comment_submitted) {
        //When users edit activity counters they are required to enter a reason
        result = {
          status: 400,
          message: 'Reason is required'
        };
      } else if (payload.time_tracked > 1440) {
        result = {
          status: 400,
          message: 'Time must be less than 24hs'
        };
      }

      return result;
    };
  }


}
module.exports = Submission;

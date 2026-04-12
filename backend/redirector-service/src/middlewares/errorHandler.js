// Central error handler — must have 4 args so Express recognises it as error middleware
export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('[Redirector Error]', err);
  
  // Since the redirector service primarily serves browsers navigating short-links,
  // returning raw JSON is ugly. We redirect them to the graceful error UI.
  res.redirect(302, '/not-found?reason=server-error');
};

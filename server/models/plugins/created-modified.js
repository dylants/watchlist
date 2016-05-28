module.exports = function createdModifiedPlugin(schema) {
  schema.add({
    created: Date,
    modified: Date,
  });

  schema.pre('save', function save(next) {
    const now = new Date();

    /*
     * Before we save any model that is defined by a schema which uses this
     * plugin, update the modified date (and optionally the created date if not
     * yet defined) prior to saving the document.
     */
    this.modified = now;
    if (!this.created) {
      this.created = now;
    }

    next();
  });

  schema.pre('findOneAndUpdate', function update() {
    /*
     * When updating, we want to update the modified timestamp. We do so by
     * executing another update call per the docs:
     * http://mongoosejs.com/docs/middleware.html
     * http://github.com/Automattic/mongoose/issues/964
     */
    this.findOneAndUpdate({}, { modified: new Date() });
  });
};

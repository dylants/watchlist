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
};

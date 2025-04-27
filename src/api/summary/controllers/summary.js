'use strict';

/**
 * summary controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// We still use createCoreController for the basic structure and access to 'strapi'
module.exports = createCoreController('api::summary.summary', ({ strapi }) => ({
  async find(ctx) {
    console.log('--- Entering custom summary find controller (Entity Service version) ---');
    const user = ctx.state.user;

    if (!user) {
      console.log('--- No user found, returning unauthorized ---');
      return ctx.unauthorized('You must be logged in to retrieve summaries.');
    }
    console.log('--- User found in state:', `ID ${user.id} ---`);

    // 1. Extract relevant query parameters directly (filters, sort, populate, pagination)
    //    Strapi's core controllers use sanitizers/parsers, we'll mimic the essential parts.
    const { filters, sort, pagination, fields, populate } = ctx.query;

    // 2. Prepare the filters for the Entity Service, ensuring our owner filter is included
    const effectiveFilters = {
      // Spread existing filters from the query, if any
      ...(filters || {}),
      // Force the owner filter - this overrides any 'owner' filter passed in query
      owner: {
        id: user.id,
      },
    };

    console.log('--- Effective filters for Entity Service:', JSON.stringify(effectiveFilters));
    console.log('--- Other params:', JSON.stringify({ sort, pagination, fields, populate }));


    try {
      // 3. Call strapi.entityService.findMany
      //    Pass the API UID and an object containing filters, sort, etc.
      const entities = await strapi.entityService.findMany('api::summary.summary', {
        filters: effectiveFilters,
        sort: sort,
        pagination: pagination,
        fields: fields,     // Select specific fields if requested
        populate: populate, // Populate relations if requested
      });

      // 4. (Optional but Recommended) Sanitize the output like the core controller does
      //    This removes private fields etc. based on Strapi's sanitization config
      const sanitizedEntities = await this.sanitizeOutput(entities, ctx);

      // 5. Return the sanitized data
      //    Note: Entity Service findMany doesn't directly return the 'meta' object
      //    like super.find does. If you need complex pagination metadata,
      //    you might need to call findAndCount or calculate it manually.
      //    For simple cases, just returning the data might be enough.
      console.log('--- Entity Service findMany executed successfully ---');
      return this.transformResponse(sanitizedEntities); // Use transformResponse for standard format

    } catch (error) {
      console.error('--- Error calling strapi.entityService.findMany ---', error);
      // Let Strapi's error handling take over
      throw error;
    }
  }
}));

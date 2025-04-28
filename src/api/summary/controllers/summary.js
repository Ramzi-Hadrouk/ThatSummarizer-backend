'use strict';

/**
 * summary controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

/*
module.exports = createCoreController('api::summary.summary', ({ strapi }) => ({

  // Keep your existing find method here if you still need it customized
  async find(ctx) {
    // ... your custom find logic ...
    console.log('--- Entering custom summary find controller ---');
    const user = ctx.state.user;

    if (!user) {
      console.log('--- No user found, returning unauthorized ---');
      return ctx.unauthorized('You must be logged in to retrieve summaries.');
    }
    console.log('--- User found in state:', `ID ${user.id} ---`);

    const { filters, sort, pagination, fields, populate } = ctx.query;

    const effectiveFilters = {
      ...(filters || {}),
      owner: {
        id: user.id,
      },
    };

    console.log('--- Effective filters for Entity Service:', JSON.stringify(effectiveFilters));

    try {
      const entities = await strapi.entityService.findMany('api::summary.summary', {
        filters: effectiveFilters,
        sort: sort,
        pagination: pagination,
        fields: fields,
        populate: populate,
      });

      const sanitizedEntities = await this.sanitizeOutput(entities, ctx);

      console.log('--- Entity Service findMany executed successfully ---');
      return this.transformResponse(sanitizedEntities);

    } catch (error) {
      console.error('--- Error calling strapi.entityService.findMany ---', error);
      throw error;
    }
  },


  // --- CUSTOM CREATE METHOD ---
  async create(ctx) {
    console.log('--- Entering custom summary create controller ---');
    const user = ctx.state.user;

    // 1. Check if user is authenticated
    if (!user) {
      console.log('--- No user found, returning unauthorized ---');
      return ctx.unauthorized('You must be logged in to create a summary.');
    }
    console.log('--- User found in state:', `ID ${user.id} ---`);

    // 2. Get the incoming data from the request body
    // Strapi's default body parsing handles this
    let requestData = ctx.request.body.data; // Standard Strapi V4 request body format

    if (!requestData) {
         console.log('--- No data found in request body ---');
         return ctx.badRequest('Request body must contain a "data" object.');
    }

    console.log('--- Incoming data:', JSON.stringify(requestData));

    // 3. Perform custom logic on the data BEFORE creation
    // Example: Automatically set the owner to the current user
    requestData.owner = user.id;
    console.log('--- Data after adding owner:', JSON.stringify(requestData));

    // Example: Add a default value if not provided
    // if (!requestData.status) {
    //   requestData.status = 'draft';
    //   console.log('--- Setting default status to draft ---');
    // }

    // Example: Basic validation (Strapi's schema validation runs too)
    // if (!requestData.title) {
    //    console.log('--- Title is missing ---');
    //    return ctx.badRequest('Title is required.');
    // }


    try {
      // 4. Create the entity using strapi.entityService.create
      // Pass the API UID and the processed data
      const newEntity = await strapi.entityService.create('api::summary.summary', {
        data: requestData,
        // You can add populate here if you want the owner relation etc. in the response
        // populate: ['owner'],
      });

      console.log('--- Entity Service create executed successfully ---');

      // 5. (Optional but Recommended) Sanitize the output
      const sanitizedEntity = await this.sanitizeOutput(newEntity, ctx);

      // 6. Return the created entity in the standard Strapi format
      return this.transformResponse(sanitizedEntity);

    } catch (error) {
      console.error('--- Error calling strapi.entityService.create ---', error);

      // You can catch specific errors and return custom responses if needed
      // For example, if using custom errors:
      // if (error instanceof StrapiError) {
      //    return ctx.badRequest(error.message, { details: error.details });
      // }

      // Otherwise, let Strapi's default error handling manage it
      throw error;
    }
  },

  // You can override other methods like update, delete, findOne similarly
  // async update(ctx) { ... },
  // async delete(ctx) { ... },
  // async findOne(ctx) { ... },
}));
*/
module.exports = createCoreController('api::summary.summary', ({ strapi }) => ({
  // Custom find method with fixed pagination
  async find(ctx) {
    console.log('--- Entering custom summary find controller ---');
    const user = ctx.state.user;

    if (!user) {
      console.log('--- No user found, returning unauthorized ---');
      return ctx.unauthorized('You must be logged in to retrieve summaries.');
    }
    console.log('--- User found in state:', `ID ${user.id} ---`);

    // Log the pagination parameters to verify they're being received correctly
    console.log('--- Pagination parameters:', JSON.stringify(ctx.query.pagination));

    const { filters, sort, pagination, fields, populate } = ctx.query;

    const effectiveFilters = {
      ...(filters || {}),
      owner: {
        id: user.id,
      },
    };

    console.log('--- Effective filters for Entity Service:', JSON.stringify(effectiveFilters));

    try {
      // Get the total count for pagination metadata
      const count = await strapi.db.query('api::summary.summary').count({
        where: effectiveFilters
      });
      
      // Make sure pagination parameters are properly processed as numbers
      const pageSize = pagination?.pageSize ? parseInt(pagination.pageSize) : 25;
      const page = pagination?.page ? parseInt(pagination.page) : 1;
      
      // Convert page and pageSize to start and limit parameters
      const start = (page - 1) * pageSize;
      const limit = pageSize;
      
      console.log(`--- Applying pagination with start: ${start}, limit: ${limit} ---`);

      // Use findMany with start and limit parameters
      const entities = await strapi.entityService.findMany('api::summary.summary', {
        filters: effectiveFilters,
        sort: sort,
        start: start,
        limit: limit,
        fields: fields,
        populate: populate,
      });

      // Log the number of entities returned to verify pagination works
      console.log(`--- Number of entities returned: ${entities.length} ---`);

      const sanitizedEntities = await this.sanitizeOutput(entities, ctx);

      console.log('--- Entity Service findMany executed successfully ---');

      // Make sure we pass the complete pagination metadata
      return this.transformResponse(sanitizedEntities, {
        pagination: {
          page: page,
          pageSize: pageSize,
          pageCount: Math.ceil(count / pageSize),
          total: count
        }
      });
    } catch (error) {
      console.error('--- Error calling strapi.entityService.findMany ---', error);
      throw error;
    }
  },

  // --- CUSTOM CREATE METHOD ---
  async create(ctx) {
    console.log('--- Entering custom summary create controller ---');
    const user = ctx.state.user;

    // 1. Check if user is authenticated
    if (!user) {
      console.log('--- No user found, returning unauthorized ---');
      return ctx.unauthorized('You must be logged in to create a summary.');
    }
    console.log('--- User found in state:', `ID ${user.id} ---`);

    // 2. Get the incoming data from the request body
    // Strapi's default body parsing handles this
    let requestData = ctx.request.body.data; // Standard Strapi V4 request body format

    if (!requestData) {
      console.log('--- No data found in request body ---');
      return ctx.badRequest('Request body must contain a "data" object.');
    }

    console.log('--- Incoming data:', JSON.stringify(requestData));

    // 3. Perform custom logic on the data BEFORE creation
    // Example: Automatically set the owner to the current user
    requestData.owner = user.id;
    console.log('--- Data after adding owner:', JSON.stringify(requestData));

    try {
      // 4. Create the entity using strapi.entityService.create
      // Pass the API UID and the processed data
      const newEntity = await strapi.entityService.create('api::summary.summary', {
        data: requestData,
        // You can add populate here if you want the owner relation etc. in the response
        // populate: ['owner'],
      });

      console.log('--- Entity Service create executed successfully ---');

      // 5. (Optional but Recommended) Sanitize the output
      const sanitizedEntity = await this.sanitizeOutput(newEntity, ctx);

      // 6. Return the created entity in the standard Strapi format
      return this.transformResponse(sanitizedEntity);

    } catch (error) {
      console.error('--- Error calling strapi.entityService.create ---', error);

      // You can catch specific errors and return custom responses if needed
      // For example, if using custom errors:
      // if (error instanceof StrapiError) {
      // return ctx.badRequest(error.message, { details: error.details });
      // }

      // Otherwise, let Strapi's default error handling manage it
      throw error;
    }
  },

  // You can add these methods too, following the same pattern:
  // async update(ctx) { ... },
  // async delete(ctx) { ... },
  // async findOne(ctx) { ... },
}));

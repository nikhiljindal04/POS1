import { HTTP_STATUS } from '../utils/constants.js';
import logger from '../utils/logger.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
      //This tells Joi: : “Remove any fields from the request body that are not defined in the schema.”
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      logger.warn('Validation failed:', errors);
      
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req.body = value;
    next();
  };
};

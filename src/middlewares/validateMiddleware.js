import { HTTP_STATUS } from '../utils/constants.js';
import logger from '../utils/logger.js';

export const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    const dataToValidate = target === 'query' ? req.query : req.body;
    
    const { error, value } = schema.validate(dataToValidate, { 
      abortEarly: false,
      stripUnknown: true,
      convert: true // Convert string numbers to actual numbers
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

    if (target === 'query') {
      // Instead of replacing req.query, modify individual properties
      Object.keys(value).forEach(key => {
        req.query[key] = value[key];
      });
    } else {
      req.body = value;
    }
    
    next();
  };
};


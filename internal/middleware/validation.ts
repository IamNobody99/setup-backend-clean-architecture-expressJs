import { plainToInstance } from "class-transformer"
import { validate, ValidationError } from "class-validator";
 
export async function validateDTO<T extends object>(
  dtoClass: new () => T,
  body: any
): Promise<{ isValid: boolean; errors: string[]; data?: T }> {
    const dto = plainToInstance(dtoClass, body)
    const validationErrors: ValidationError[] = await validate(dto, {
        whitelist: true, forbidUnknownValues: true
    })

    if (validationErrors.length > 0) {
        const errors = flattenValidationErrors(validationErrors)
        return {
            isValid: false,
            errors,
        }
    }

    return {
        isValid: true,
        errors: [],
        data: dto,
    }
}

// Helper function to format validation errors
export function formatValidationErrors(errors: ValidationError[]): string[] {
  return errors.map((error) => {
    const constraints = error.constraints || {}
    const messages = Object.values(constraints)
    return `${error.property}: ${messages.join(", ")}`
  })
}

function flattenValidationErrors(errors: ValidationError[], parentPath = ""): string[] {
  const messages: string[] = []

  for (const error of errors) {
    const propertyPath = parentPath ? `${parentPath}.${error.property}` : error.property

    if (error.constraints) {
      messages.push(...Object.values(error.constraints).map(msg => `${propertyPath}: ${msg}`))
    }

    if (error.children && error.children.length > 0) {
      messages.push(...flattenValidationErrors(error.children, propertyPath))
    }
  }

  return messages
}

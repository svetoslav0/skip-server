export abstract class BaseController {

    protected readonly MAIN_ERROR_MESSAGE: string = "Something went wrong...";

    protected buildSuccessfullyCreatedMessage(controllerName: string): string {
        return `${controllerName} was successfully created!`;
    }

    protected buildSuccessfullyUpdatedMessage(controllerName: string): string {
        return `${controllerName} was successfully updated!`;
    }

    protected buildSuccessfullyArchivedMessage(controllerName: string): string {
        return `${controllerName} was successfully archived`;
    }

    protected buildFailedCreationMessage(controllerName: string): string {
        return `${controllerName} with the given parameters cannot be created!`;
    }

    protected buildFailedUpdatingMessage(controllerName: string): string {
        return `${controllerName} with the given parameters cannot be update!`;
    }

    protected buildFailedArchivingMessage(controllerName: string): string {
        return `${controllerName} with the given ID cannot be archived!`;
    }

    protected buildValidationErrors(validationError: any): string[] {
        return validationError
            .map((error: any) => error.constraints)
            .map((error: any) => Object.values(error))
            .flat();
    }
}

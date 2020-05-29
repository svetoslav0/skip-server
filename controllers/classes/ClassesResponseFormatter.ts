import {ClassEditDTO} from "../../data/classes/ClassEditDTO";

export class ClassesResponseFormatter {

    /**
     * @param {number} classesCount
     * @param {ClassEditDTO[]} classes
     */
    public formatAllClasses(classesCount: number, classes: ClassEditDTO[]) {
        return {
            count: classesCount,
            classes: this.formatClasses(classes)
        };
    }

    private formatClasses(classes: ClassEditDTO[]) {
        return classes.map((currentClass: ClassEditDTO) => {
            return {
                id: currentClass.id,
                name: currentClass.name,
                ageGroup: currentClass.ageGroup,
                description: currentClass.description
            };
        });
    }
}

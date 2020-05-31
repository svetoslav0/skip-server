import { ClassEditDTO } from "../../data/classes/ClassEditDTO";

export class ClassesResponseFormatter {

    /**
     * @param {number} classesCount
     * @param {ClassEditDTO[]} classes
     */
    public formatAllClasses(classesCount: number, classes: ClassEditDTO[]) {
        return {
            count: classesCount,
            classes: classes.map((currentClass: ClassEditDTO) => this.formatClass(currentClass))
        };
    }

    /**
     * @param {ClassEditDTO} currentClass
     */
    public formatGetClassById(currentClass: ClassEditDTO) {
        return this.formatClass(currentClass);
    }

    /**
     * @param {ClassEditDTO} currentClass
     */
    private formatClass(currentClass: ClassEditDTO) {
        return {
            id: currentClass.id,
            name: currentClass.name,
            ageGroup: currentClass.ageGroup || null,
            description: currentClass.description || null,
            isArchived: currentClass.isArchived === 1
        };
    }
}

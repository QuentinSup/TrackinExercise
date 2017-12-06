module trackinexercise.models {

    /**
     * Class Driver
     */
    export class Driver extends commons.API {

        private static API: string = "api/drivers";

        // Data properties
        public firstName: string;
        public lastName: string;
        public gender: number;

        public constructor(json?: any) {

            super(Driver.API);

            if (typeof (json) == 'object') {
                this.fromJson(json);
            }

        }

        // Return driver data
        public data(): any {
            return {
                id: this.id,
                firstName: this.firstName,
                lastName: this.lastName,
                gender: this.gender
            }
        }

        // Set driver data from json
        public fromJson(json: any): any {
            this.id = json.id;
            this.firstName = json.firstName;
            this.lastName = json.lastName;
            this.gender = json.gender;
        }

    }

}
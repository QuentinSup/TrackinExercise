module trackinexercise.commons {

    export abstract class API implements commons.APIResourceInterface {

        public id: number;
     
        private uri: string;

        constructor(uri: string) {
            this.uri = uri;
        }

        public getUri(): string {
            return this.uri;
        }

        public create(fn?: Function): void {
            $.ajax({
                method: 'POST',
                url: this.uri,
                data: this.toJson(),
                contentType: "application/json"
            }).done((resourceData): void => {

                // Update id
                this.id = resourceData.id;

                if ($.isFunction(fn)) {
                    fn.call(this, this);
                }

            });
        }

        public update(fn?: Function): void {
            $.ajax({
                method: 'PUT',
                url: this.uri + "/" + this.id,
                data: this.toJson(),
                contentType: "application/json"
            }).done((resourceData): void => {

                if ($.isFunction(fn)) {
                    fn.call(this, this);
                }

            });
        }

        public remove(fn?: Function): void {
            $.ajax({
                method: 'DELETE',
                url: this.uri + "/" + this.id,
                contentType: "application/json"
            }).done((): void => {

                this.id = null;

                if ($.isFunction(fn)) {
                    fn.call(this, this);
                }

            });
        }

        public list(fn?: Function): void {
            $.getJSON(this.uri).done((data): void => {

                if ($.isFunction(fn)) {
                    fn.call(this, data);
                }

            });
        }

        public save(fn?: Function): void {

            if (!this.id) {
                // Create
                this.create(fn);
            } else if (this.id == -1) {
                // Delete
                this.remove(fn);
            } else {
                // Update
                this.update(fn);
            }
        }
        
        // Return waypoint data as Json
        public toJson(): string {
            return JSON.stringify(this.data());
        }

        abstract data(): any;
        
    }

}
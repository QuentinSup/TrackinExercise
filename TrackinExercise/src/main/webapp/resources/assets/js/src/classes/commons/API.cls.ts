module trackinexercise.commons {

    /**
     * Use this class to simplify REST request
     */
    export abstract class API implements commons.APIResourceInterface {

        /**
         * Common attribute id
         */
        public id: number;
        
        /**
         * API uri
         */
        private uri: string;

        constructor(uri: string) {
            this.uri = uri;
        }

        /**
         * Returne API uri
         */
        public getUri(): string {
            return this.uri;
        }

        /**
         * Execute a POST request
         */
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

        /**
         * Execute a PUT request
         */
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

        /**
         * Execute a DELETE request
         */
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
        
        /**
         * Execute a GET request
         */
        public load(id: string, fn?: Function): void {
            $.getJSON(this.uri + '/' + id).done((data): void => {

                this.fromJson(data);
                
                if ($.isFunction(fn)) {
                    fn.call(this, data);
                }

            });
        }

        /**
         * Execute a GET request
         */
        public list(fn?: Function): void {
            $.getJSON(this.uri).done((data): void => {

                if ($.isFunction(fn)) {
                    fn.call(this, data);
                }

            });
        }
        
        /**
         * Execute a GET request for a sub operation resource
         */
        public sublist(operation: string, fn?: Function): void {
            $.getJSON(this.uri + '/' + this.id + '/' + operation).done((data): void => {

                if ($.isFunction(fn)) {
                    fn.call(this, data);
                }

            });
        }

        /**
         * Save data depending on id
         * No id => create
         * id => update
         * id = -1 => remove
         */
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

        // Abstract methods to implement
        abstract data(): any;
        abstract fromJson(data: any): void;
        
    }

}
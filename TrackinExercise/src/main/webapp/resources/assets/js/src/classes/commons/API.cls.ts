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
        public create(fnDone?: Function, fnFail?: Function): void {
            $.ajax({
                method: 'POST',
                url: this.uri,
                data: this.toJson(),
                contentType: "application/json"
            }).done((resourceData: any, textStatus: string, jqXHR: any): void => {

                // Update id
                this.id = resourceData.id;

                if ($.isFunction(fnDone)) {
                    fnDone.call(this, this, resourceData, textStatus, jqXHR);
                }

            }).fail((jqXHR: any, textStatus: string, errorThrown: any): void => {
                if ($.isFunction(fnFail)) {
                    fnFail.call(this, this, jqXHR, textStatus, errorThrown);
                }
            });
        }

        /**
         * Execute a PUT request
         */
        public update(fnDone?: Function, fnFail?: Function): void {
            $.ajax({
                method: 'PUT',
                url: this.uri + "/" + this.id,
                data: this.toJson(),
                contentType: "application/json"
            }).done((resourceData: any, textStatus: string, jqXHR: any): void => {

                if ($.isFunction(fnDone)) {
                    fnDone.call(this, this, resourceData, textStatus, jqXHR);
                }

            }).fail((jqXHR: any, textStatus: string, errorThrown: any): void => {
                if ($.isFunction(fnFail)) {
                    fnFail.call(this, this, jqXHR, textStatus, errorThrown);
                }
            });
        }

        /**
         * Execute a DELETE request
         */
        public remove(fnDone?: Function, fnFail?: Function): void {
            $.ajax({
                method: 'DELETE',
                url: this.uri + "/" + this.id,
                contentType: "application/json"
            }).done((resourceData: any, textStatus: string, jqXHR: any): void => {

                this.id = null;

                if ($.isFunction(fnDone)) {
                    fnDone.call(this, this, resourceData, textStatus, jqXHR);
                }

            }).fail((jqXHR: any, textStatus: string, errorThrown: any): void => {
                if ($.isFunction(fnFail)) {
                    fnFail.call(this, this, jqXHR, textStatus, errorThrown);
                }
            });
        }

        /**
         * Execute a GET request
         */
        public load(id: string, fnDone?: Function, fnFail?: Function): void {
            $.getJSON(this.uri + '/' + id).done((data: any, textStatus: string, jqXHR: any): void => {

                this.fromJson(data);

                if ($.isFunction(fnDone)) {
                    fnDone.call(this, this, data, textStatus, jqXHR);
                }

            }).fail((jqXHR: any, textStatus: string, errorThrown: any): void => {
                if ($.isFunction(fnFail)) {
                    fnFail.call(this, this, jqXHR, textStatus, errorThrown);
                }
            });
        }

        /**
         * Execute a GET request
         */
        public list(fnDone?: Function, fnFail?: Function): void {
            $.getJSON(this.uri).done((data: any, textStatus: string, jqXHR: any): void => {

                if ($.isFunction(fnDone)) {
                    fnDone.call(this, data, textStatus, jqXHR);
                }

            }).fail((jqXHR: any, textStatus: string, errorThrown: any): void => {
                if ($.isFunction(fnFail)) {
                    fnFail.call(this, jqXHR, textStatus, errorThrown);
                }
            });
        }

        /**
         * Execute a GET request for a sub operation resource
         */
        public sublist(operation: string, fnDone?: Function, fnFail?: Function): void {
            $.getJSON(this.uri + '/' + this.id + '/' + operation).done((data: any, textStatus: string, jqXHR: any): void => {

                if ($.isFunction(fnDone)) {
                    fnDone.call(this, data, textStatus, jqXHR);
                }

            }).fail((jqXHR: any, textStatus: string, errorThrown: any): void => {
                if ($.isFunction(fnFail)) {
                    fnFail.call(this, jqXHR, textStatus, errorThrown);
                }
            });
        }

        /**
         * Save data depending on id
         * No id => create
         * id => update
         * id = -1 => remove
         */
        public save(fnDone?: Function, fnFail?: Function): void {

            if (!this.id) {
                // Create
                this.create(fnDone, fnFail);
            } else if (this.id == -1) {
                // Delete
                this.remove(fnDone, fnFail);
            } else {
                // Update
                this.update(fnDone, fnFail);
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
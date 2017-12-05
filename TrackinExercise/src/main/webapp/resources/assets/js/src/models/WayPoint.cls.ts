module models {

    export class WayPoint {

        private static API: string = "api/waypoints";
        private static MILE: number = 1609.344;

        public id: number;
        public label: string;
        public latitude: string;
        public longitude: string;
        public position: number;
        public type: KnockoutObservable<number> = ko.observable<number>(0);
        public distance: KnockoutObservable<number> = ko.observable<number>(0);
        public duration: KnockoutObservable<number> = ko.observable<number>(0);

        public distanceInMiles: KnockoutComputed<number>;
        public durationInMinutes: KnockoutComputed<number>;

        public constructor(json: any) {
            
            if (typeof (json) == 'object') {
                this.fromJson(json);
            }
            
            if (typeof (json) == 'string') {
                this.label = json;
            }

            this.distanceInMiles = ko.computed((): number => {
                let distance: number = this.distance();
                return Math.round(distance / WayPoint.MILE * 100) / 100;
            }).extend({ throttle: 100 });

            this.durationInMinutes = ko.computed((): number => {
                let duration: number = this.duration();
                return Math.round(duration / 60);
            }).extend({ throttle: 100 });

        }

        public data(): any {
            return {
                id: this.id,
                label: this.label,
                latitude: this.latitude,
                longitude: this.longitude,
                position: this.position,
                type: this.type()
            }
        }

        public toJson(): string {
            return JSON.stringify(this.data());
        }

        public fromJson(json: any): any {
            this.id = json.id;
            this.label = json.label;
            this.latitude = json.latitude;
            this.longitude = json.longitude;
            this.position = json.position;
            this.type(json.type);
        }

        public getCoordinates(): any {
            return {
                lat: parseFloat(this.latitude),
                lng: parseFloat(this.longitude)
            };
        }

        public setCoordinates(lat, lng) {
            this.latitude = lat;
            this.longitude = lng;
        }

        public setType(n: number): void {
            this.type(n);
        }

        public save(fn?: Function): void {

            if (!this.id) {
                // Create
                WayPoint.create(this, fn);
            } else if (this.id == -1) {
                // Delete
                WayPoint.remove(this, fn);
            } else {
                // Update
                WayPoint.update(this, fn);
            }
        }

        public remove(fn?: Function): void {
            WayPoint.remove(this, fn);
        }

        public static create(wayPoint: WayPoint, fn?: Function): void {
            $.ajax({
                method: 'POST',
                url: WayPoint.API,
                data: wayPoint.toJson(),
                contentType: "application/json"
            }).done(function(wayPointData) {

                // Update id
                wayPoint.id = wayPointData.id;

                if ($.isFunction(fn)) {
                    fn.call(this);
                }

            });
        }

        public static update(wayPoint: WayPoint, fn?: Function): void {
            $.ajax({
                method: 'PUT',
                url: WayPoint.API + "/" + wayPoint.id,
                data: wayPoint.toJson(),
                contentType: "application/json"
            }).done(function(wayPointData) {

                if ($.isFunction(fn)) {
                    fn.call(this);
                }

            });
        }

        public static remove(wayPoint: WayPoint, fn?: Function): void {
            $.ajax({
                method: 'DELETE',
                url: WayPoint.API + "/" + wayPoint.id,
                contentType: "application/json"
            }).done(function(wayPointData) {

                wayPoint.id = null;

                if ($.isFunction(fn)) {
                    fn.call(this);
                }

            });
        }

        public static list(fn?: Function): void {
            $.getJSON(WayPoint.API).done(function(data) {

                if ($.isFunction(fn)) {
                    fn.call(this, data);
                }

            });
        }

    }

}
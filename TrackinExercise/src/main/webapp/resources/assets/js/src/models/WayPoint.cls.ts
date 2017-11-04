module models {

    export class WayPoint {

        public id: number;
        public label: string;
        public latitude: string;
        public longitude: string;
        public type: KnockoutObservable<number> = ko.observable<number>(0);

        public constructor(json: any) {
            if (typeof (json) == 'object') {
                this.fromJson(json);
            }
            if (typeof (json) == 'string') {
                this.label = json;
            }

        }

        public data(): any {
            return {
                id: this.id,
                label: this.label,
                latitude: this.latitude,
                longitude: this.longitude,
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
    }

}
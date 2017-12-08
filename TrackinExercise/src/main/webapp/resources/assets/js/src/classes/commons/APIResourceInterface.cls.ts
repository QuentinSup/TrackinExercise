module trackinexercise.commons {

    /**
     * Interface to all API resources
     */
    export interface APIResourceInterface {
        id: number;
        fromJson(data: any): void;
        toJson(): any;
    }

}
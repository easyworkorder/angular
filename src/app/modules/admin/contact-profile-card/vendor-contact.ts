export class VendorContact {
    constructor(
        public id: any,
        public first_name: string,
        public last_name: string,
        public title: string,
        public companyName: any,
        public address: string,
        public city: string,
        public state: string,
        public postal_code: string,
        public photo?: any,
        public email?: any,
        public emergencyPhone?: any,
        public mobile?: any,
        public phone?: any,
        public fax?: any,
        public phone_extension?: any
    ) { }
}

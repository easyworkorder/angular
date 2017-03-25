/**
 * Created by root on 3/18/17.
 */

export interface ITicket{
    building: string;
    tenant: string;
    problemtype: string;
    priority: string;
    employee: string;
    group: string;
    title: string;
    description:string;
    is_private:boolean;
    estimated_amount:number;
    is_billable: boolean;
    is_safety_issue: boolean;
    status: string;
}
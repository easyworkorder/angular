/**
 * Created by root on 3/18/17.
 */

export interface ITicket{
    company: string;
    building: string;
    tenant: string;
    problemtype: string;
    priority: string;
    employee: string;
    group: string;
    submit_time: number;
    description:string;
    is_private:boolean;
    estimated_amount:number;
    is_billable: boolean;
    is_safety_issue: boolean;
    status: string;
    respond_within: string;
    respond_within_unit: string;
    resolve_within: string;
    resolve_within_unit: string;
}